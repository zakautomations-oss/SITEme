import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DesignShowcase from "./DesignShowcase";

describe("design showcase", () => {
  it("reveals the named panel when a tab is clicked and hides the previous panel", async () => {
    const user = userEvent.setup();
    render(<DesignShowcase />);
    const website = screen.getByRole("tab", { name: /website design/i });
    const app = screen.getByRole("tab", { name: /app design/i });
    const websitePanel = screen.getByRole("tabpanel", { name: /website design/i });
    const appPanel = document.getElementById(app.getAttribute("aria-controls"));

    expect(websitePanel).toBeVisible();
    expect(appPanel).not.toBeVisible();

    await user.click(app);
    expect(screen.getAllByRole("tabpanel")).toEqual([appPanel]);
    expect(screen.getByRole("tabpanel", { name: /app design/i })).toBeVisible();
    expect(websitePanel).not.toBeVisible();
    expect(app).toHaveAttribute("aria-selected", "true");
    expect(website).toHaveAttribute("aria-selected", "false");

    await user.click(website);
    expect(screen.getAllByRole("tabpanel")).toEqual([websitePanel]);
    expect(screen.getByRole("tabpanel", { name: /website design/i })).toBeVisible();
    expect(appPanel).not.toBeVisible();
    expect(website).toHaveAttribute("aria-selected", "true");
    expect(app).toHaveAttribute("aria-selected", "false");
  });

  it("moves selection and focus with arrow, Home and End keys and keeps one tab stop", async () => {
    const user = userEvent.setup();
    render(<DesignShowcase />);
    const tabs = screen.getAllByRole("tab");

    await user.tab();
    expect(tabs[0]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");

    for (const [key, selectedIndex] of [
      ["ArrowRight", 1],
      ["ArrowRight", 0],
      ["ArrowLeft", 1],
      ["ArrowLeft", 0],
      ["End", 1],
      ["Home", 0],
    ]) {
      await user.keyboard(`{${key}}`);
      const selected = tabs[selectedIndex];
      const inactive = tabs[1 - selectedIndex];
      expect(selected).toHaveFocus();
      expect(selected).toHaveAttribute("aria-selected", "true");
      expect(selected).toHaveAttribute("tabindex", "0");
      expect(inactive).toHaveAttribute("aria-selected", "false");
      expect(inactive).toHaveAttribute("tabindex", "-1");
      expect(screen.getAllByRole("tabpanel")).toEqual([
        document.getElementById(selected.getAttribute("aria-controls")),
      ]);
    }
  });

  it("keeps panel relationships and selection independent across two instances", async () => {
    const user = userEvent.setup();
    render(<><DesignShowcase /><DesignShowcase compact /></>);
    const tabs = screen.getAllByRole("tab");
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    const ids = [...tabs, ...panels].map((element) => element.id);
    const controlledIds = tabs.map((tab) => tab.getAttribute("aria-controls"));

    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(controlledIds).size).toBe(tabs.length);
    for (const tab of tabs) {
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      expect(panels).toContain(panel);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    }

    const [firstWebsite, secondWebsite] = screen.getAllByRole("tab", { name: /website design/i });
    const [firstApp, secondApp] = screen.getAllByRole("tab", { name: /app design/i });
    await user.click(firstApp);
    expect(firstApp).toHaveAttribute("aria-selected", "true");
    expect(firstWebsite).toHaveAttribute("aria-selected", "false");
    expect(secondWebsite).toHaveAttribute("aria-selected", "true");
    expect(secondApp).toHaveAttribute("aria-selected", "false");
    expect(screen.getAllByRole("tabpanel")).toEqual([
      document.getElementById(firstApp.getAttribute("aria-controls")),
      document.getElementById(secondWebsite.getAttribute("aria-controls")),
    ]);
  });
});
