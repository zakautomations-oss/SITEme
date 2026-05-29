import React, { useEffect, useRef, useState } from "react";

const SCRIPT_URL = "https://assets.calendly.com/assets/external/widget.js";

function loadCalendlyScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Calendly) return resolve(true);
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      let tries = 0;
      const id = setInterval(() => {
        if (window.Calendly) {
          clearInterval(id);
          resolve(true);
        } else if (++tries > 60) {
          clearInterval(id);
          resolve(false);
        }
      }, 100);
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CalendlyInline({ url, height = 720, className = "" }) {
  const targetRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fullUrl = `${url}?hide_event_type_details=0&hide_gdpr_banner=1&background_color=ffffff&text_color=000000&primary_color=7B7FE8`;
    loadCalendlyScript().then((ok) => {
      if (cancelled || !ok || !targetRef.current) return;
      try {
        // Calendly injects an iframe into targetRef.current.
        // React must not manage that node's children. We render it as empty.
        window.Calendly.initInlineWidget({
          url: fullUrl,
          parentElement: targetRef.current,
        });
        setReady(true);
      } catch (e) {
        // noop; fallback handled by script auto-scan via data-url
      }
    });
    return () => {
      cancelled = true;
      // Don't manually clean the Calendly DOM. Let React unmount the wrapper
      // and the browser will GC the orphan iframe.
    };
  }, [url]);

  const fullUrlAttr = `${url}?hide_event_type_details=0&hide_gdpr_banner=1&background_color=ffffff&text_color=000000&primary_color=7B7FE8`;

  return (
    <div
      data-testid="calendly-inline-wrapper"
      className={`relative overflow-hidden bg-white ${className}`}
      style={{ minWidth: "320px", height, border: "1px solid var(--rule-hard)" }}
    >
      {!ready && (
        <div
          data-testid="calendly-loading"
          className="absolute inset-0 flex items-center justify-center text-black/40 mono text-[11px] tracking-mono uppercase pointer-events-none"
        >
          Loading calendar…
        </div>
      )}
      <div
        ref={targetRef}
        data-testid="calendly-inline-widget"
        className="calendly-inline-widget w-full h-full"
        data-url={fullUrlAttr}
      />
    </div>
  );
}
