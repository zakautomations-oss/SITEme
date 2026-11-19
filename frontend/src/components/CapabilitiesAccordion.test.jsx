import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CapabilitiesAccordion from "./CapabilitiesAccordion";

describe("capabilities accordion", () => {
  it("starts with operations expanded and includes custom projects after the existing services", () => {
    render(<CapabilitiesAccordion />);
    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Business automation", "Customer conversations", "Custom projects",
    ]);
    expect(screen.getByRole("button", { name: "Business automation" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Business automation" })).toHaveTextContent("Keep customer records, order details, and repair updates in step with your existing tools. AI handles routine updates and flags anything your jewelry team needs to review.");
    expect(screen.getByText("Answer questions about pieces using your product information, arrange consultations, and follow up after an enquiry. Available by phone, text, or web chat, with your team handling personal recommendations.")).not.toBeVisible();
  });

  it("opens a panel on click, closes the previous panel, and supports collapsing all", async () => {
    render(<CapabilitiesAccordion />);
    const conversational = screen.getByRole("button", { name: "Customer conversations" });
    await userEvent.click(conversational);
    expect(conversational).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Business automation" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Customer conversations" })).toHaveTextContent("Answer questions about pieces using your product information, arrange consultations, and follow up after an enquiry. Available by phone, text, or web chat, with your team handling personal recommendations.");
    await userEvent.click(conversational);
    expect(conversational).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Custom projects" }));
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Custom projects" })).toHaveTextContent("Connect the steps behind custom orders, repair requests, or trade enquiries. We build around your jewelry business and agree on which decisions stay with your team.");
  });

  it("supports Enter, Space, arrow keys, Home and End without moving focus into hidden content", async () => {
    render(<CapabilitiesAccordion />);
    const user = userEvent.setup();
    screen.getByRole("button", { name: "Business automation" }).focus();
    await user.keyboard("{ArrowRight}");
    const conversational = screen.getByRole("button", { name: "Customer conversations" });
    expect(conversational).toHaveFocus();
    expect(conversational).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{Enter}");
    expect(conversational).toHaveAttribute("aria-expanded", "true");
    expect(conversational).toHaveFocus();
    await user.keyboard(" ");
    expect(conversational).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Custom projects" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Custom projects" })).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Business automation" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("button", { name: "Custom projects" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "Business automation" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Custom projects" })).toHaveFocus();
    expect(document.querySelectorAll('.capabilities-panel:not([open]) .capabilities-content :is(a, button, input, [tabindex="0"])')).toHaveLength(0);
  });

  it("provides native disclosures with all copy in server-rendered HTML", () => {
    const markup = renderToStaticMarkup(<CapabilitiesAccordion />);
    const document = new DOMParser().parseFromString(markup, "text/html");
    expect(document.querySelectorAll("details")).toHaveLength(3);
    expect(document.querySelectorAll("details[open]")).toHaveLength(1);
    expect(document.querySelectorAll("summary[aria-expanded]")).toHaveLength(0);
    expect(document.querySelector("[data-interacted]")).toBeNull();
    expect(document.body.textContent).not.toContain("Review follow-ups");
    expect(document.body.textContent).not.toContain("Ask customers for honest reviews and bring service issues to the right person.");
    expect(document.body.textContent).toContain("Connect the steps behind custom orders, repair requests, or trade enquiries. We build around your jewelry business and agree on which decisions stay with your team.");
    document.querySelectorAll("summary").forEach((summary) => {
      expect(document.getElementById(summary.getAttribute("aria-controls"))).not.toBeNull();
    });
  });

  it("keeps only the latest disclosure accessible when switched before an entrance finishes", async () => {
    render(<CapabilitiesAccordion />);
    const user = userEvent.setup();
    const accordion = screen.getByTestId("capabilities-accordion");
    // Hydration must not fade out content that was already readable in HTML.
    expect(accordion).not.toHaveAttribute("data-interacted");
    const conversational = screen.getByRole("button", { name: "Customer conversations" });
    const custom = screen.getByRole("button", { name: "Custom projects" });
    const operations = screen.getByRole("button", { name: "Business automation" });

    await user.click(conversational);
    await user.click(custom);
    await user.click(operations);
    expect(operations).toHaveFocus();
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Business automation" })).toBeVisible();
    expect(accordion.querySelectorAll("details[open]")).toHaveLength(1);
    for (const closed of accordion.querySelectorAll("details:not([open])")) {
      expect(closed.querySelector('[role="region"]')).toHaveAttribute("hidden");
      expect(closed.querySelector("summary")).toHaveAttribute("aria-expanded", "false");
    }

    // A late animation event from the outgoing panel cannot restore it or
    // delay a subsequent collapse. Motion never owns the disclosure state.
    fireEvent.animationEnd(document.getElementById(custom.getAttribute("aria-controls")));
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(operations).toHaveFocus();
  });

  it("keeps identifiers independent if more than one accordion is mounted", () => {
    render(<><CapabilitiesAccordion /><CapabilitiesAccordion /></>);
    const ids = [...document.querySelectorAll(".capabilities-accordion [id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    const buttons = screen.getAllByRole("button", { name: "Customer conversations" });
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
  });
});
