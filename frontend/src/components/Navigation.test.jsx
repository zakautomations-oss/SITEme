import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("switches directly between light and dark and restores the saved selection", async () => {
    const view = navigation();
    const toggle = screen.getByTestId("theme-toggle");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(toggle).toHaveAccessibleName("Theme: light. Switch to dark theme");
    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("ackra-theme")).toBe("dark");
    expect(toggle).toHaveAccessibleName("Theme: dark. Switch to light theme");
    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("ackra-theme")).toBe("light");
    await userEvent.click(toggle);
    view.unmount();
    navigation();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByTestId("theme-toggle")).toHaveAccessibleName("Theme: dark. Switch to light theme");
  });

  it.each([false, true])("migrates a legacy system selection to a fixed theme (dark: %s)", async (systemDark) => {
    localStorage.setItem("ackra-theme", "system");
    dark = systemDark;
    navigation();
    const expected = systemDark ? "dark" : "light";
    expect(document.documentElement.dataset.theme).toBe(expected);
    expect(localStorage.getItem("ackra-theme")).toBe(expected);
    expect(screen.getByTestId("theme-toggle").getAttribute("aria-label")).not.toContain("system");
    await act(async () => {
      dark = !systemDark;
      mediaListeners.forEach((listener) => listener());
    });
    expect(document.documentElement.dataset.theme).toBe(expected);
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
