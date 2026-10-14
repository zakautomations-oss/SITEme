import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Link, useLocation } from "react-router-dom";
import { RouteMeta } from "../App";
import { canonicalPath, getRouteMeta } from "./routes.js";

function MetaFixture() {
  const location = useLocation();
  return <><RouteMeta /><output>{location.pathname + location.search + location.hash}</output><Link to="/admin">Admin</Link><Link to="/about">About</Link><Link to="/does-not-exist">Missing page</Link></>;
}

describe("route metadata", () => {
  it("normalizes known pages without lowercasing asset names or invented routes", () => {
    expect(canonicalPath("/Services/")).toBe("/services");
    expect(canonicalPath("/Website-App-Design/")).toBe("/website-app-design");
    expect(canonicalPath("/SOLUTIONS/REDUCE-WORKLOAD///")).toBe("/solutions/reduce-workload");
    expect(canonicalPath("/assets/ImageABC.png")).toBeNull();
    expect(canonicalPath("/services-extra")).toBeNull();
    expect(getRouteMeta("/Services/").title).toBe("Our Process | Ackra AI");
    expect(getRouteMeta("/Website-App-Design/").canonical).toBe("https://ackra.ai/website-app-design");
  });

  it("replaces a noncanonical client URL while preserving query and anchor", async () => {
    render(<MemoryRouter initialEntries={["/Services/?source=mail#step-02"]}><MetaFixture /></MemoryRouter>);
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe("/services?source=mail#step-02"));
    expect(document.title).toBe("Our Process | Ackra AI");
    expect(document.querySelector('link[rel="canonical"]').href).toBe("https://ackra.ai/services");
    expect(document.querySelector('meta[property="og:url"]').content).toBe("https://ackra.ai/services");
  });

  it("sets noindex for admin and missing pages, then restores public metadata", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/about"]}><MetaFixture /></MemoryRouter>);
    await user.click(screen.getByRole("link", { name: "Admin", exact: true }));
    expect(document.title).toBe("Admin | Ackra AI");
    expect(document.querySelector('meta[name="robots"]').content).toBe("noindex, nofollow");
    await user.click(screen.getByRole("link", { name: "Missing page" }));
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
    await user.click(screen.getByRole("link", { name: "About", exact: true }));
    expect(document.title).toBe("About | Ackra AI");
    expect(document.querySelector('meta[name="robots"]').content).toContain("index, follow");
    expect(document.querySelector('meta[name="googlebot"]').content).not.toContain("noindex");
    expect(document.querySelector('meta[property="og:url"]').content).toBe("https://ackra.ai/about");
  });
});
