import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, BookingLink, ClosingSection } from "../components/PageElements";
import { Reveal } from "../components/AnimatedText";

export default function About() {
  return <div data-testid="page-about">
    <PageHero title="Good systems. Real people." text="We build and manage AI systems around the way your business works, with people accountable for the result."><BookingLink testId="about-cta" /></PageHero>
    <section className="section-space site-container about-story">
      <div><h2 className="section-title">The work doesn’t stop at launch.</h2><p className="section-intro">Ackra is a New York studio for businesses that want useful automation and a team to run it.</p></div>
      <div className="prose"><p>We connect business tools, automate multi-step processes, and build agents that support customers and teams. The system starts with the way your business works.</p><p>We scope the work with you, build the system, and stay involved as it handles real conversations and workflows. You get a system you can understand and a person you can reach.</p><Link to="/services" className="text-link">How it works <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </section>
    <section className="section-space principles-section site-container" aria-labelledby="principles-heading">
      <h2 className="section-title" id="principles-heading">Clear expectations. Shared ownership.</h2>
      <div className="principle-list">
        {[
          ["Built around your business.", "Your tools, your language, your workflows. We agree on the job before choosing the technology."],
          ["A human stays responsible.", "Every agent needs a clear escalation path. Your team knows when to step in, and we stay available to improve the system."],
          ["You can see how it works.", "We document prompts, integrations, and known limitations so you can review the decisions behind your agent."],
        ].map(([title,text]) => <Reveal className="principle-row" key={title}><h3>{title}</h3><p>{text}</p></Reveal>)}
      </div>
    </section>
    <section className="site-container section-space about-detail about-detail-text"><div><h2 className="section-title">Start small.<br />Make it useful.</h2><p className="section-intro">A focused first agent gives you something concrete to evaluate. We’ll agree on what success looks like before the build begins.</p><p className="body-note">The next project follows from what the first one teaches us.</p></div></section>
    <ClosingSection title="Let’s talk about the work." text="Bring one workflow you’d like to improve. We’ll help you understand what an agent could take on." />
  </div>;
}
