import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Phone, MessageSquare, Workflow, Star, ArrowRight } from "lucide-react";
import { Reveal } from "../components/AnimatedText";
import { BookingLink, EditorialImage, ClosingSection } from "../components/PageElements";

const agents = [
  { icon: Phone, title: "Answer every opportunity.", text: "Voice agents that answer calls, qualify enquiries, and help customers book a time.", label: "Voice agents" },
  { icon: MessageSquare, title: "Keep the conversation moving.", text: "Helpful replies across text and web chat, with a clear handoff when someone needs your team.", label: "Text agents" },
  { icon: Workflow, title: "Let your tools work together.", text: "Connect the details across your CRM, calendar, inbox, and internal workflows.", label: "Workflow automation" },
  { icon: Star, title: "Make feedback part of the process.", text: "Ask customers for honest reviews and bring service issues to the right person.", label: "Review follow-ups" },
];
const tools = [["hubspot", "HubSpot"], ["notion", "Notion"], ["stripe", "Stripe"], ["zapier", "Zapier"], ["googlesheets", "Google Sheets"]];

export default function Home() {
  return (
    <div data-testid="page-home">
      <section className="home-hero site-container">
        <div className="hero-copy">
          <p className="eyebrow">Built for the way you work</p>
          <h1>AI agents.<br /><span>Less busywork.</span></h1>
          <p className="hero-description">Custom AI that answers customers, connects your tools, and gives your team time back. Built and managed by Ackra.</p>
          <div className="hero-actions">
            <BookingLink testId="hero-cta-book" />
            <Link to="/services" data-testid="hero-cta-services" className="button button-secondary">How it works <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
        </div>
        <EditorialImage name="hero" alt="Black telephone handset on a brushed metal desk" priority className="hero-image" />
      </section>
      <section className="integration-section site-container" aria-label="Integrations">
        <p>Built around your existing tools.</p>
        <ul className="integration-logos">{tools.map(([slug, name]) => <li key={slug}><img src={`/brands/${slug}.svg`} alt={name} title={name} width="34" height="34" loading="lazy" /></li>)}</ul>
      </section>
      <section className="section-space site-container" aria-labelledby="home-solutions-heading">
        <Reveal><h2 id="home-solutions-heading" className="section-title">Start with what’s slowing you down.</h2><p className="section-intro">A missed call. An overflowing inbox. The same update in three different tools. There’s a better way to handle it.</p></Reveal>
        <div className="solution-pair">
          <Link to="/solutions/reduce-workload" className="solution-panel">
            <div><span className="panel-label">For your team</span><h3>More time for<br />the work that matters.</h3><p>Take repetitive admin off your plate and keep the details moving.</p></div>
            <span className="panel-link">Reduce workload <ArrowUpRight aria-hidden="true" /></span>
          </Link>
          <Link to="/solutions/increase-conversion" className="solution-panel solution-panel-accent">
            <div><span className="panel-label">For your customers</span><h3>A good response.<br />Every time it counts.</h3><p>Help more conversations become appointments, with timely replies and thoughtful follow-ups.</p></div>
            <span className="panel-link">Increase conversion <ArrowUpRight aria-hidden="true" /></span>
          </Link>
        </div>
      </section>
      <section className="section-space capabilities-section site-container" aria-labelledby="capabilities-heading">
        <div className="capability-heading"><h2 id="capabilities-heading" className="section-title">Useful by design.</h2><p className="section-intro">One well-scoped agent can make a meaningful difference. We build around the task, your tools, and your customers.</p></div>
        <div className="capability-layout">
          <EditorialImage name="workflow" alt="Notebook, pen, and laptop arranged on a gray worktable" className="capability-image" />
          <div className="capability-list">{agents.map(({ icon: Icon, title, text, label }) => <Reveal key={label} className="capability-item"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><div><p className="service-label">{label}</p><h3>{title}</h3><p>{text}</p></div></Reveal>)}</div>
        </div>
      </section>
      <section className="process-summary section-space" aria-labelledby="process-heading">
        <div className="site-container">
          <h2 id="process-heading" className="section-title">A clear path to a working agent.</h2>
          <p className="section-intro">Scope it together. Test it properly. Keep improving it.</p>
          <ol className="process-overview">
            {[
              ["Talk through the work", "Bring the task that costs your team the most time.", "step-01"],
              ["Make a practical plan", "Agree on the tools, success measures, and human handoffs.", "step-02"],
              ["Decide what fits", "Review the scope and ask questions before committing.", "step-03"],
              ["Build, test, and launch", "Start with a focused rollout and keep a human involved.", "step-04"],
            ].map(([title, text, anchor]) => <li key={title}><h3>{title}</h3><p>{text}</p><Link to={`/services#${anchor}`} aria-label={`Read more: ${title}`}><ArrowUpRight size={19} aria-hidden="true" /></Link></li>)}
          </ol>
          <Link className="text-link" data-testid="home-services-link" to="/services">How it works <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
      <ClosingSection title="Bring us your busywork." text="Tell us what takes too long. We’ll explore where an agent can help and what a sensible first build looks like." testId="home-bottom-cta" image />
    </div>
  );
}
