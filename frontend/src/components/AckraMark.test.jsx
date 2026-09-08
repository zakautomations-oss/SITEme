import React, { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import AckraMark from "./AckraMark";

let reduced;
let mediaListeners;
let frames;
let nextFrame;

beforeEach(() => {
  reduced = false;
  mediaListeners = new Set();
  frames = new Map();
  nextFrame = 0;
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    get matches() { return reduced; },
    addEventListener(_type, listener) { mediaListeners.add(listener); },
    removeEventListener(_type, listener) { mediaListeners.delete(listener); },
  })));
  vi.stubGlobal("requestAnimationFrame", vi.fn((callback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  }));
  vi.stubGlobal("cancelAnimationFrame", vi.fn((id) => frames.delete(id)));
  vi.stubGlobal("PointerEvent", class extends MouseEvent {
    constructor(type, options = {}) {
      super(type, options);
      this.pointerId = options.pointerId ?? 1;
      this.pointerType = options.pointerType ?? "mouse";
      this.isPrimary = options.isPrimary ?? true;
    }
  });
});
afterEach(() => vi.unstubAllGlobals());

function stage() {
  const element = screen.getByRole("button", { name: "Rotate the Ackra mark" });
  element.getBoundingClientRect = () => ({ x: 0, y: 0, top: 0, left: 0, right: 600, bottom: 560, width: 600, height: 560 });
  element.setPointerCapture = vi.fn();
  element.hasPointerCapture = () => false;
  element.releasePointerCapture = vi.fn();
  return element;
}
function geometry(element) {
  return Array.from(element.querySelectorAll("polygon"), (polygon) => polygon.getAttribute("points")).join("|");
}
function settleFrames() {
  let ticks = 0;
  while (frames.size && ticks < 100) {
    const pending = [...frames.values()];
    frames.clear();
    act(() => pending.forEach((callback) => callback(++ticks * 16)));
  }
  expect(frames.size).toBe(0);
}
function setReduced(value) {
  act(() => {
    reduced = value;
    mediaListeners.forEach((listener) => listener({ matches: value }));
  });
}

