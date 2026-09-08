import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import IntegrationMarquee from "./IntegrationMarquee";

describe("integration marquee controls", () => {
  it("preserves explicit pause after pointer and focus leave, until the visitor resumes", async () => {
    const user = userEvent.setup();
    render(<><IntegrationMarquee /><button>Outside the integrations</button></>);
    const region = screen.getByRole("region", { name: "Integrations" });
    await user.hover(region);
    await user.click(screen.getByRole("button", { name: "Pause integration animation" }));
    expect(region).toHaveClass("is-paused");
    await user.unhover(region);
    await user.tab();
    expect(screen.getByRole("button", { name: "Outside the integrations" })).toHaveFocus();
    expect(region).toHaveClass("is-paused");
    const resume = screen.getByRole("button", { name: "Play integration animation" });
    await user.click(resume);
    expect(region).not.toHaveClass("is-paused");
    expect(screen.getByRole("button", { name: "Pause integration animation" })).toBeVisible();
  });

  it("exposes one integration list while decorative looping copies stay inaccessible", () => {
    render(<IntegrationMarquee />);
    const region = screen.getByRole("region", { name: "Integrations" });
    expect(within(region).getAllByRole("list")).toHaveLength(1);
    expect(within(region).getAllByRole("listitem")).toHaveLength(5);
    for (const name of ["HubSpot", "Notion", "Stripe", "Zapier", "Google Sheets"]) {
      expect(within(within(region).getByRole("list")).getByText(name)).toBeVisible();
    }
    const duplicate = region.querySelector('[aria-hidden="true"].integration-copy');
    expect(duplicate).not.toBeNull();
    expect(duplicate.querySelectorAll("a, button, input, [tabindex]")).toHaveLength(0);
  });

  it("leaves the server-rendered list readable without a nonworking animation control", () => {
    const html = renderToString(<IntegrationMarquee />);
    expect(html).toContain("HubSpot");
    expect(html).not.toContain("is-ready");
    expect(html).not.toContain("<button");
  });
});
