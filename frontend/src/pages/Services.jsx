import React from "react";
import { ArrowRight } from "lucide-react";
import CalendlyInline from "../components/CalendlyInline";
import { PageHero, ClosingSection } from "../components/PageElements";
import { BOOKING_URL, BOOKING_LABEL, BOOKING_DURATION } from "../config/site";

const stages = [["step-01","Book a call"],["step-02","Clarity session"],["step-04","Deploy"]];

export default function Services() {
  return <div data-testid="page-services">
    <PageHero title={<>A clear plan.<br />A working system.</>} text="From your first conversation to live traffic, you’ll know what we’re building and how to evaluate it.">
      <a className="button" href="#step-01" data-testid="process-01-cta">{BOOKING_LABEL}<ArrowRight size={17} aria-hidden="true" /></a>
    </PageHero>
    <nav className="process-index site-container" aria-label="On this page">{stages.map(([id,label],i)=><a key={id} href={`#${id}`} data-testid={`process-index-0${i+1}`}>{label}<ArrowRight size={15} aria-hidden="true" /></a>)}</nav>
    <section id="step-01" className="section-space site-container booking-section" data-testid="process-step-01">
      <div className="booking-context"><h2 className="section-title">Start with a conversation.</h2><p className="section-intro">Pick a time that works for you. Bring a workflow, a question, or a task your team is tired of repeating.</p><dl className="call-details"><div><dt>Duration</dt><dd>{BOOKING_DURATION} minutes</dd></div><div><dt>Format</dt><dd>Video call</dd></div><div><dt>Preparation</dt><dd>One workflow to discuss</dd></div></dl><p className="body-note">Meeting details arrive with your booking confirmation.</p><a href={BOOKING_URL} className="text-link" target="_blank" rel="noopener noreferrer" data-testid="process-01-open-newtab">{BOOKING_LABEL}<ArrowRight size={17} aria-hidden="true" /></a></div>
      <CalendlyInline url={BOOKING_URL} height={760} />
    </section>
    <section id="step-02" className="section-space process-clarity" data-testid="process-step-02"><div className="site-container">
      <h2 className="section-title">Turn the problem into a plan.</h2><p className="section-intro">The clarity session maps the work, the tools, and the decisions an agent can reasonably handle.</p>
      <div className="deliverables-grid"><article><h3>The workflow</h3><p>Where work begins, where it gets stuck, and which parts are worth automating.</p></article><article><h3>The agent’s job</h3><p>Its inputs, actions, integrations, and the point where a person takes over.</p></article><article><h3>The measure of success</h3><p>A practical way to evaluate the build against the time, effort, or response quality you care about.</p></article></div>
    </div></section>
    <section id="step-04" className="section-space site-container" data-testid="process-step-04">
      <h2 className="section-title">Build carefully. Launch with support.</h2><p className="section-intro">A typical first build takes about three to four weeks after scope is agreed. Timing depends on the integrations and testing required.</p>
      <ol className="delivery-timeline">{[
        ["Scope and specification", "Agree on the workflow, access, success measures, and escalation rules."],
        ["Build and integration", "Connect the tools and implement the agent’s instructions and safeguards."],
        ["Testing and review", "Run representative scenarios together, review the results, and resolve issues."],
        ["Controlled launch", "Introduce live traffic, watch performance, and make adjustments with your team."],
      ].map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </section>
    <ClosingSection title="What would you take off your plate?" text="A focused conversation is the first step toward a useful agent." testId="services-bottom-cta" />
  </div>;
}
