import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navigation from "./Navigation";

let dark;
let mediaListeners;
beforeEach(() => {
  localStorage.clear();
  dark = false;
  mediaListeners = new Set();
  window.matchMedia = vi.fn((query) => ({
    get matches() { return query.includes("prefers-color-scheme") && dark; },
    addEventListener: (event, callback) => { if (query.includes("prefers-color-scheme")) mediaListeners.add(callback); },
    removeEventListener: (event, callback) => mediaListeners.delete(callback),
  }));
});
function navigation() { return render(<MemoryRouter><Navigation /></MemoryRouter>); }

describe("navigation controls", () => {
  it("focuses mobile links on open and returns focus to the toggle with Escape", async () => {
    navigation();
    const toggle = screen.getByTestId("nav-mobile-toggle");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("nav-mobile-link-home")).toHaveFocus();
    expect(screen.getByTestId("nav-mobile-cta-book")).toHaveTextContent("Book a call");
    await userEvent.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
    expect(screen.queryByTestId("nav-mobile-panel")).not.toBeInTheDocument();
  });

  it("closes the menu after a route change and the solutions disclosure on Escape", async () => {
    navigation();
    await userEvent.click(screen.getByTestId("nav-mobile-toggle"));
    await userEvent.click(screen.getByTestId("nav-mobile-link-contact"));
    expect(screen.queryByTestId("nav-mobile-panel")).not.toBeInTheDocument();
    const solutions = screen.getByTestId("nav-solutions-toggle");
    await userEvent.click(solutions);
    expect(solutions).toHaveAttribute("aria-expanded", "true");
    await userEvent.tab();
    expect(screen.getByTestId("nav-solutions-reduce-workload")).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(solutions).toHaveFocus();
    expect(screen.queryByTestId("nav-solutions-menu")).not.toBeInTheDocument();
  });

  it("cycles and persists theme preferences, following system changes only in system mode", async () => {
    navigation();
    const toggle = screen.getByTestId("theme-toggle");
    expect(document.documentElement.dataset.theme).toBe("light");
    await userEvent.click(toggle);
    expect(localStorage.getItem("ackra-theme")).toBe("light");
    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("dark");
    dark = false;
    mediaListeners.forEach((listener) => listener());
    expect(document.documentElement.dataset.theme).toBe("dark");
    await userEvent.click(toggle);
    expect(localStorage.getItem("ackra-theme")).toBe("system");
    expect(document.documentElement.dataset.theme).toBe("light");
    dark = true;
    mediaListeners.forEach((listener) => listener());
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"));
  });

  it("closes open disclosures when clicking outside the header", async () => {
    navigation();
    await userEvent.click(screen.getByTestId("nav-solutions-toggle"));
    fireEvent.pointerDown(document.body);
    expect(screen.queryByTestId("nav-solutions-menu")).not.toBeInTheDocument();
  });

  it("closes the mobile panel when keyboard focus moves into the page", async () => {
    render(<MemoryRouter><Navigation /><a href="#main">Continue reading</a></MemoryRouter>);
    await userEvent.click(screen.getByTestId("nav-mobile-toggle"));
    screen.getByTestId("nav-mobile-cta-book").focus();
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Continue reading" })).toHaveFocus();
    expect(screen.queryByTestId("nav-mobile-panel")).not.toBeInTheDocument();
    expect(screen.getByTestId("nav-mobile-toggle")).toHaveAttribute("aria-expanded", "false");
  });
});
