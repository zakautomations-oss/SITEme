import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, BookingLink, ClosingSection } from "../components/PageElements";
import { Reveal } from "../components/AnimatedText";

export default function About() {
  return <div data-testid="page-about">
    <PageHero title="Good systems. Real people." text="We build and manage AI systems for jewelry businesses, with people accountable for the result."><BookingLink testId="about-cta" /></PageHero>
    <section className="section-space site-container about-story">
      <div><h2 className="section-title">The work doesn’t stop at launch.</h2><p className="section-intro">Ackra is a New York studio building AI systems for jewelry stores, showrooms, brands, and online jewelers.</p></div>
      <div className="prose"><p>Jewelry is a personal business. We build AI assistants to support the work around each customer relationship, connecting your tools and handling routine steps so your team can give customers its attention.</p><p>We agree on the work with you, build the system, and stay involved as it handles real enquiries and daily tasks. You get a system you can understand and a person you can reach.</p><Link to="/services" className="text-link">How it works <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </section>
    <section className="section-space principles-section site-container" aria-labelledby="principles-heading">
      <h2 className="section-title" id="principles-heading">Clear expectations. Shared ownership.</h2>
      <div className="principle-list">
        {[
          ["Built around your business.", "Your collections, your customer relationships, your way of working. We agree on the job before choosing the technology."],
          ["Your team stays responsible.", "Jewelry recommendations, pricing decisions, and complex requests stay with your team. We set clear rules for when the assistant should involve them."],
          ["You can see how it works.", "We document the assistant’s instructions, the business records it uses, and its limits so you can understand how it works."],
        ].map(([title,text]) => <Reveal className="principle-row" key={title}><h3>{title}</h3><p>{text}</p></Reveal>)}
      </div>
    </section>
    <section className="site-container section-space about-detail about-detail-text"><div><h2 className="section-title">Start small.<br />Make it useful.</h2><p className="section-intro">Start with one part of your jewelry business that could run more smoothly. We’ll agree on what success looks like before the build begins.</p><p className="body-note">The next project follows from what the first one teaches us.</p></div></section>
    <ClosingSection title="Let’s talk about your business." text="Tell us about your jewelry business and the work behind each customer interaction. We’ll help you find a useful place for AI." />
  </div>;
}
