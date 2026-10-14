import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Inbox, Workflow, Send, FileText } from "lucide-react";
import { PageHero, BookingLink, ClosingSection } from "../components/PageElements";
import { Reveal } from "../components/AnimatedText";

export default function SolutionReduceWorkload() {
  return <div data-testid="page-solution-reduce">
    <PageHero title="More time for your customers." text="AI assistants help your jewelry team manage messages, keep records current, and follow up on everyday work." image="jewelry-orders" imageAlt="A gold necklace in an open jewelry box beside packing materials on a light stone desk"><BookingLink testId="solution-reduce-cta-top" /></PageHero>
    <section className="section-space site-container solution-intro"><h2 className="section-title">Less copying.<br />Fewer loose ends.</h2><div className="prose"><p>Customers want to know whether a repair is ready or an order has moved forward. We build AI assistants that use your existing records to share updates and flag missing information for your team.</p><p>For stores, jewelry brands, and online jewelers, the work often moves between several tools. We connect the steps while your team handles decisions and requests that need personal attention.</p></div></section>
    <section className="section-space solution-capabilities"><div className="site-container"><h2 className="section-title">Put the routine work in order.</h2><div className="usecase-grid">{[
      [Inbox,"Customer messages","Sort order and repair enquiries, draft replies using your records, and flag questions that need your team."],
      [Workflow,"Customer and order records","Keep customer details, order updates, and internal notes consistent across the tools your team uses."],
      [Send,"Timely follow-ups","Follow up on open quotes and send pickup reminders. Stop when a customer replies or asks not to be contacted."],
      [FileText,"Team summaries","Bring open enquiries, pending updates, and tasks needing attention into a summary your team can review."],
    ].map(([Icon,title,text])=><Reveal key={title} className="usecase-item"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></div></section>
    <section className="section-space site-container outcome-section"><h2 className="section-title">See how much time you save.</h2><p className="section-intro">Measure the work before launch and track what changes. Look at time spent finding order details, updating records, and correcting mistakes.</p><div className="outcome-questions"><p>Which updates take the most time?</p><p>Where do order details get lost?</p><p>What should always reach your team?</p></div><Link to="/services" className="text-link">How it works<ArrowRight size={17} aria-hidden="true" /></Link></section>
    <ClosingSection title="Start with one task." text="Tell us which daily task slows your jewelry team down. We’ll help you find a practical place to start." />
    <div className="site-container back-link-wrap"><Link to="/" data-testid="solution-back-link" className="text-link"><ArrowLeft size={17} aria-hidden="true" />Back to home</Link></div>
  </div>;
}
