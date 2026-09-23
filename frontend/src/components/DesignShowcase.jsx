import React, { useId, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Check, ChevronLeft, Compass, MapPin, Plus } from "lucide-react";
import "./DesignShowcase.css";

const views = [
  { id: "website", label: "Website", detail: "A distinctive first impression. A clear next step." },
  { id: "app", label: "App", detail: "Thoughtful interactions. Right where people need them." },
];

function WebsitePreview() {
  return (
    <div className="design-browser" aria-hidden="true">
      <div className="design-browser-bar"><span className="design-window-dots"><i /><i /><i /></span><span>still — a little further from the everyday</span><span>↗</span></div>
      <div className="design-web-nav"><span className="design-still-logo">still<span>®</span></span><span className="design-web-links">Our places <span>The experience</span></span><span className="design-web-book">Find your quiet <ArrowUpRight size={12} /></span></div>
      <div className="design-web-content">
        <div className="design-web-copy"><span className="design-micro">A different pace of life</span><p className="design-web-title">Less rush.<br /><em>More room.</em></p><p className="design-web-description">Thoughtful places to stay.<br />Space to feel like yourself again.</p><span className="design-web-cta">Explore the collection <ArrowRight size={14} /></span><span className="design-web-footnote">Small places. Lasting impressions.</span></div>
        <div className="design-web-photo"><img src="/images/still-retreat-960.webp" width="960" height="640" alt="" loading="lazy" decoding="async" /><div><span>01 / The lakeside retreat</span><span>Slow mornings, by the water.</span></div></div>
      </div>
      <div className="design-web-bottom"><span>Somewhere you can simply be.</span><span>Considered stays, closer to nature <ArrowUpRight size={12} /></span></div>
    </div>
  );
}

function PhonePreview({ companion = false }) {
  return (
    <div className={`design-phone ${companion ? "design-phone-companion" : ""}`} aria-hidden="true">
      <div className="design-phone-status"><span>9:41</span><span className="design-phone-camera" /><span>••• ▰</span></div>
      <div className="design-phone-nav"><span className="design-still-logo">still<span>®</span></span><span className="design-phone-avatar">AL</span></div>
      {companion ? <>
        <div className="design-phone-back"><ChevronLeft size={12} /> Your stay</div>
        <p className="design-phone-title">Make yourself<br /><em>at home.</em></p>
        <div className="design-room-image"><img src="/images/still-retreat-640.webp" width="640" height="427" alt="" loading="lazy" decoding="async" /><span>The lakeside retreat</span></div>
        <div className="design-phone-arrival"><span>ARRIVAL</span><strong>Friday, 18 June</strong><p>Your room is ready from 3 pm.</p></div>
        <div className="design-phone-task"><span className="design-check"><Check size={12} /></span><span>All checked in<small>Now, take a breath.</small></span></div>
        <span className="design-phone-action">View your arrival guide <ArrowRight size={12} /></span>
      </> : <>
        <p className="design-phone-greeting">A little time for you</p>
        <p className="design-phone-title">Your next<br /><em>deep breath.</em></p>
        <div className="design-phone-trip"><img src="/images/still-retreat-640.webp" width="640" height="427" alt="" loading="lazy" decoding="async" /><div><span className="design-micro">Your upcoming stay</span><strong>The lakeside retreat</strong><span>18–21 June <span>3 nights</span></span></div></div>
        <div className="design-phone-plan"><span>Your time, your way</span><Plus size={13} /></div>
        <div className="design-phone-activity"><span className="design-activity-icon"><Compass size={18} /></span><span>A walk with no agenda<small>Trails from your doorstep</small></span><ArrowUpRight size={12} /></div>
        <div className="design-phone-bottom"><span><Compass size={15} />Discover</span><span className="is-selected"><MapPin size={15} />Your stay</span><span><span className="design-profile-dot" />You</span></div>
      </>}
      <span className="design-phone-home" />
    </div>
  );
}

export default function DesignShowcase({ compact = false }) {
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
        <div className="design-view-tabs" role="tablist" aria-label="Explore our design disciplines">
          {views.map((view, index) => <button key={view.id} ref={(element) => { tabs.current[index] = element; }} type="button" role="tab" id={`${id}-${view.id}-tab`} aria-controls={`${id}-${view.id}-panel`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={changeWithKeyboard}><span>0{index + 1}</span>{view.label} design</button>)}
        </div>
        <span className="design-concept-label">Ackra interface study / Still</span>
      </div>
      {views.map((view, index) => <div key={view.id} role="tabpanel" id={`${id}-${view.id}-panel`} aria-labelledby={`${id}-${view.id}-tab`} tabIndex={0} hidden={active !== index}>
        <div className={`design-stage design-stage-${view.id}`} role="img" aria-label={view.id === "website" ? "Website design concept for Still, a fictional retreat brand: editorial typography, quiet lakeside photography, and a matching mobile guest experience." : "App design concept for Still: two mobile screens showing a guest's upcoming stay and a clear, welcoming arrival guide."}>
          <div className="design-stage-grid" aria-hidden="true" />
          {view.id === "website" ? <><WebsitePreview /><PhonePreview /></> : <><div className="design-app-art-direction" aria-hidden="true"><span className="design-micro">The details make the experience</span><p>Less friction.<br /><em>More feeling.</em></p><span className="design-app-rule" /><span>Clear journeys.<br />Natural interactions.<br />A reason to come back.</span></div><div className="design-app-phones"><PhonePreview /><PhonePreview companion /></div></>}
        </div>
        <div className="design-showcase-caption"><p>{view.detail}</p><span>Concept exploration · Not client work</span></div>
      </div>)}
    </div>
  );
}
