import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Inbox, Workflow, Send, FileText } from "lucide-react";
import { PageHero, BookingLink, ClosingSection } from "../components/PageElements";
import { Reveal } from "../components/AnimatedText";

export default function SolutionReduceWorkload() {
  return <div data-testid="page-solution-reduce">
    <PageHero eyebrow="Reduce workload" title="Get your time back." text="Give repetitive tasks a reliable process, so your team can focus on customers and the work that needs them." image="workflow" imageAlt="A clear workspace with a notebook, pen, and laptop"><BookingLink testId="solution-reduce-cta-top" /></PageHero>
    <section className="section-space site-container solution-intro"><h2 className="section-title">Less copying.<br />Fewer loose ends.</h2><div className="prose"><p>Inbox triage, manual updates, and forgotten follow-ups add up. We look at where your team repeats the same work, then build an agent with a clear job.</p><p>Your existing tools stay part of the workflow. We connect the steps and make exceptions visible to the people who need to handle them.</p></div></section>
    <section className="section-space solution-capabilities"><div className="site-container"><h2 className="section-title">Put the routine work in order.</h2><div className="usecase-grid">{[
      [Inbox,"Inbox triage","Classify incoming messages, draft useful replies, and bring important conversations to your attention."],
      [Workflow,"Cross-tool updates","Keep the details consistent across your CRM, payment tools, internal notes, and team channels."],
      [Send,"Considerate follow-ups","Track quotes and proposals, send relevant reminders, and stop when a contact replies or opts out."],
      [FileText,"Reporting","Bring activity from your tools into a readable summary that your team can review."],
    ].map(([Icon,title,text])=><Reveal key={title} className="usecase-item"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></div></section>
    <section className="section-space site-container outcome-section"><h2 className="section-title">Measure the work you get back.</h2><p className="section-intro">Agree on a baseline before launch and track the change. Useful measures include time spent, manual touchpoints, and work needing correction.</p><div className="outcome-questions"><p>What repeats every day?</p><p>Where do details get lost?</p><p>What should always reach a person?</p></div><Link to="/services" className="text-link">How it works<ArrowRight size={17} aria-hidden="true" /></Link></section>
    <ClosingSection title="Start with one task." text="Tell us where the busywork builds up. We’ll help you find a practical place to start." image />
    <div className="site-container back-link-wrap"><Link to="/" data-testid="solution-back-link" className="text-link"><ArrowLeft size={17} aria-hidden="true" />Back to home</Link></div>
  </div>;
}
