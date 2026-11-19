import React from "react";
import { ArrowRight } from "lucide-react";
import CalendlyInline from "../components/CalendlyInline";
import { PageHero, ClosingSection } from "../components/PageElements";
import { BOOKING_URL, BOOKING_LABEL, BOOKING_DURATION } from "../config/site";

const stages = [["step-01","Book a call"],["step-02","Plan the work"],["step-04","Build and launch"]];

export default function Services() {
  return <div data-testid="page-services">
    <PageHero title={<>A clear plan.<br />A working system.</>} text="We plan, build, and manage AI assistants around the way your jewelry business serves customers and handles daily work.">
      <a className="button" href="#step-01" data-testid="process-01-cta">{BOOKING_LABEL}<ArrowRight size={17} aria-hidden="true" /></a>
    </PageHero>
    <nav className="process-index site-container" aria-label="On this page">{stages.map(([id,label],i)=><a key={id} href={`#${id}`} data-testid={`process-index-0${i+1}`}>{label}<ArrowRight size={15} aria-hidden="true" /></a>)}</nav>
    <section id="step-01" className="section-space site-container booking-section" data-testid="process-step-01">
      <div className="booking-context"><h2 className="section-title">Start with a conversation.</h2><p className="section-intro">Tell us how your jewelry business works, where your team spends its time, and what you would like to improve.</p><dl className="call-details"><div><dt>Duration</dt><dd>{BOOKING_DURATION} minutes</dd></div><div><dt>Format</dt><dd>Video call</dd></div><div><dt>Preparation</dt><dd>One process to discuss</dd></div></dl><p className="body-note">Meeting details arrive with your booking confirmation.</p><a href={BOOKING_URL} className="text-link" target="_blank" rel="noopener noreferrer" data-testid="process-01-open-newtab">{BOOKING_LABEL}<ArrowRight size={17} aria-hidden="true" /></a></div>
      <CalendlyInline url={BOOKING_URL} height={760} />
    </section>
    <section id="step-02" className="section-space process-clarity" data-testid="process-step-02"><div className="site-container">
      <h2 className="section-title">Turn the problem into a plan.</h2><p className="section-intro">Together, we review how enquiries and orders move through your business, which tools hold the details, and where an AI assistant could help.</p>
      <div className="deliverables-grid"><article><h3>How the work gets done</h3><p>From a customer’s first question to your team’s next action, we identify the steps worth automating.</p></article><article><h3>What the AI will handle</h3><p>Which business records it can use, which tasks it can complete, and when your team takes over.</p></article><article><h3>The measure of success</h3><p>Clear measures to track the time saved, effort reduced, or quality of customer responses.</p></article></div>
    </div></section>
    <section id="step-04" className="section-space site-container" data-testid="process-step-04">
      <h2 className="section-title">Build carefully. Launch with support.</h2><p className="section-intro">A typical first build takes about three to four weeks once we agree on the work. Timing depends on the tools we need to connect and the testing required.</p>
      <ol className="delivery-timeline">{[
        ["Agree on the plan", "Agree on the tasks, required access, measures of success, and when a person should step in."],
        ["Build and connect", "Connect the agreed tools and records, then set the AI assistant’s instructions and limits."],
        ["Testing and review", "Test customer requests and incomplete order details together, then review the results and resolve issues."],
        ["Controlled launch", "Start using the system, review its performance, and make adjustments with your team."],
      ].map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </section>
    <ClosingSection title="What would you take off your plate?" text="Bring one part of running your jewelry business that takes more time than it should. We’ll explore a practical first project." testId="services-bottom-cta" />
  </div>;
}
