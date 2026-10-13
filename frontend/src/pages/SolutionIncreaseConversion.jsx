import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Phone, MessageSquare, Star, RefreshCw } from "lucide-react";
import { PageHero, BookingLink, ClosingSection } from "../components/PageElements";
import { Reveal } from "../components/AnimatedText";

export default function SolutionIncreaseConversion() {
  return <div data-testid="page-solution-conversion">
    <PageHero title="Be there when it matters." text="AI assistants answer enquiries, understand what customers need, and help them take the next step, even when your team is busy." image="systems" imageAlt="Interwoven metallic strands forming an abstract computational structure"><BookingLink testId="solution-conversion-cta-top" /></PageHero>
    <section className="section-space site-container solution-intro"><h2 className="section-title">Keep a good conversation going.</h2><div className="prose"><p>A customer should not have to wait for a useful answer. We build AI assistants that respond to enquiries, ask the right questions, and help people take the next step.</p><p>The goal is a better experience: clear information, relevant follow-ups, and a smooth transition to your team when a person is needed.</p></div></section>
    <section className="section-space solution-capabilities"><div className="site-container"><h2 className="section-title">From first enquiry to next step.</h2><div className="usecase-grid">{[
      [Phone,"Answer incoming calls","Answer incoming calls, understand what customers need, and help them find an appointment."],
      [MessageSquare,"Text and web chat","Keep replies useful and consistent by text and on your website, with a person available for more involved conversations."],
      [Star,"Honest customer feedback","Invite customers to share their experience and help your team follow up on service issues."],
      [RefreshCw,"Reconnect with interested customers","Follow up based on what customers asked about, and stop contacting them when they ask."],
    ].map(([Icon,title,text])=><Reveal key={title} className="usecase-item"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></div></section>
    <section className="section-space site-container outcome-section"><h2 className="section-title">Look beyond the reply count.</h2><p className="section-intro">Track response time, conversations with potential customers, appointments, and how smoothly your team takes over. Agree on the measures that matter to your business before launch.</p><div className="outcome-questions"><p>Did the customer get an answer?</p><p>Was the next step clear?</p><p>Did the right person take over?</p></div><Link to="/services" className="text-link">How it works<ArrowRight size={17} aria-hidden="true" /></Link></section>
    <ClosingSection title="Make the next enquiry count." text="Tell us where customers lose interest or need more help. We’ll explore where an AI assistant could make a difference." />
    <div className="site-container back-link-wrap"><Link to="/" data-testid="solution-back-link" className="text-link"><ArrowLeft size={17} aria-hidden="true" />Back to home</Link></div>
  </div>;
}
