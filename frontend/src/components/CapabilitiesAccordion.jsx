import React, { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import "./CapabilitiesAccordion.css";

const CAPABILITIES = [
  {
    label: "Workflow automation",
    title: "Let your tools work together.",
    text: "Connect your CRM, calendar, inbox, and internal tools into workflows that run together.",
    image: {
      src: "/images/workflow-960.webp",
      srcSet: "/images/workflow-640.webp 640w, /images/workflow-960.webp 960w, /images/workflow-1440.webp 1440w",
      alt: "Notebook, pen, and laptop arranged on a gray worktable",
    },
  },
  {
    label: "Text agents",
    title: "Keep the conversation moving.",
    text: "Helpful replies across text and web chat, with a clear handoff when someone needs your team.",
  },
  {
    label: "Voice agents",
    title: "Answer every opportunity.",
    text: "Voice agents that answer calls, qualify enquiries, and help customers book a time.",
  },
  {
    label: "Review follow-ups",
    title: "Make feedback part of the process.",
    text: "Ask customers for honest reviews and bring service issues to the right person.",
  },
  {
    label: "Custom agents",
    title: "Built for your specific work.",
    text: "Bespoke agents that use your company’s knowledge and tools to handle multi-step work, with clear handoffs to your team.",
  },
];

/** Native disclosure markup stays usable while JavaScript loads. */
export default function CapabilitiesAccordion({ className = "" }) {
  const id = useId();
  const summaries = useRef([]);
  const [active, setActive] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  const toggle = (index) => setActive((current) => current === index ? null : index);
  const onKeyDown = (event, index) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % CAPABILITIES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + CAPABILITIES.length - 1) % CAPABILITIES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = CAPABILITIES.length - 1;
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(index);
      return;
    } else return;
    event.preventDefault();
    summaries.current[next]?.focus();
  };

  return (
    <div className={`capabilities-accordion ${className}`} data-testid="capabilities-accordion">
      {CAPABILITIES.map(({ label, title, text, image }, index) => {
        const expanded = active === index;
        const summaryId = `${id}-capability-${index}`;
        const panelId = `${summaryId}-panel`;
        return (
          <details
            className="capabilities-panel"
            key={label}
            name={`${id}-capabilities`}
            open={expanded}
            onToggle={(event) => {
              if (!hydrated) return;
              const isOpen = event.currentTarget.open;
              setActive((current) => isOpen ? index : current === index ? null : current);
            }}
          >
            <summary
              ref={(element) => { summaries.current[index] = element; }}
              id={summaryId}
              className="capabilities-trigger"
              role="button"
              aria-expanded={hydrated ? expanded : undefined}
              aria-controls={panelId}
              onClick={(event) => { event.preventDefault(); toggle(index); }}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span>{label}</span>
              <span className="capabilities-toggle-icon" aria-hidden="true">
                <Plus className="capabilities-plus" size={19} strokeWidth={1.5} />
                <Minus className="capabilities-minus" size={19} strokeWidth={1.5} />
              </span>
            </summary>
            <div id={panelId} role="region" aria-labelledby={summaryId} className="capabilities-content" hidden={hydrated ? !expanded : undefined}>
              {image && (
                <div className="capabilities-image-wrap">
                  <img
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes="(max-width: 767px) calc(100vw - 88px), (max-width: 1023px) calc(100vw - 128px), 560px"
                    alt={image.alt}
                    width="960"
                    height="720"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="capabilities-copy">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
