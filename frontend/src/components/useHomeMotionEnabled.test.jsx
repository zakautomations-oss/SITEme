import React, { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { useHomeMotionEnabled } from "./useHomeMotionEnabled";

function MotionGate() {
  return <output>{useHomeMotionEnabled() ? "motion enabled" : "static content"}</output>;
}

let viewport;
let queries;
function matches(query) {
  const width = query.match(/min-width:\s*(\d+)px/);
  const height = query.match(/min-height:\s*(\d+)px/);
  return (!width || viewport.width >= Number(width[1]))
    && (!height || viewport.height >= Number(height[1]))
    && (!query.includes("prefers-reduced-motion: no-preference") || !viewport.reduced);
}
function setViewport(changes) {
  Object.assign(viewport, changes);
  act(() => queries.forEach((media) => media.listeners.forEach((listener) => listener({ matches: media.matches }))));
}

beforeEach(() => {
  viewport = { width: 900, height: 900, reduced: false };
  queries = [];
  vi.stubGlobal("matchMedia", vi.fn((query) => {
    const media = {
      media: query,
      get matches() { return matches(query); },
      listeners: new Set(),
      addEventListener: vi.fn((_type, listener) => media.listeners.add(listener)),
      removeEventListener: vi.fn((_type, listener) => media.listeners.delete(listener)),
    };
    queries.push(media);
    return media;
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe("home motion eligibility", () => {
  it("responds to viewport height, width, and reduced-motion changes after mounting", () => {
    render(<MotionGate />);
    expect(screen.getByRole("status")).toHaveTextContent("static content");
    setViewport({ width: 1440 });
    expect(screen.getByRole("status")).toHaveTextContent("motion enabled");
    setViewport({ reduced: true });
    expect(screen.getByRole("status")).toHaveTextContent("static content");
    setViewport({ reduced: false, height: 600 });
    expect(screen.getByRole("status")).toHaveTextContent("static content");
    setViewport({ height: 900 });
    expect(screen.getByRole("status")).toHaveTextContent("motion enabled");
    setViewport({ width: 600 });
    expect(screen.getByRole("status")).toHaveTextContent("static content");
  });

  it("keeps only one live media listener under StrictMode and removes it on unmount", () => {
    const { unmount } = render(<StrictMode><MotionGate /></StrictMode>);
    expect(queries.reduce((count, media) => count + media.listeners.size, 0)).toBe(1);
    setViewport({ width: 1440 });
    expect(screen.getByRole("status")).toHaveTextContent("motion enabled");
    unmount();
    expect(queries.every((media) => media.listeners.size === 0)).toBe(true);
    expect(queries.reduce((count, media) => count + media.removeEventListener.mock.calls.length, 0))
      .toBe(queries.reduce((count, media) => count + media.addEventListener.mock.calls.length, 0));
  });

  it("renders static content on the server without consulting browser media queries", () => {
    viewport.width = 1440;
    expect(renderToString(<MotionGate />)).toContain("static content");
    expect(window.matchMedia).not.toHaveBeenCalled();
  });
});
