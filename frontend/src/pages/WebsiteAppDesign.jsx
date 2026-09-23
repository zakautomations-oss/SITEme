import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import DesignShowcase from "../components/DesignShowcase";
import { BOOKING_URL, CONTACT_EMAIL } from "../config/site";
import "./design.css";

const capabilities = [
  { title: "Websites", text: "A distinct presence for your business, with the structure and technology to support it.", items: ["Content structure, visual identity and responsive design", "Development, content management and integrations", "Performance, technical SEO and launch preparation"] },
  { title: "Applications", text: "Custom software built around the people using it and the work they need to get done.", items: ["Product scope, user journeys and interface design", "Web and mobile development, data and connected services", "Testing, release and operational handover"] },
];
const stages = [
  ["Scope", "Define the users, priorities and technical requirements. Agree the deliverables before work begins.", "Agreed brief & delivery plan"],
  ["Design", "Resolve the structure, visual direction and key interactions in a prototype you can review.", "Approved design & prototype"],
  ["Build", "Develop the product and its integrations. Review working releases and test the complete experience.", "Working product & release checks"],
  ["Launch", "Deploy, verify the live experience and hand over the code, tools and documentation. Agree ongoing support.", "Live product & handover"],
];

export default function WebsiteAppDesign() {
  return <div className="design-page" data-testid="page-website-app-design">
    <section className="design-hero site-container" aria-labelledby="design-heading">
      <p className="design-section-label">Website & app development</p>
      <h1 id="design-heading">Websites and apps.<br />Built end to end.</h1>
      <p className="design-intro-copy">Strategy, design, development and launch. Built for revenue, looks, and something never seen before.</p>
      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="button" data-testid="design-hero-cta">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></a>
      <DesignShowcase />
    </section>
    <section className="design-offering site-container" aria-labelledby="design-offering-heading">
      <h2 id="design-offering-heading">What we build</h2>
      <div className="design-capabilities">{capabilities.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p><ul>{item.items.map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}</div>
    </section>
    <section className="design-execution" aria-labelledby="design-execution-heading"><div className="site-container">
      <h2 id="design-execution-heading">From brief to launch</h2>
      <p className="design-execution-copy">One team responsible for the complete product. Clear decisions at each stage. A working product at the end.</p>
      <ol className="design-stages">{stages.map(([title, text, outcome]) => <li key={title}><h3>{title}</h3><p>{text}</p><span className="design-stage-outcome">{outcome}</span></li>)}</ol>
    </div></section>
    <section className="design-closing site-container" aria-labelledby="design-closing-heading">
      <div><h2 id="design-closing-heading">Let’s discuss your project.</h2><p>Tell us what you’re building. We’ll help define the scope and the right approach.</p></div>
      <div className="design-closing-actions"><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="button" data-testid="design-bottom-cta">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></a><a href={`mailto:${CONTACT_EMAIL}`} className="design-contact-link">Email a project brief <ArrowRight size={15} aria-hidden="true" /></a></div>
    </section>
  </div>;
}
