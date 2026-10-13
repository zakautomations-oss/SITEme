import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Inbox, Workflow, Send, FileText } from "lucide-react";
import { PageHero, BookingLink, ClosingSection } from "../components/PageElements";
import { Reveal } from "../components/AnimatedText";

export default function SolutionReduceWorkload() {
  return <div data-testid="page-solution-reduce">
    <PageHero title="Get your time back." text="Let AI handle routine tasks, so your team can focus on customers and the work that needs their attention." image="calm-lake" imageAlt="Soft morning light over a quiet lake, with gentle ripples around a shoreline stone"><BookingLink testId="solution-reduce-cta-top" /></PageHero>
    <section className="section-space site-container solution-intro"><h2 className="section-title">Less copying.<br />Fewer loose ends.</h2><div className="prose"><p>Sorting messages, updating records, and chasing follow-ups take time. We identify the work your team repeats, then build an AI assistant to handle specific tasks.</p><p>Your existing tools stay part of the process. We connect the steps and flag anything that needs your team’s attention.</p></div></section>
    <section className="section-space solution-capabilities"><div className="site-container"><h2 className="section-title">Put the routine work in order.</h2><div className="usecase-grid">{[
      [Inbox,"Inbox management","Sort incoming messages, draft useful replies, and bring important conversations to your attention."],
      [Workflow,"Keep your tools up to date","Keep the details consistent across your customer records, payment tools, internal notes, and team messages."],
      [Send,"Timely follow-ups","Track quotes and proposals, send relevant reminders, and stop when a contact replies or asks not to be contacted."],
      [FileText,"Reporting","Bring activity from your tools into a readable summary that your team can review."],
    ].map(([Icon,title,text])=><Reveal key={title} className="usecase-item"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></div></section>
    <section className="section-space site-container outcome-section"><h2 className="section-title">See how much time you save.</h2><p className="section-intro">Measure the work before launch and track what changes. Look at time spent, steps your team handles manually, and work that needs correcting.</p><div className="outcome-questions"><p>What repeats every day?</p><p>Where do details get lost?</p><p>What should always reach a person?</p></div><Link to="/services" className="text-link">How it works<ArrowRight size={17} aria-hidden="true" /></Link></section>
    <ClosingSection title="Start with one task." text="Tell us where the busywork builds up. We’ll help you find a practical place to start." />
    <div className="site-container back-link-wrap"><Link to="/" data-testid="solution-back-link" className="text-link"><ArrowLeft size={17} aria-hidden="true" />Back to home</Link></div>
  </div>;
}
