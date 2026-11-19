import React, { StrictMode, useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { useScrollReveal } from "./useScrollReveal";

const observers = [];
const listeners = new Set();
const frames = new Map();
let reduced;
let scrollOffset;
let frameId;

function flushFrames() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(0));
  });
}
function mount(component) {
  const result = render(component);
  flushFrames();
  return result;
}

function Fixture() {
  const root = useRef(null);
  useScrollReveal(root, "[data-reveal-target]");
  return <div ref={root}>
    <section data-reveal-target data-top="-300">Earlier content</section>
    <section data-reveal-target data-top="100">Visible content</section>
    <section data-reveal-target data-top="795">Peeking into view</section>
    <section data-reveal-target data-top="1000" data-testid="later"><details><summary>Later disclosure</summary></details></section>
    <section data-reveal-target data-top="2000" data-testid="last"><div role="tabpanel" tabIndex={0}>Later panel</div></section>
  </div>;
}

function preference(value) {
  reduced = value;
  act(() => listeners.forEach(listener => listener({ matches: !reduced })));
}

beforeEach(() => {
  reduced = false;
  observers.length = 0;
  listeners.clear();
  frames.clear();
  scrollOffset = 0;
  frameId = 0;
  vi.stubGlobal("requestAnimationFrame", callback => { frames.set(++frameId, callback); return frameId; });
  vi.stubGlobal("cancelAnimationFrame", id => frames.delete(id));
  vi.stubGlobal("innerHeight", 800);
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    get matches() { return !reduced; },
    addEventListener(_event, listener) { listeners.add(listener); },
    removeEventListener(_event, listener) { listeners.delete(listener); },
  })));
  // jsdom has no layout or IntersectionObserver; keep the hook and DOM real.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () {
    const top = Number(this.dataset.top || 0) - scrollOffset;
    return { x: 0, y: top, top, bottom: top + 400, left: 0, right: 300, width: 300, height: 400, toJSON() {} };
  });
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
    deliver(target, isIntersecting, intersectionRatio = 0.01) {
      if (!this.targets.has(target)) return;
      const rect = target.getBoundingClientRect();
      this.callback([{ target, isIntersecting, intersectionRatio, time: 0, boundingClientRect: rect, intersectionRect: rect, rootBounds: null }], this);
    }
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("scroll reveals", () => {
  it.each([390, 768, 1440])("preserves the opening and restored content at %ipx while preparing offscreen groups", (width) => {
    vi.stubGlobal("innerWidth", width);
    mount(<Fixture />);
    for (const text of ["Earlier content", "Visible content", "Peeking into view"]) {
      expect(screen.getByText(text)).not.toHaveAttribute("data-scroll-reveal");
    }
    expect(screen.getByTestId("later")).toHaveAttribute("data-scroll-reveal", "pending");
    expect(screen.getByTestId("last")).toHaveAttribute("data-scroll-reveal", "pending");
  });

  it("waits for route scroll restoration before deciding which sections are already visible", () => {
    scrollOffset = 1600;
    render(<Fixture />);
    // The app resets the scroll position in a sibling route-ready effect.
    scrollOffset = 0;
    flushFrames();
    expect(screen.getByTestId("later")).toHaveAttribute("data-scroll-reveal", "pending");
    expect(screen.getByTestId("last")).toHaveAttribute("data-scroll-reveal", "pending");
  });

  it("reveals even a small visible portion once and removes animation state when it finishes", () => {
    mount(<Fixture />);
    const later = screen.getByTestId("later");
    const observer = observers[0];
    act(() => observer.deliver(later, false));
    expect(later).toHaveAttribute("data-scroll-reveal", "pending");
    act(() => observer.deliver(later, true));
    expect(later).toHaveAttribute("data-scroll-reveal", "revealing");
    const end = new Event("animationend", { bubbles: true });
    Object.defineProperty(end, "animationName", { value: "home-scroll-reveal" });
    fireEvent(later, end);
    expect(later).not.toHaveAttribute("data-scroll-reveal");
    act(() => { observer.deliver(later, false); observer.deliver(later, true); });
    expect(later).not.toHaveAttribute("data-scroll-reveal");
  });

  it("immediately exposes focused summaries and tab panels without a delayed entrance", () => {
    mount(<Fixture />);
    fireEvent.focusIn(screen.getByText("Later disclosure"));
    fireEvent.focusIn(screen.getByRole("tabpanel"));
    expect(screen.getByTestId("later")).not.toHaveAttribute("data-scroll-reveal");
    expect(screen.getByTestId("last")).not.toHaveAttribute("data-scroll-reveal");
    act(() => observers[0].deliver(screen.getByTestId("later"), true));
    expect(screen.getByTestId("later")).not.toHaveAttribute("data-scroll-reveal");
  });

  it("reveals pending and animating groups when reduced motion changes, without hiding them again", () => {
    mount(<Fixture />);
    const later = screen.getByTestId("later");
    act(() => observers[0].deliver(later, true));
    preference(true);
    expect(later).not.toHaveAttribute("data-scroll-reveal");
    expect(screen.getByTestId("last")).not.toHaveAttribute("data-scroll-reveal");
    preference(false);
    expect(later).not.toHaveAttribute("data-scroll-reveal");
    expect(screen.getByTestId("last")).not.toHaveAttribute("data-scroll-reveal");
  });

  it.each(["reduced motion", "no observer", "no media queries"])("leaves all content readable with %s", (mode) => {
    if (mode === "reduced motion") reduced = true;
    if (mode === "no observer") vi.stubGlobal("IntersectionObserver", undefined);
    if (mode === "no media queries") vi.stubGlobal("matchMedia", undefined);
    mount(<Fixture />);
    expect(document.querySelector("[data-scroll-reveal]")).toBeNull();
  });

  it("cleans up hidden state and subscriptions under StrictMode and on unmount", () => {
    const { unmount } = mount(<StrictMode><Fixture /></StrictMode>);
    const later = screen.getByTestId("later");
    expect(observers.filter(observer => observer.targets.size > 0)).toHaveLength(1);
    expect(listeners.size).toBe(1);
    unmount();
    expect(later).not.toHaveAttribute("data-scroll-reveal");
    expect(observers.every(observer => observer.targets.size === 0)).toBe(true);
    expect(listeners.size).toBe(0);
    expect(frames.size).toBe(0);
  });

  it("renders readable server content without accessing browser capabilities", () => {
    const html = renderToString(<Fixture />);
    expect(html).toContain("Later disclosure");
    expect(html).not.toContain("data-scroll-reveal");
    expect(window.matchMedia).not.toHaveBeenCalled();
  });
});
