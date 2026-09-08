import React, { Suspense, useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, Link, useLocation } from "react-router-dom";
import { usePageNavigation } from "./usePageNavigation";

vi.mock("../routePages", () => ({ preloadPage: vi.fn(() => Promise.resolve()) }));

const suspendedPage = new Promise(() => {});
let originalStartViewTransition;
let transitions;

function HeldPage() {
  throw suspendedPage;
}

function PageReady({ onPageReady }) {
  const { pathname, key } = useLocation();
  useEffect(() => { onPageReady(pathname); }, [pathname, key, onPageReady]);
  return null;
}

function NavigationFixture() {
  const { pathname } = useLocation();
  const { onPageReady, navigationPending, ...events } = usePageNavigation();
  return (
    <div {...events}>
      <Link to="/services">Process</Link>
      {navigationPending && <p role="status">Loading page</p>}
      <main aria-busy={navigationPending}>
        <Suspense fallback={<p>Route fallback</p>}>
          <div key={pathname}>
            {pathname === "/" ? <h1>Home</h1> : <HeldPage />}
          </div>
          <PageReady onPageReady={onPageReady} />
        </Suspense>
      </main>
    </div>
  );
}

beforeEach(() => {
  window.history.replaceState({ idx: 0, key: "home", usr: null }, "", "/");
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
  transitions = [];
  originalStartViewTransition = Object.getOwnPropertyDescriptor(document, "startViewTransition");
  delete document.startViewTransition;
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalStartViewTransition) Object.defineProperty(document, "startViewTransition", originalStartViewTransition);
  else delete document.startViewTransition;
});

describe("browser history during suspended navigation", () => {
  it.each([false, true])("clears the loading cue when Back cancels an uncommitted route (native transition: %s)", async (nativeTransition) => {
    if (nativeTransition) {
      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        value: vi.fn((update) => {
          const updateCallbackDone = Promise.resolve().then(update);
          const transition = {
            ready: updateCallbackDone,
            finished: new Promise(() => {}),
            updateCallbackDone,
            skipTransition: vi.fn(),
          };
          transitions.push(transition);
          return transition;
        }),
      });
    }

    render(<BrowserRouter><NavigationFixture /></BrowserRouter>);
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "false");

    fireEvent.click(screen.getByRole("link", { name: "Process" }));
    await act(async () => {});

    // Browser history advances while the concurrent router retains Home.
    // PageReady still has its original pathname/key, so it cannot clear a
    // cancelled navigation merely by running its normal readiness effect.
    expect(window.location.pathname).toBe("/services");
    expect(screen.getByRole("heading", { name: "Home" })).toBeVisible();
    expect(screen.queryByText("Route fallback")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading page");
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");

    await act(async () => {
      const popped = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
      window.history.back();
      await popped;
    });

    expect(window.location.pathname).toBe("/");
    expect(screen.getByRole("heading", { name: "Home" })).toBeVisible();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "false");
    if (nativeTransition) {
      expect(transitions[0].skipTransition).toHaveBeenCalledOnce();
      await expect(transitions[0].updateCallbackDone).resolves.toBeUndefined();
    }
  });
});
