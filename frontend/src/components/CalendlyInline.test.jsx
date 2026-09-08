import React, { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import CalendlyInline from "./CalendlyInline";

const booking = "https://calendly.com/evoskin9/ak-automations-meeting-s?utm_source=site";
function installCalendly() {
  const initInlineWidget = vi.fn(({ parentElement, url }) => {
    const frame = document.createElement("iframe");
    frame.src = url;
    parentElement.appendChild(frame);
  });
  window.Calendly = { initInlineWidget };
  return initInlineWidget;
}
beforeEach(() => {
  document.documentElement.dataset.theme = "light";
  document.documentElement.style.setProperty("--surface", "#f7f7f9");
  document.documentElement.style.setProperty("--text", "#20212a");
  document.documentElement.style.setProperty("--accent", "#6266b2");
});
afterEach(() => {
  delete window.Calendly;
  document.querySelectorAll('script[src="https://assets.calendly.com/assets/external/widget.js"]').forEach((script) => script.remove());
  vi.useRealTimers();
});

describe("calendar loading", () => {
  it("disables automatic initialization and creates one iframe under StrictMode", async () => {
    const init = installCalendly();
    render(<StrictMode><CalendlyInline url={booking} /></StrictMode>);
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    const target = screen.getByTestId("calendly-inline-widget");
    expect(target).toHaveAttribute("data-auto-load", "false");
    expect(target.querySelectorAll("iframe")).toHaveLength(1);
    const iframe = target.querySelector("iframe");
    expect(new URL(iframe.src).searchParams.get("utm_source")).toBe("site");
    fireEvent.load(iframe);
    expect(screen.queryByTestId("calendly-loading")).not.toBeInTheDocument();
  });

  it("replaces the iframe on a theme change without accumulating duplicate calendars", async () => {
    const init = installCalendly();
    render(<CalendlyInline url={booking} />);
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    document.documentElement.style.setProperty("--surface", "#111218");
    await act(async () => { document.documentElement.dataset.theme = "dark"; });
    await waitFor(() => expect(init).toHaveBeenCalledTimes(2));
    const frames = screen.getByTestId("calendly-inline-widget").querySelectorAll("iframe");
    expect(frames).toHaveLength(1);
    expect(new URL(frames[0].src).searchParams.get("background_color")).toBe("111218");
  });

  it("shows a usable direct booking link when the external script fails", async () => {
    render(<CalendlyInline url={booking} />);
    const script = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    fireEvent.error(script);
    expect(await screen.findByText("The calendar could not load.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Book a call" })).toHaveAttribute("href", booking);
    expect(screen.queryByTestId("calendly-loading")).not.toBeInTheDocument();
  });

  it("ends the loading state if an iframe never loads", async () => {
    vi.useFakeTimers();
    installCalendly();
    render(<CalendlyInline url={booking} />);
    await act(async () => { await Promise.resolve(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(20001); });
    expect(screen.getByText("The calendar could not load.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
  });
});
