import React, { useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import AppDesignPreview from "./AppDesignPreview";
import WebsiteDesignPreview from "./WebsiteDesignPreview";
import "./DesignShowcase.css";

const views = [
  {
    id: "website",
    label: "Website design",
    title: "Architecture practice website",
    detail: "A portfolio for a fictional architecture practice. Project photography leads visitors from the work to an enquiry.",
    studyHref: "/studies/alder-rowe-website.html",
  },
  {
    id: "app",
    label: "App design",
    title: "Client project portal",
    detail: "A companion app for reviewing drawings and materials. Clients can see what needs a decision and approve selections.",
    studyHref: "/studies/alder-rowe-app.html",
  },
];

export default function DesignShowcase({ compact = false }) {
  const StudyHeading = compact ? "h3" : "h2";
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef([]);

  function changeWithKeyboard(event) {
    const keys = { ArrowRight: (active + 1) % views.length, ArrowLeft: (active + views.length - 1) % views.length, Home: 0, End: views.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    setActive(keys[event.key]);
    tabs.current[keys[event.key]]?.focus();
  }

  return (
    <div className={`design-showcase ${compact ? "design-showcase-compact" : ""}`}>
      <div className="design-showcase-toolbar">
        <div className="design-study-name"><StudyHeading className="design-study-heading">Alder / Rowe</StudyHeading><span>Concept study · Fictional practice</span></div>
        <div className="design-view-tabs" role="tablist" aria-label="Explore our design disciplines">
          {views.map((view, index) => (
            <button key={view.id} ref={(element) => { tabs.current[index] = element; }} type="button" role="tab" id={`${id}-${view.id}-tab`} aria-controls={`${id}-${view.id}-panel`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={changeWithKeyboard}>
              {view.label}
            </button>
          ))}
        </div>
      </div>
      {views.map((view, index) => (
        <div key={view.id} role="tabpanel" id={`${id}-${view.id}-panel`} aria-labelledby={`${id}-${view.id}-tab`} tabIndex={0} hidden={active !== index}>
          {view.id === "app" ? <AppDesignPreview /> : <WebsiteDesignPreview loading={compact ? "lazy" : "eager"} />}
          <div className="design-showcase-caption">
            <div><h3>{view.title}</h3><p>{view.detail}</p></div>
            <a href={view.studyHref} target="_blank" rel="noopener noreferrer" className="design-study-link">View full {view.id === "website" ? "website" : "app"} study <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      ))}
    </div>
  );
}
