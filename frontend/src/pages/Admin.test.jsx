import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Admin from "./Admin";

vi.mock("axios", () => ({ default: { get: vi.fn(), delete: vi.fn(), isCancel: vi.fn() } }));

function inquiry(number, message = "An example workflow inquiry.") {
  return {
    id: `synthetic-${number}`, name: `Synthetic lead ${number}`, email: `synthetic-${number}@example.com`,
    phone: null, company: "Example company", message, created_at: "2026-09-08T12:00:00+00:00",
  };
}
function page(items, total = items.length, number = 1) {
  return { data: { items, total, page: number, page_size: 25 } };
}

beforeEach(() => {
  vi.resetAllMocks();
  sessionStorage.clear();
  sessionStorage.setItem("ackra_admin_token", "local-test-admin");
  axios.isCancel.mockReturnValue(false);
});

describe("admin inquiry management", () => {
  it("reveals the full message and can collapse it again without losing content", async () => {
    const ending = "This final detail must be readable.";
    const message = "Synthetic workflow context. ".repeat(12) + ending;
    axios.get.mockResolvedValue(page([inquiry(1, message)]));
    render(<Admin />);
    const expand = await screen.findByRole("button", { name: "Read full message" });
    expect(screen.queryByText(message)).not.toBeInTheDocument();
    expect(expand).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(expand);
    expect(screen.getByText(message)).toBeVisible();
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(screen.getByRole("button", { name: "Show less" }));
    expect(screen.queryByText(message)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Read full message" })).toHaveAttribute("aria-expanded", "false");
  });

  it("navigates to older inquiries using the API total and correct page bounds", async () => {
    const firstPage = Array.from({ length: 25 }, (_, index) => inquiry(index + 1));
    axios.get.mockImplementation((_url, config) => Promise.resolve(
      config.params.page === 2 ? page([inquiry(26)], 26, 2) : page(firstPage, 26)
    ));
    render(<Admin />);
    expect(await screen.findByText("26 inquiries total")).toBeVisible();
    expect(screen.getByText("1–25 of 26 · Page 1 of 2")).toBeVisible();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("26–26 of 26 · Page 2 of 2")).toBeVisible();
    expect(screen.getByText("Synthetic lead 26")).toBeVisible();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(axios.get).toHaveBeenLastCalledWith("/api/admin/contacts", expect.objectContaining({
      headers: { Authorization: "Bearer local-test-admin" }, params: { page: 2, page_size: 25 },
    }));
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(await screen.findByText("1–25 of 26 · Page 1 of 2")).toBeVisible();
    expect(screen.queryByText("Synthetic lead 26")).not.toBeInTheDocument();
  });

  it("only deletes after confirmation, then refreshes the total and empty state", async () => {
    axios.get.mockResolvedValueOnce(page([inquiry(1)])).mockResolvedValue(page([], 0));
    axios.delete.mockResolvedValue({ data: { deleted: "synthetic-1" } });
    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    render(<Admin />);
    const remove = await screen.findByRole("button", { name: "Delete inquiry from Synthetic lead 1" });
    await userEvent.click(remove);
    expect(axios.delete).not.toHaveBeenCalled();
    expect(screen.getByText("Synthetic lead 1")).toBeVisible();
    await userEvent.click(remove);
    expect(await screen.findByText("The inbox is clear.")).toBeVisible();
    expect(screen.getByText("0 inquiries total")).toBeVisible();
    expect(screen.getByText("Inquiry deleted.")).toBeVisible();
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(axios.delete).toHaveBeenCalledExactlyOnceWith("/api/contact/synthetic-1", expect.objectContaining({
      headers: { Authorization: "Bearer local-test-admin" },
    }));
  });

  it("returns to the access gate and clears stored credentials after a 401", async () => {
    axios.get.mockRejectedValue({ response: { status: 401 } });
    render(<Admin />);
    expect(await screen.findByTestId("admin-gate")).toBeVisible();
    await waitFor(() => expect(sessionStorage.getItem("ackra_admin_token")).toBeNull());
    expect(screen.queryByTestId("page-admin")).not.toBeInTheDocument();
  });
});
