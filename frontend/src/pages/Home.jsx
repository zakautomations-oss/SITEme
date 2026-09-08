import React, { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { BookingLink } from "../components/PageElements";
import AckraMark from "../components/AckraMark";
import { BOOKING_DURATION } from "../config/site";
import CapabilitiesAccordion from "../components/CapabilitiesAccordion";
import IntegrationMarquee from "../components/IntegrationMarquee";
import { useHomeMotionEnabled } from "../components/useHomeMotionEnabled";
import "./home.css";

const HomeMotion = lazy(() => import("../components/HomeMotion"));
const process = [
  ["Talk through the work", "Bring the task that costs your team the most time. We’ll look at the people, tools, and decisions behind it.", "step-01"],
  ["Make a practical plan", "Agree on the integrations, success measures, and moments that need a human handoff.", "step-02"],
  ["Build, test, and launch", "Test against real scenarios, start with a focused rollout, and keep improving the system together.", "step-04"],
];
const statement = "Connect your tools. Give your team room to think.";

export default function Home() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const motionEnabled = useHomeMotionEnabled();
  return (
    <div ref={pageRef} data-testid="page-home" className="home-page">
      <section ref={heroRef} className="home-hero site-container">
        <div className="hero-copy">
          <h1 className="max-w-6xl">AI systems.<br /><span>Built for your work.</span></h1>
          <p className="hero-description">Custom AI systems that connect your tools, automate complex workflows, and support your team. Built and managed by Ackra.</p>
          <div className="hero-actions">
            <BookingLink testId="hero-cta-book" />
            <Link to="/services" data-testid="hero-cta-services" className="button button-secondary">How it works <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
        </div>
        <div className="hero-media"><AckraMark motionAreaRef={heroRef} /></div>
      </section>
      <IntegrationMarquee />
      <section className="home-chapter site-container" aria-labelledby="capabilities-heading">
        <div className="home-section-heading">
          <h2 id="capabilities-heading" className="section-title">Built around<br />the work.</h2>
          <p className="section-intro">From connected workflows to customer conversations, we build the system around the task. Your tools and your team stay at the center.</p>
        </div>
        <CapabilitiesAccordion />
      </section>
      <section className="home-outcomes home-chapter site-container" aria-labelledby="home-solutions-heading">
        <h2 id="home-solutions-heading" className="home-statement" aria-label={statement}><span aria-hidden="true">{statement.split(" ").map((word, index) => <React.Fragment key={`${word}-${index}`}><span className="statement-word">{word}</span>{" "}{index === 2 && <br />}</React.Fragment>)}</span></h2>
        <div className="solution-pair grid-flow-dense">
          <Link to="/solutions/reduce-workload" className="solution-panel">
            <div><h3>More time for<br />the work that matters.</h3><p>Take repetitive admin off your plate. Connect the details across your tools and give your team space for the work that needs them.</p></div>
            <span className="panel-link">Reduce workload <ArrowUpRight aria-hidden="true" /></span>
          </Link>
          <Link to="/solutions/increase-conversion" className="solution-panel solution-panel-accent">
            <div><h3>A good response.<br />Every time it counts.</h3><p>Help more conversations become appointments, with timely replies and thoughtful follow-ups across your customer channels.</p></div>
            <span className="panel-link">Increase conversion <ArrowUpRight aria-hidden="true" /></span>
          </Link>
        </div>
      </section>
      <section className="home-process home-chapter" aria-labelledby="process-heading">
        <div className="site-container home-process-layout">
          <div className="home-process-intro">
            <h2 id="process-heading" className="section-title">A clear path to a working system.</h2>
            <p className="section-intro">Scope it together. Test it properly. Keep improving it.</p>
            <Link className="text-link" data-testid="home-services-link" to="/services">Explore the process <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <ol className="home-process-steps">{process.map(([title, text, anchor]) => <li key={anchor}><Link to={`/services#${anchor}`}><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" /></Link></li>)}</ol>
        </div>
      </section>
      <section className="home-closing home-chapter site-container">
        <h2>Your next system.<br /><span className="closing-line"><span className="inline-editorial-image" aria-hidden="true"><img src="/images/studio-640.webp" width="160" height="100" alt="" loading="lazy" decoding="async" /></span>Built together.</span></h2>
        <div className="home-closing-details"><p className="section-intro">Tell us what you’re building. We’ll explore the integrations, decisions, and human handoffs for a sensible first release.</p><div><BookingLink testId="home-bottom-cta" /><p className="booking-detail">{BOOKING_DURATION} minutes to talk through your next step.</p></div></div>
      </section>
      {motionEnabled && <Suspense fallback={null}><HomeMotion pageRef={pageRef} /></Suspense>}
    </div>
  );
}
