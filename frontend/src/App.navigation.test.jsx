import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter } from "react-router-dom";
import App from "./App";

const loading = vi.hoisted(() => ({ process: null }));

// Retain the real App, router, error boundary, header, footer, and RouteFocus.
// Small route fixtures let the tests control when lazy page content becomes ready.
vi.mock("./pages/Home", () => ({
  default: function HomeFixture() {
    return <><h1>Home fixture</h1><Link to="/services#step-02">Jump to the second process step</Link></>;
  },
}));
vi.mock("./pages/Services", () => ({
  default: function ProcessFixture() {
    if (loading.process) throw loading.process;
    return <><h1>Process fixture</h1><section id="step-02"><h2>Second process step</h2></section></>;
  },
}));

let scrollCalls;
let anchorCalls;
let originalScrollIntoView;
function holdProcessPage() {
  let release;
  loading.process = new Promise((resolve) => { release = resolve; });
  return async () => {
    await act(async () => {
      loading.process = null;
      release();
    });
  };
}
function renderApp(initialEntry = "/") {
  return render(<MemoryRouter initialEntries={[initialEntry]}><App /></MemoryRouter>);
}

beforeEach(() => {
  loading.process = null;
  localStorage.clear();
  scrollCalls = [];
  anchorCalls = [];
  vi.stubGlobal("scrollY", 960);
  vi.stubGlobal("scrollTo", vi.fn((options) => {
    scrollCalls.push({ options, heading: document.querySelector("main h1")?.textContent });
  }));
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  originalScrollIntoView = Object.getOwnPropertyDescriptor(Element.prototype, "scrollIntoView");
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(function () { anchorCalls.push(this); }),
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  if (originalScrollIntoView) Object.defineProperty(Element.prototype, "scrollIntoView", originalScrollIntoView);
  else delete Element.prototype.scrollIntoView;
});

describe("App route scroll and focus", () => {
  it("leaves restored scroll alone on initial entry", async () => {
    renderApp();
    expect(await screen.findByRole("heading", { name: "Home fixture" })).toBeVisible();
    expect(window.scrollY).toBe(960);
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("main")).not.toHaveFocus();
    expect(anchorCalls).toHaveLength(0);
  });

  it("scrolls footer navigation to the top and focuses the new main after the destination is ready", async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole("heading", { name: "Home fixture" });
    const originalMain = screen.getByRole("main");
    const release = holdProcessPage();
    await user.click(within(screen.getByRole("navigation", { name: "Footer navigation" })).getByRole("link", { name: "Process" }));
    expect(await screen.findByText("Loading page…")).toBeVisible();
    // The keyed boundary really remounted, reproducing the original regression.
    expect(originalMain.isConnected).toBe(false);
    expect(window.scrollTo).not.toHaveBeenCalled();
    await release();
    expect(await screen.findByRole("heading", { name: "Process fixture" })).toBeVisible();
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
    expect(window.scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 0, left: 0, behavior: "instant" });
    expect(scrollCalls).toEqual([{ options: { top: 0, left: 0, behavior: "instant" }, heading: "Process fixture" }]);
  });

  it("scrolls cross-route hash links to the actual target after its content is ready", async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole("heading", { name: "Home fixture" });
    const release = holdProcessPage();
    await user.click(screen.getByRole("link", { name: "Jump to the second process step" }));
    expect(await screen.findByText("Loading page…")).toBeVisible();
    expect(anchorCalls).toHaveLength(0);
    expect(window.scrollTo).not.toHaveBeenCalled();
    await release();
    await screen.findByRole("heading", { name: "Second process step" });
    await waitFor(() => expect(anchorCalls).toEqual([document.getElementById("step-02")]));
    expect(anchorCalls[0].isConnected).toBe(true);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
