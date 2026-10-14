import React, { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import "./CapabilitiesAccordion.css";

const CAPABILITIES = [
  {
    label: "Business automation",
    title: "Keep orders and updates moving.",
    text: "Keep customer records, order details, and repair updates in step with your existing tools. AI handles routine updates and flags anything your jewelry team needs to review.",
    image: {
      src: "/images/jewelry-workbench-960.jpg",
      srcSet: "/images/jewelry-workbench-640.jpg 640w, /images/jewelry-workbench-960.jpg 960w, /images/jewelry-workbench-1440.jpg 1440w",
      alt: "Gold and silver rings beside a jeweler’s loupe and tools on a stone workbench",
    },
  },
  {
    label: "Customer conversations",
    title: "Turn interest into a conversation.",
    text: "Answer questions about pieces using your product information, arrange consultations, and follow up after an enquiry. Available by phone, text, or web chat, with your team handling personal recommendations.",
  },
  {
    label: "Custom projects",
    title: "Built around the way you sell.",
    text: "Connect the steps behind custom orders, repair requests, or trade enquiries. We build around your jewelry business and agree on which decisions stay with your team.",
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
