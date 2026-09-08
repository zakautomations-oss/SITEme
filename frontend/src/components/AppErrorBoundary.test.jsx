import React from "react";
import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AppErrorBoundary from "./AppErrorBoundary";

it("keeps recovery actions available when a page or lazy chunk fails", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const ignoreExpectedError = (event) => { if (event.error?.message === "Failed to fetch dynamically imported module") event.preventDefault(); };
  window.addEventListener("error", ignoreExpectedError);
  function BrokenPage() { throw new Error("Failed to fetch dynamically imported module"); }
  render(<AppErrorBoundary><BrokenPage /></AppErrorBoundary>);
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.getByRole("button", { name: "Refresh page" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
  expect(screen.queryByText("Failed to fetch dynamically imported module")).not.toBeInTheDocument();
  window.removeEventListener("error", ignoreExpectedError);
});
