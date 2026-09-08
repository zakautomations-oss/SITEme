import React, { StrictMode, useEffect, useRef, useState } from "react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { HOME_MOTION_QUERY } from "./useHomeMotionEnabled";

let HomeMotion;
let gsap;
let ScrollTrigger;
let compatible = true;
const mediaQueries = new Map();
const observers = [];

// Keep real GSAP/useGSAP/ScrollTrigger. These primitives model capabilities that
// jsdom does not implement; trigger registration and DOM reversion stay real.
beforeAll(async () => {
  vi.stubGlobal("matchMedia", vi.fn((query) => {
    if (!mediaQueries.has(query)) {
      const listeners = new Set();
      mediaQueries.set(query, {
        media: query,
        get matches() { return query === HOME_MOTION_QUERY ? compatible : false; },
        addListener(listener) { listeners.add(listener); },
        removeListener(listener) { listeners.delete(listener); },
        addEventListener(_event, listener) { listeners.add(listener); },
        removeEventListener(_event, listener) { listeners.delete(listener); },
        dispatch() { listeners.forEach((listener) => listener({ matches: this.matches })); },
      });
    }
    return mediaQueries.get(query);
  }));
  vi.stubGlobal("ResizeObserver", class {
    constructor(callback) { this.callback = callback; this.active = false; observers.push(this); }
    observe(target) { this.target = target; this.active = true; }
    disconnect() { this.active = false; }
  });
  vi.stubGlobal("scrollTo", vi.fn());
  ({ gsap } = await import("gsap"));
  ({ ScrollTrigger } = await import("gsap/ScrollTrigger"));
  ({ default: HomeMotion } = await import("./HomeMotion"));
});
beforeEach(() => {
  compatible = true;
  observers.length = 0;
});
afterEach(() => {
  cleanup();
  // A failing assertion must not leave animation timers or triggers in later tests.
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.ticker.sleep();
});
afterAll(() => {
  ScrollTrigger.disable(true, true);
  gsap.ticker.sleep();
  vi.unstubAllGlobals();
});

function MotionPage() {
  const pageRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <div ref={pageRef}>
    <h1>Motion page</h1>
    <div className="capabilities-accordion">Capabilities remain in the DOM.</div>
    <h2 className="home-statement"><span className="statement-word">Readable</span> <span className="statement-word">words</span></h2>
    <div className="home-process-intro"><h2>A clear process</h2></div>
    <ol className="home-process-steps"><li>First step</li><li>Second step</li></ol>
    <Link to="/elsewhere">Leave the home page</Link>
    {mounted && <HomeMotion pageRef={pageRef} />}
  </div>;
}
function RouteFixture() {
  return <MemoryRouter><Routes>
    <Route path="/" element={<MotionPage />} />
    <Route path="/elsewhere" element={<><h1>Another page</h1><Link to="/">Return home</Link></>} />
  </Routes></MemoryRouter>;
}

describe("home GSAP lifecycle", () => {
  it("removes real ScrollTriggers, pin wrappers, and resize observers on route exit and remount", async () => {
    const user = userEvent.setup();
    render(<StrictMode><RouteFixture /></StrictMode>);
    await waitFor(() => expect(ScrollTrigger.getAll()).toHaveLength(2));
    expect(document.querySelectorAll(".pin-spacer")).toHaveLength(1);
    expect(observers.filter((observer) => observer.active)).toHaveLength(1);
    await user.click(screen.getByRole("link", { name: "Leave the home page" }));
    expect(screen.getByRole("heading", { name: "Another page" })).toBeVisible();
    expect(ScrollTrigger.getAll()).toHaveLength(0);
    expect(document.querySelector(".pin-spacer")).toBeNull();
    expect(observers.every((observer) => !observer.active)).toBe(true);
    await user.click(screen.getByRole("link", { name: "Return home" }));
    await waitFor(() => expect(ScrollTrigger.getAll()).toHaveLength(2));
    expect(document.querySelectorAll(".pin-spacer")).toHaveLength(1);
    expect(observers.filter((observer) => observer.active)).toHaveLength(1);
  });

  it("reverts desktop effects when its media query stops matching without removing readable content", async () => {
    render(<RouteFixture />);
    await waitFor(() => expect(ScrollTrigger.getAll()).toHaveLength(2));
    // GSAP coalesces media changes within a short interval.
    await new Promise((resolve) => setTimeout(resolve, 10));
    act(() => {
      compatible = false;
      mediaQueries.get(HOME_MOTION_QUERY).dispatch();
    });
    await waitFor(() => expect(ScrollTrigger.getAll()).toHaveLength(0));
    expect(document.querySelector(".pin-spacer")).toBeNull();
    expect(observers.every((observer) => !observer.active)).toBe(true);
    expect(screen.getByText("Readable")).toBeVisible();
    expect(screen.getByText("Readable").style.getPropertyValue("--word-emphasis")).toBe("");
  });
});
