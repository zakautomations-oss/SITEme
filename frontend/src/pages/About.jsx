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
      <div className="prose"><p>We connect your business tools, automate the steps between them, and build AI assistants to answer customer questions and support your team. Each system is built around the way your business works.</p><p>We agree on the work with you, build the system, and stay involved as it handles real conversations and day-to-day tasks. You get a system you can understand and a person you can reach.</p><Link to="/services" className="text-link">How it works <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </section>
    <section className="section-space principles-section site-container" aria-labelledby="principles-heading">
      <h2 className="section-title" id="principles-heading">Clear expectations. Shared ownership.</h2>
      <div className="principle-list">
        {[
          ["Built around your business.", "Your tools, your language, your way of working. We agree on the job before choosing the technology."],
          ["A human stays responsible.", "Every AI assistant needs clear rules for when a person should step in. Your team knows when to take over, and we stay available to improve the system."],
          ["You can see how it works.", "We document the AI’s instructions, the tools it connects to, and its limitations so you can understand how it works."],
        ].map(([title,text]) => <Reveal className="principle-row" key={title}><h3>{title}</h3><p>{text}</p></Reveal>)}
      </div>
    </section>
    <section className="site-container section-space about-detail about-detail-text"><div><h2 className="section-title">Start small.<br />Make it useful.</h2><p className="section-intro">A first project with a clear purpose gives you something useful to assess. We’ll agree on what success looks like before the build begins.</p><p className="body-note">The next project follows from what the first one teaches us.</p></div></section>
    <ClosingSection title="Let’s talk about the work." text="Bring one process you’d like to improve. We’ll help you understand what an AI assistant could take on." />
  </div>;
}