describe("interactive Ackra mark", () => {
  it("server-renders visible, finite SVG geometry without an external visual asset", () => {
    const html = renderToString(<AckraMark />);
    const container = document.createElement("div");
    container.innerHTML = html;
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelectorAll("polygon").length).toBeGreaterThan(0);
    expect(container.querySelector("img, image, canvas, script")).toBeNull();
    expect(html).not.toMatch(/https?:\/\//);
    expect(geometry(container)).not.toMatch(/NaN|Infinity/);
    expect(container.querySelector("button").getAttribute("aria-label")).toBe("Rotate the Ackra mark");
    expect(window.matchMedia).not.toHaveBeenCalled();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("switches between solid and complete structure with exclusive pressed states", async () => {
    render(<AckraMark />);
    const solid = screen.getByRole("button", { name: "Solid" });
    const structure = screen.getByRole("button", { name: "Structure" });
    const solidFaceCount = stage().querySelectorAll("polygon").length;
    expect(solid).toHaveAttribute("aria-pressed", "true");
    expect(structure).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(structure);
    expect(structure).toHaveAttribute("aria-pressed", "true");
    expect(solid).toHaveAttribute("aria-pressed", "false");
    expect(stage().querySelectorAll("polygon").length).toBeGreaterThan(solidFaceCount);
    await userEvent.click(solid);
    expect(solid).toHaveAttribute("aria-pressed", "true");
    expect(structure).toHaveAttribute("aria-pressed", "false");
    expect(stage().querySelectorAll("polygon")).toHaveLength(solidFaceCount);
  });

  it("supports click, Enter, arrow keys, and Escape without animation under reduced motion", async () => {
    reduced = true;
    render(<AckraMark />);
    const mark = stage();
    const resting = geometry(mark);
    await userEvent.click(mark);
    const first = geometry(mark);
    expect(first).not.toBe(resting);
    await userEvent.keyboard("{Enter}");
    const second = geometry(mark);
    expect(second).not.toBe(first);
    await userEvent.keyboard("{ArrowLeft}");
    expect(geometry(mark)).toBe(first);
    await userEvent.keyboard("{ArrowRight}");
    expect(geometry(mark)).toBe(second);
    await userEvent.keyboard("{Escape}");
    expect(geometry(mark)).toBe(resting);
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("cancels a pending animation when reduced motion is enabled and ignores later hover", () => {
    render(<AckraMark />);
    const mark = stage();
    const resting = geometry(mark);
    fireEvent.pointerMove(mark, { clientX: 540, clientY: 100, buttons: 0 });
    expect(frames.size).toBe(1);
    setReduced(true);
    expect(frames.size).toBe(0);
    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(geometry(mark)).toBe(resting);
    const requested = requestAnimationFrame.mock.calls.length;
    fireEvent.pointerMove(mark, { clientX: 50, clientY: 460, buttons: 0 });
    fireEvent.pointerLeave(mark);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(requested);
    expect(geometry(mark)).toBe(resting);
    fireEvent.click(mark, { detail: 0 });
    expect(geometry(mark)).not.toBe(resting);
    expect(frames.size).toBe(0);
  });

  it("keeps the first click responsive after a reduced-motion change from the last view", () => {
    render(<AckraMark />);
    const mark = stage();
    fireEvent.click(mark, { detail: 0 });
    settleFrames();
    fireEvent.click(mark, { detail: 0 });
    settleFrames();
    setReduced(true);
    const beforeClick = geometry(mark);
    fireEvent.click(mark, { detail: 0 });
    expect(geometry(mark)).not.toBe(beforeClick);
    expect(frames.size).toBe(0);
  });

  it("does not also rotate on the click produced by a completed horizontal drag", async () => {
    render(<AckraMark />);
    const mark = stage();
    const resting = geometry(mark);
    fireEvent.pointerDown(mark, { button: 0, buttons: 1, clientX: 200, clientY: 200 });
    fireEvent.pointerMove(mark, { buttons: 1, clientX: 280, clientY: 205 });
    expect(mark.setPointerCapture).toHaveBeenCalledWith(1);
    settleFrames();
    const dragged = geometry(mark);
    expect(dragged).not.toBe(resting);
    fireEvent.pointerUp(mark, { buttons: 0, clientX: 280, clientY: 205 });
    fireEvent.click(mark, { detail: 1 });
    expect(frames.size).toBe(0);
    expect(geometry(mark)).toBe(dragged);
    mark.focus();
    await userEvent.keyboard("{Enter}");
    settleFrames();
    expect(geometry(mark)).not.toBe(dragged);
  });

  it("does not treat a hover as dragging after an uncaptured pointer leaves and is released outside", () => {
    render(<AckraMark />);
    const mark = stage();
    fireEvent.pointerDown(mark, { button: 0, buttons: 1, clientX: 300, clientY: 150 });
    fireEvent.pointerMove(mark, { buttons: 1, clientX: 300, clientY: 570 });
    fireEvent.pointerLeave(mark, { buttons: 1, clientX: 300, clientY: 570 });
    fireEvent.pointerUp(document.body, { buttons: 0, clientX: 300, clientY: 570 });
    fireEvent.pointerMove(mark, { buttons: 0, clientX: 400, clientY: 150 });
    expect(mark.setPointerCapture).not.toHaveBeenCalled();
    settleFrames();
    expect(geometry(mark)).not.toMatch(/NaN|Infinity/);
  });

  it("releases pending animation frames and media listeners when StrictMode unmounts", () => {
    const { unmount } = render(<StrictMode><AckraMark /></StrictMode>);
    const mark = stage();
    expect(mediaListeners.size).toBe(1);
    fireEvent.pointerMove(mark, { clientX: 520, clientY: 100, buttons: 0 });
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(mediaListeners.size).toBe(0);
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
