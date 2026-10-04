import React, { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import "./CapabilitiesAccordion.css";

const CAPABILITIES = [
  {
    label: "Supply chain agents",
    title: "Connect your supply chain.",
    text: "Agents that coordinate procurement, inventory, and logistics across your existing systems, with clear escalation paths for your team.",
    image: {
      src: "/images/workflow-960.webp",
      srcSet: "/images/workflow-640.webp 640w, /images/workflow-960.webp 960w, /images/workflow-1440.webp 1440w",
      alt: "Notebook, pen, and laptop arranged on a gray worktable",
    },
  },
  {
    label: "Conversational Agents",
    title: "Keep the conversation moving.",
    text: "Voice, text, and web chat agents that handle enquiries, qualify opportunities, and coordinate bookings, with clear handoffs to your team.",
  },
  {
    label: "Custom projects",
    title: "Built for your specific work.",
    text: "Bespoke agents that use your company’s knowledge and tools to handle multi-step work and software with clear handoffs to your team.",
  },
];

/** Native disclosure markup stays usable while JavaScript loads. */
export default function CapabilitiesAccordion({ className = "" }) {
  const id = useId();
  const summaries = useRef([]);
  const [active, setActive] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  const toggle = (index) => {
    setHasInteracted(true);
    setActive((current) => current === index ? null : index);
  };
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
    <div className={`capabilities-accordion ${className}`} data-testid="capabilities-accordion" data-interacted={hasInteracted ? "true" : undefined}>
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
                    sizes="(max-width: 767px) calc(100vw - 88px), (max-width: 1023px) calc(100vw - 128px), 748px"
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
