import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Contact, { validateContact } from "./Contact";

vi.mock("axios", () => ({ default: { post: vi.fn() } }));
const valid = { name: "Morgan Ellis", email: "morgan@example.com", phone: "", company: "", message: "Follow up with customers after appointments.", website: "" };
function fill(values = valid) {
  Object.entries(values).forEach(([key, value]) => {
    const input = key === "website" ? document.querySelector('[name="website"]') : screen.getByTestId(`contact-input-${key}`);
    fireEvent.change(input, { target: { value } });
  });
}

beforeEach(() => vi.clearAllMocks());
describe("contact submission", () => {
  it("rejects blank and over-limit fields before sending, and preserves the field order", async () => {
    render(<Contact />);
    expect([...document.querySelectorAll("input, textarea")].map((input) => input.name)).toEqual(["name", "email", "phone", "company", "message", "website"]);
    fireEvent.change(screen.getByTestId("contact-input-name"), { target: { value: "   " } });
    await userEvent.click(screen.getByTestId("contact-submit"));
    expect(axios.post).not.toHaveBeenCalled();
    expect(screen.getByTestId("contact-input-name")).toHaveFocus();
    expect(screen.getByTestId("contact-input-name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter your name.")).toBeVisible();
    expect(validateContact({ ...valid, name: "n".repeat(121), phone: "1".repeat(41), company: "c".repeat(161), message: "m".repeat(4001) })).toEqual({
      name: "Name must be 120 characters or fewer.", phone: "Phone must be 40 characters or fewer.", company: "Company must be 160 characters or fewer.", message: "Message must be 4000 characters or fewer.",
    });
    expect(validateContact({ ...valid, email: "not-an-email" }).email).toBe("Enter a valid email address.");
  });

  it("sends trimmed data once, announces success, and starts a fresh note", async () => {
    let resolveRequest;
    axios.post.mockImplementation(() => new Promise((resolve) => { resolveRequest = resolve; }));
    render(<Contact />);
    fill({ ...valid, name: "  Morgan Ellis  ", company: "  ", phone: "  " });
    fireEvent.submit(screen.getByTestId("contact-form"));
    fireEvent.submit(screen.getByTestId("contact-form"));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/api/contact", { ...valid, phone: null, company: null }, expect.objectContaining({ timeout: 15000, signal: expect.any(AbortSignal) }));
    expect(screen.getByTestId("contact-submit")).toBeDisabled();
    resolveRequest({ data: { id: "saved" } });
    await waitFor(() => expect(screen.getByTestId("contact-success")).toHaveFocus());
    await userEvent.click(screen.getByTestId("contact-send-another"));
    await waitFor(() => expect(screen.getByTestId("contact-input-name")).toHaveFocus());
    expect(screen.getByTestId("contact-input-name")).toHaveValue("");
  });

  it("keeps the draft and offers direct email when the request times out", async () => {
    axios.post.mockRejectedValue({ code: "ECONNABORTED" });
    render(<Contact />);
    fill();
    await userEvent.click(screen.getByTestId("contact-submit"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Sending took too long");
    expect(screen.getByTestId("contact-input-message")).toHaveValue(valid.message);
    expect(screen.getByTestId("contact-submit")).toBeEnabled();
    expect(screen.getByRole("alert").querySelector("a")).toHaveAttribute("href", "mailto:ackra@ackraai.com");
  });

  it("associates server validation errors with the affected field and restores focus", async () => {
    axios.post.mockRejectedValue({ response: { status: 422, data: { detail: [{ loc: ["body", "email"], msg: "Invalid email" }] } } });
    render(<Contact />);
    fill();
    await userEvent.click(screen.getByTestId("contact-submit"));
    await waitFor(() => expect(screen.getByTestId("contact-input-email")).toHaveFocus());
    expect(screen.getByTestId("contact-input-email")).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByText("Enter a valid email address.")).toBeVisible();
  });

  it("aborts an in-flight request when the contact page unmounts", () => {
    axios.post.mockImplementation(() => new Promise(() => {}));
    const { unmount } = render(<Contact />);
    fill();
    fireEvent.submit(screen.getByTestId("contact-form"));
    const { signal } = axios.post.mock.calls[0][2];
    unmount();
    expect(signal.aborted).toBe(true);
  });
});
