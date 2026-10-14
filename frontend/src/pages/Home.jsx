import React, { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { BookingLink } from "../components/PageElements";
import AckraMark from "../components/AckraMark";
import { BOOKING_DURATION } from "../config/site";
import CapabilitiesAccordion from "../components/CapabilitiesAccordion";
import IntegrationMarquee from "../components/IntegrationMarquee";
import DesignFeature from "../components/DesignFeature";
import { useHomeMotionEnabled } from "../components/useHomeMotionEnabled";
import "./home.css";

const HomeMotion = lazy(() => import("../components/HomeMotion"));
const process = [
  ["Talk through the work", "Tell us where your jewelry team loses time, from product enquiries to order updates and follow-ups.", "step-01"],
  ["Make a practical plan", "Choose the first tasks, the product and customer information they need, and when your team takes over.", "step-02"],
  ["Build, test, and launch", "Test with enquiries and orders like yours, launch with a clear set of tasks, and keep improving together.", "step-04"],
];
const statement = "Less routine admin. More time for your customers.";

export default function Home() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const motionEnabled = useHomeMotionEnabled();
  return (
    <div ref={pageRef} data-testid="page-home" className="home-page">
      <section ref={heroRef} className="home-hero site-container">
        <div className="hero-copy">
          <h1 className="max-w-6xl">AI for<br /><span>jewelry businesses.</span></h1>
          <p className="hero-description">Answer product enquiries, book consultations, and keep customers updated on orders and repairs. Custom AI for jewelry stores, brands, and online jewelers. Built and managed by Ackra.</p>
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
          <h2 id="capabilities-heading" className="section-title">Built around<br />the jewelry business.</h2>
          <p className="section-intro">From a first question about a piece to an update on a custom order, we connect the information your team needs to give customers a useful answer.</p>
        </div>
        <CapabilitiesAccordion />
      </section>
      <DesignFeature />
      <section className="home-outcomes home-chapter site-container" aria-labelledby="home-solutions-heading">
        <h2 id="home-solutions-heading" className="home-statement" aria-label={statement}><span aria-hidden="true">{statement.split(" ").map((word, index) => <React.Fragment key={`${word}-${index}`}><span className="statement-word">{word}</span>{" "}{index === 2 && <br />}</React.Fragment>)}</span></h2>
        <div className="solution-pair grid-flow-dense">
          <Link to="/solutions/reduce-workload" className="solution-panel">
            <div><h3>More time for<br />the personal details.</h3><p>Keep customer records, repair updates, and order follow-ups moving. Give your team more time for consultations and the pieces your customers care about.</p></div>
            <span className="panel-link">Reduce workload <ArrowUpRight aria-hidden="true" /></span>
          </Link>
          <Link to="/solutions/increase-conversion" className="solution-panel solution-panel-accent">
            <div><h3>From first enquiry<br />to a store visit.</h3><p>Help customers ask about a piece, arrange a consultation, or follow up on a quote. Keep the conversation going in store and online.</p></div>
            <span className="panel-link">Win more customers <ArrowUpRight aria-hidden="true" /></span>
          </Link>
        </div>
      </section>
      <section className="home-process home-chapter" aria-labelledby="process-heading">
        <div className="site-container home-process-layout">
          <div className="home-process-intro">
            <h2 id="process-heading" className="section-title">A practical start for your jewelry team.</h2>
            <p className="section-intro">Start with one task that takes time away from customers. Build from what works.</p>
            <Link className="text-link" data-testid="home-services-link" to="/services">Explore the process <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <ol className="home-process-steps">{process.map(([title, text, anchor]) => <li key={anchor}><Link to={`/services#${anchor}`}><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" /></Link></li>)}</ol>
        </div>
      </section>
      <section className="home-closing home-chapter site-container">
        <h2>Your jewelry business.<br /><span className="closing-line"><span className="inline-editorial-image" aria-hidden="true"><img src="/images/studio-640.webp" width="160" height="100" alt="" loading="lazy" decoding="async" /></span>Better supported.</span></h2>
        <div className="home-closing-details"><p className="section-intro">Tell us how your store, showroom, or online business works. We’ll explore where AI can help with enquiries, appointments, and the work behind each sale.</p><div><BookingLink testId="home-bottom-cta" /><p className="booking-detail">{BOOKING_DURATION} minutes to talk through your next step.</p></div></div>
      </section>
      {motionEnabled && <Suspense fallback={null}><HomeMotion pageRef={pageRef} /></Suspense>}
    </div>
  );
}
