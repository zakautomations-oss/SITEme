import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BOOKING_LABEL } from "../config/site";
import "./functional.css";

const SCRIPT_URL = "https://assets.calendly.com/assets/external/widget.js";
let scriptPromise;

function loadCalendlyScript() {
  if (window.Calendly?.initInlineWidget) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    let script = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    const owned = !script;
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
    }
    let finished = false;
    const finish = (error) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      clearInterval(poll);
      script.removeEventListener("load", check);
      script.removeEventListener("error", failed);
      if (error) {
        if (owned) script.remove();
        reject(error);
      } else resolve();
    };
    const check = () => { if (window.Calendly?.initInlineWidget) finish(); };
    const failed = () => finish(new Error("Calendar script unavailable"));
    const timeout = setTimeout(failed, 10000);
    const poll = setInterval(check, 100);
    script.addEventListener("load", check);
    script.addEventListener("error", failed);
    if (owned) document.body.appendChild(script);
  }).catch((error) => {
    scriptPromise = undefined;
    throw error;
  });
  return scriptPromise;
}

function colorParam(value, fallback) {
  const color = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) return color.slice(1);
  if (/^#[0-9a-f]{3}$/i.test(color)) return color.slice(1).split("").map((character) => character + character).join("");
  const rgb = color.match(/^rgba?\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/);
  return rgb ? rgb.slice(1, 4).map((channel) => Number(channel).toString(16).padStart(2, "0")).join("") : fallback;
}

export default function CalendlyInline({ url, height = 720, className = "" }) {
  const targetRef = useRef(null);
  const [theme, setTheme] = useState(() => typeof document === "undefined" ? "light" : document.documentElement.dataset.theme || "light");
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const update = () => setTheme(document.documentElement.dataset.theme || "light");
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("ackra-theme-change", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("ackra-theme-change", update);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let iframe;
    const target = targetRef.current;
    setStatus("loading");
    const finish = () => {
      if (!cancelled) {
        clearTimeout(timeout);
        setStatus("ready");
      }
    };
    const fail = () => {
      if (!cancelled) {
        clearTimeout(timeout);
        setStatus("error");
      }
    };
    const timeout = setTimeout(fail, 20000);
    loadCalendlyScript().then(() => {
      if (cancelled || !target) return;
      const styles = getComputedStyle(document.documentElement);
      const widgetUrl = new URL(url);
      widgetUrl.searchParams.set("hide_event_type_details", "0");
      widgetUrl.searchParams.set("hide_gdpr_banner", "1");
      widgetUrl.searchParams.set("background_color", colorParam(styles.getPropertyValue("--surface"), theme === "dark" ? "111218" : "f7f7f9"));
      widgetUrl.searchParams.set("text_color", colorParam(styles.getPropertyValue("--text"), theme === "dark" ? "f4f4f5" : "20212a"));
      widgetUrl.searchParams.set("primary_color", colorParam(styles.getPropertyValue("--accent"), "6266b2"));
      // This empty node belongs to the widget. Automatic scanning is disabled below.
      target.replaceChildren();
      window.Calendly.initInlineWidget({ url: widgetUrl.toString(), parentElement: target });
      iframe = target.querySelector("iframe");
      if (!iframe) { fail(); return; }
      iframe.addEventListener("load", finish);
      iframe.addEventListener("error", fail);
    }).catch(fail);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      iframe?.removeEventListener("load", finish);
      iframe?.removeEventListener("error", fail);
      target?.replaceChildren();
    };
  }, [url, theme, attempt]);

  return (
    <div data-testid="calendly-inline-wrapper" className={`calendar-shell ${className}`} style={{ "--calendar-height": `${height}px` }} aria-busy={status === "loading"}>
      {status === "loading" && (
        <div className="calendar-state" data-testid="calendly-loading" role="status">
          <div className="calendar-skeleton" aria-hidden="true"><span /><span /><span /></div>
          <p>Loading available times...</p>
        </div>
      )}
      {status === "error" && (
        <div className="calendar-state calendar-error" role="status">
          <h3>The calendar could not load.</h3>
          <p>You can open the booking page directly or try again.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="button">{BOOKING_LABEL}<ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" /></a>
          <button type="button" className="calendar-retry" onClick={() => setAttempt((value) => value + 1)}>Try again</button>
        </div>
      )}
      <div
        ref={targetRef} data-testid="calendly-inline-widget" className="calendly-inline-widget calendar-target"
        data-auto-load="false" hidden={status === "error"} aria-hidden={status === "error" ? true : undefined}
      />
    </div>
  );
}
