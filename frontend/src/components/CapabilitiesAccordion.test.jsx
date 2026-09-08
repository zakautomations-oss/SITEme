import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CapabilitiesAccordion from "./CapabilitiesAccordion";

describe("capabilities accordion", () => {
  it("starts with workflow expanded and preserves all four service descriptions", () => {
    render(<CapabilitiesAccordion />);
    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Workflow automation", "Text agents", "Voice agents", "Review follow-ups",
    ]);
    expect(screen.getByRole("button", { name: "Workflow automation" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Workflow automation" })).toHaveTextContent("Connect your CRM, calendar, inbox, and internal tools into workflows that run together.");
    expect(screen.getByText("Helpful replies across text and web chat, with a clear handoff when someone needs your team.")).not.toBeVisible();
  });

  it("opens a panel on click, closes the previous panel, and supports collapsing all", async () => {
    render(<CapabilitiesAccordion />);
    const voice = screen.getByRole("button", { name: "Voice agents" });
    await userEvent.click(voice);
    expect(voice).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Workflow automation" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Voice agents" })).toHaveTextContent("Voice agents that answer calls, qualify enquiries, and help customers book a time.");
    await userEvent.click(voice);
    expect(voice).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("supports Enter, Space, arrow keys, Home and End without moving focus into hidden content", async () => {
    render(<CapabilitiesAccordion />);
    const user = userEvent.setup();
    screen.getByRole("button", { name: "Workflow automation" }).focus();
    await user.keyboard("{ArrowRight}");
    const text = screen.getByRole("button", { name: "Text agents" });
    expect(text).toHaveFocus();
    expect(text).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{Enter}");
    expect(text).toHaveAttribute("aria-expanded", "true");
    expect(text).toHaveFocus();
    await user.keyboard(" ");
    expect(text).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Review follow-ups" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Workflow automation" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("button", { name: "Review follow-ups" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "Workflow automation" })).toHaveFocus();
    expect(document.querySelectorAll('.capabilities-panel:not([open]) .capabilities-content :is(a, button, input, [tabindex="0"])')).toHaveLength(0);
  });

  it("provides native disclosures with all copy in server-rendered HTML", () => {
    const markup = renderToStaticMarkup(<CapabilitiesAccordion />);
    const document = new DOMParser().parseFromString(markup, "text/html");
    expect(document.querySelectorAll("details")).toHaveLength(4);
    expect(document.querySelectorAll("details[open]")).toHaveLength(1);
    expect(document.querySelectorAll("summary[aria-expanded]")).toHaveLength(0);
    expect(document.body.textContent).toContain("Ask customers for honest reviews and bring service issues to the right person.");
    document.querySelectorAll("summary").forEach((summary) => {
      expect(document.getElementById(summary.getAttribute("aria-controls"))).not.toBeNull();
    });
  });

  it("keeps identifiers independent if more than one accordion is mounted", () => {
    render(<><CapabilitiesAccordion /><CapabilitiesAccordion /></>);
    const ids = [...document.querySelectorAll(".capabilities-accordion [id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    const buttons = screen.getAllByRole("button", { name: "Text agents" });
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
  });
});
