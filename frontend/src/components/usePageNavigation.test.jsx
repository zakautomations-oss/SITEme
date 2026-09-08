import React, { StrictMode, useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { preloadPage } from "../routePages";
import { usePageNavigation } from "./usePageNavigation";

vi.mock("../routePages", () => ({ preloadPage: vi.fn() }));

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

let media;
let transitions;
let holdCapture;
let originalStartViewTransition;

// Native capture can finish after a second click, and skipTransition does not
// cancel its update callback. Keep these two lifetimes independent in the mock.
function startViewTransition(update) {
  const ready = deferred();
  const finished = deferred();
  const updated = deferred();
  let started = false;
  const transition = {
    ready: ready.promise,
    finished: finished.promise,
    updateCallbackDone: updated.promise,
    skipTransition: vi.fn(() => { ready.resolve(); finished.resolve(); }),
    finish: finished.resolve,
    runUpdate() {
      if (!started) {
        started = true;
        Promise.resolve().then(update).then(updated.resolve, updated.reject);
      }
      return updated.promise;
    },
  };
  updated.promise.then(ready.resolve, ready.reject);
  transitions.push(transition);
  if (!holdCapture) transition.runUpdate();
  return transition;
}

function LocationProbe() {
  const { pathname, search, hash } = useLocation();
  return <output data-testid="location">{pathname + search + hash}</output>;
}

function ReadyPage({ onPageReady, readiness }) {
  const { pathname, key } = useLocation();
  useEffect(() => {
    let mounted = true;
    if (readiness[pathname]) {
      readiness[pathname].then(() => { if (mounted) onPageReady(pathname); });
    } else onPageReady(pathname);
    return () => { mounted = false; };
  }, [pathname, key, onPageReady, readiness]);
  return <h1>Page {pathname}</h1>;
}

const NO_PENDING_PAGES = {};
function NavigationOwner({ readiness = NO_PENDING_PAGES, nativeClick }) {
  const { onPageReady, navigationPending, ...events } = usePageNavigation();
  return (
    <div {...events}>
      <output data-testid="navigation-state">{navigationPending ? "loading" : "ready"}</output>
      <Link to="/services"><span>Process</span></Link>
      <Link to="/about">About</Link>
      <Link to="/contact?from=home">Contact</Link>
      <Link to="/?view=details">Same page</Link>
      <Link to="#main">Same-page anchor</Link>
      <Link to="/services#step-02">Process anchor</Link>
      <div onClick={(event) => {
        // Observe whether the hook claimed an ordinary browser action, then
        // prevent jsdom from attempting downloads, popups, or external loads.
        nativeClick?.(event.defaultPrevented);
        event.preventDefault();
      }}>
        <a href="/services">Native process</a>
        <a href="/services" download="process.html">Download</a>
        <a href="/services" target="_blank" rel="noreferrer">New tab</a>
        <a href="https://example.org/services">External</a>
        <a href="/admin">Admin</a>
        <a href="/unregistered">Unknown route</a>
      </div>
      <Routes><Route path="*" element={<ReadyPage onPageReady={onPageReady} readiness={readiness} />} /></Routes>
    </div>
  );
}

function TestRouter({ mounted = true, initialEntry = "/", ...props }) {
  return (
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationProbe />
      {mounted && <NavigationOwner {...props} />}
    </MemoryRouter>
  );
}

async function settle() { await act(async () => {}); }
function changeMotion(reduced) {
  act(() => {
    media.matches = reduced;
    media.listeners.forEach((listener) => listener({ matches: reduced }));
  });
}

beforeEach(() => {
  holdCapture = false;
  transitions = [];
  preloadPage.mockReset().mockResolvedValue(undefined);
  media = {
    matches: false,
    listeners: new Set(),
    addEventListener: vi.fn((_event, listener) => media.listeners.add(listener)),
    removeEventListener: vi.fn((_event, listener) => media.listeners.delete(listener)),
  };
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  originalStartViewTransition = Object.getOwnPropertyDescriptor(document, "startViewTransition");
  Object.defineProperty(document, "startViewTransition", { configurable: true, writable: true, value: vi.fn(startViewTransition) });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  if (originalStartViewTransition) Object.defineProperty(document, "startViewTransition", originalStartViewTransition);
  else delete document.startViewTransition;
});

describe("page navigation transitions", () => {
  it("finishes an internal transition only after the destination reports its committed content ready", async () => {
    vi.useFakeTimers();
    const page = deferred();
    render(<TestRouter readiness={{ "/contact": page.promise }} />);
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
    fireEvent.click(screen.getByRole("link", { name: "Contact" }));
    await settle();
    expect(screen.getByTestId("location")).toHaveTextContent("/contact?from=home");
    expect(screen.getByRole("heading")).toHaveTextContent("Page /contact");
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("loading");
    expect(document.startViewTransition).toHaveBeenCalledTimes(1);
    const updateFinished = vi.fn();
    transitions[0].updateCallbackDone.then(updateFinished);
    await settle();
    expect(updateFinished).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(1);

    await act(async () => { page.resolve(); });
    expect(updateFinished).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
  });

  it("does not let a never-settling prefetch block a click", async () => {
    preloadPage.mockReturnValue(new Promise(() => {}));
    render(<TestRouter />);
    fireEvent.pointerOver(screen.getByText("Process"));
    fireEvent.focus(screen.getByRole("link", { name: "About" }));
    expect(preloadPage).toHaveBeenCalledWith("/services");
    expect(preloadPage).toHaveBeenCalledWith("/about");
    fireEvent.click(screen.getByText("Process"));
    await settle();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/services$/);
    await expect(transitions[0].updateCallbackDone).resolves.toBeUndefined();
  });

  it.each([
    ["Control-click", "Native process", { ctrlKey: true }],
    ["Command-click", "Native process", { metaKey: true }],
    ["Shift-click", "Native process", { shiftKey: true }],
    ["Alt-click", "Native process", { altKey: true }],
    ["middle-click", "Native process", { button: 1 }],
    ["download", "Download", {}],
    ["new tab", "New tab", {}],
    ["external URL", "External", {}],
    ["admin URL", "Admin", {}],
    ["unknown route", "Unknown route", {}],
  ])("leaves %s to the browser without claiming the event", async (_case, name, options) => {
    const nativeClick = vi.fn();
    render(<TestRouter nativeClick={nativeClick} />);
    fireEvent.click(screen.getByRole("link", { name }), options);
    await settle();
    expect(nativeClick).toHaveBeenCalledExactlyOnceWith(false);
    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(preloadPage).not.toHaveBeenCalled();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
  });

  it("respects an already-cancelled event", async () => {
    const nativeClick = vi.fn();
    render(<TestRouter nativeClick={nativeClick} />);
    const anchor = screen.getByRole("link", { name: "Native process" });
    const event = createEvent.click(anchor, { button: 0 });
    event.preventDefault();
    fireEvent(anchor, event);
    await settle();
    expect(nativeClick).toHaveBeenCalledExactlyOnceWith(true);
    expect(document.startViewTransition).not.toHaveBeenCalled();
  });

  it.each([
    ["Same page", "/?view=details"],
    ["Same-page anchor", "/#main"],
    ["Process anchor", "/services#step-02"],
  ])("preserves normal router behavior for %s", async (name, destination) => {
    render(<TestRouter />);
    fireEvent.click(screen.getByRole("link", { name }));
    await settle();
    expect(screen.getByTestId("location").textContent).toBe(destination);
    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
  });

  it.each(["reduced motion", "unsupported browser", "leaving admin"])("navigates normally with %s", async (mode) => {
    if (mode === "reduced motion") media.matches = true;
    const start = document.startViewTransition;
    if (mode === "unsupported browser") delete document.startViewTransition;
    render(<TestRouter initialEntry={mode === "leaving admin" ? "/admin" : "/"} />);
    fireEvent.click(screen.getByText("Process"));
    await settle();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/services$/);
    expect(start).not.toHaveBeenCalled();
  });

  it.each(["reduced motion", "unsupported browser", "hash link", "leaving admin"])("tracks slow content until ready with %s", async (mode) => {
    const page = deferred();
    if (mode === "reduced motion") media.matches = true;
    const start = document.startViewTransition;
    if (mode === "unsupported browser") delete document.startViewTransition;
    render(<TestRouter initialEntry={mode === "leaving admin" ? "/admin" : "/"} readiness={{ "/services": page.promise }} />);
    fireEvent.click(screen.getByRole("link", { name: mode === "hash link" ? "Process anchor" : "Process", exact: true }));
    await settle();
    expect(screen.getByTestId("location").textContent).toBe(mode === "hash link" ? "/services#step-02" : "/services");
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("loading");
    expect(start).not.toHaveBeenCalled();
    await act(async () => { page.resolve(); });
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
  });

  it("skips active motion when the preference changes and re-enables future transitions when allowed", async () => {
    render(<TestRouter />);
    fireEvent.click(screen.getByText("Process"));
    await settle();
    changeMotion(true);
    expect(transitions[0].skipTransition).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    await settle();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/about$/);
    expect(document.startViewTransition).toHaveBeenCalledTimes(1);
    changeMotion(false);
    fireEvent.click(screen.getByRole("link", { name: "Contact" }));
    await settle();
    expect(screen.getByTestId("location")).toHaveTextContent("/contact?from=home");
    expect(document.startViewTransition).toHaveBeenCalledTimes(2);
  });

  it.each(["old first", "new first"])("keeps the latest click when native captures complete %s", async (order) => {
    holdCapture = true;
    render(<TestRouter />);
    fireEvent.click(screen.getByText("Process"));
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(transitions[0].skipTransition).toHaveBeenCalledTimes(1);
    const [first, second] = order === "old first" ? transitions : [...transitions].reverse();
    await act(async () => { await first.runUpdate(); });
    await act(async () => { await second.runUpdate(); });
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/about$/);
    expect(screen.getByRole("heading")).toHaveTextContent("Page /about");
  });

  it("does not overwrite a newer hash navigation with a delayed capture", async () => {
    holdCapture = true;
    render(<TestRouter />);
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    fireEvent.click(screen.getByRole("link", { name: "Process anchor" }));
    await act(async () => { await transitions[0].runUpdate(); });
    expect(screen.getByTestId("location").textContent).toBe("/services#step-02");
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
  });

  it("clears loading and cancels a queued cross-page intent when a same-page anchor wins", async () => {
    holdCapture = true;
    render(<TestRouter />);
    fireEvent.click(screen.getByText("Process"));
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("loading");
    fireEvent.click(screen.getByRole("link", { name: "Same-page anchor" }));
    await act(async () => { await transitions[0].runUpdate(); });
    expect(transitions[0].skipTransition).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("location").textContent).toBe("/#main");
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
  });

  it("releases the previous page's pending update when another destination is selected", async () => {
    vi.useFakeTimers();
    const processPage = deferred();
    const about = deferred();
    render(<TestRouter readiness={{ "/services": processPage.promise, "/about": about.promise }} />);
    fireEvent.click(screen.getByText("Process"));
    await settle();
    const previousFinished = vi.fn();
    transitions[0].updateCallbackDone.then(previousFinished);
    expect(vi.getTimerCount()).toBe(1);

    fireEvent.click(screen.getByRole("link", { name: "About" }));
    await settle();
    const currentFinished = vi.fn();
    transitions[1].updateCallbackDone.then(currentFinished);
    expect(transitions[0].skipTransition).toHaveBeenCalledTimes(1);
    expect(previousFinished).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("loading");
    await act(async () => { processPage.resolve(); });
    expect(currentFinished).not.toHaveBeenCalled();
    await act(async () => { about.resolve(); });
    expect(currentFinished).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/about$/);
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
  });

  it("releases the snapshot at the bounded fallback but keeps loading until the destination is ready", async () => {
    vi.useFakeTimers();
    const page = deferred();
    render(<TestRouter readiness={{ "/services": page.promise }} />);
    fireEvent.click(screen.getByText("Process"));
    await settle();
    const finished = vi.fn();
    transitions[0].updateCallbackDone.then(finished);
    await act(async () => { vi.advanceTimersByTime(649); });
    expect(finished).not.toHaveBeenCalled();
    await act(async () => { vi.advanceTimersByTime(1); });
    expect(finished).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/services$/);
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("loading");
    await act(async () => { page.resolve(); });
    expect(screen.getByTestId("navigation-state")).toHaveTextContent("ready");
  });

  it("falls back to routing if the browser refuses to start a transition", async () => {
    document.startViewTransition.mockImplementation(() => { throw new Error("unavailable"); });
    render(<TestRouter />);
    fireEvent.click(screen.getByText("Process"));
    await settle();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/services$/);
  });

  it("removes the media listener and releases an unfinished update and timer on unmount under StrictMode", async () => {
    vi.useFakeTimers();
    const page = deferred();
    const { unmount } = render(<StrictMode><TestRouter readiness={{ "/services": page.promise }} /></StrictMode>);
    expect(media.listeners.size).toBe(1);
    fireEvent.click(screen.getByText("Process"));
    await settle();
    expect(vi.getTimerCount()).toBe(1);
    const finished = vi.fn();
    transitions[0].updateCallbackDone.then(finished);
    unmount();
    await settle();
    expect(transitions[0].skipTransition).toHaveBeenCalledTimes(1);
    expect(finished).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    expect(media.listeners.size).toBe(0);
    expect(media.removeEventListener.mock.calls).toHaveLength(media.addEventListener.mock.calls.length);
    await act(async () => { page.resolve(); vi.runAllTimers(); });
    expect(finished).toHaveBeenCalledTimes(1);
  });

  it("prevents a delayed browser update from navigating after its owner unmounts", async () => {
    holdCapture = true;
    const { rerender } = render(<TestRouter />);
    fireEvent.click(screen.getByText("Process"));
    rerender(<TestRouter mounted={false} />);
    await act(async () => { await transitions[0].runUpdate(); });
    expect(transitions[0].skipTransition).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    expect(media.listeners.size).toBe(0);
  });
});
