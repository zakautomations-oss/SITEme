import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Phone, MessageSquare, Star, RefreshCw } from "lucide-react";
import { PageHero, BookingLink, ClosingSection } from "../components/PageElements";
import { Reveal } from "../components/AnimatedText";

export default function SolutionIncreaseConversion() {
  return <div data-testid="page-solution-conversion">
    <PageHero title="Turn interest into a conversation." text="AI assistants help jewelry customers get answers, arrange consultations, and reach your team, whether they enquire online or call your store." image="jewelry-showroom" imageAlt="Rings, earrings, and a necklace on a velvet tray in a jewelry showroom consultation area"><BookingLink testId="solution-conversion-cta-top" /></PageHero>
    <section className="section-space site-container solution-intro"><h2 className="section-title">Keep a good conversation going.</h2><div className="prose"><p>A customer may be checking whether a piece is available, planning a gift, or asking about a custom order. We build AI assistants that answer from your business records, gather the details, and help arrange the next step.</p><p>Your team stays responsible for jewelry recommendations, pricing decisions, and complex requests. The assistant helps customers reach them with the information they need.</p></div></section>
    <section className="section-space solution-capabilities"><div className="site-container"><h2 className="section-title">From first enquiry to a personal conversation.</h2><div className="usecase-grid">{[
      [Phone,"Calls and appointments","Answer incoming calls, find out what the customer is looking for, and help book a store visit or consultation."],
      [MessageSquare,"Text and web chat","Answer product and availability questions using your records, collect custom-order enquiries, and involve your team when needed."],
      [Star,"Customer feedback","Invite customers to share their experience after a purchase or visit, and help your team follow up on service issues."],
      [RefreshCw,"Follow up after a visit","Reconnect about a piece or consultation a customer showed interest in, and stop contacting them when they ask."],
    ].map(([Icon,title,text])=><Reveal key={title} className="usecase-item"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></div></section>
    <section className="section-space site-container outcome-section"><h2 className="section-title">Look beyond the reply count.</h2><p className="section-intro">Track response times, consultation bookings, and how smoothly your team takes over. Agree on the measures that matter to your jewelry business before launch.</p><div className="outcome-questions"><p>Did the customer get an answer?</p><p>Was it easy to arrange a consultation?</p><p>Did your team have the right details?</p></div><Link to="/services" className="text-link">How it works<ArrowRight size={17} aria-hidden="true" /></Link></section>
    <ClosingSection title="Make the next enquiry count." text="Tell us how customers discover your jewelry and where they need more help. We’ll explore where an AI assistant could support the conversation." />
    <div className="site-container back-link-wrap"><Link to="/" data-testid="solution-back-link" className="text-link"><ArrowLeft size={17} aria-hidden="true" />Back to home</Link></div>
  </div>;
}
