import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import DesignShowcase from "../components/DesignShowcase";
import { BOOKING_URL, CONTACT_EMAIL } from "../config/site";
import "./design.css";

const capabilities = [
  { title: "Websites", text: "A distinctive website that helps people understand your business and take the next step.", items: ["Clear content, a distinctive look and layouts for every screen", "Development, tools to update your content and connections to your business software", "Fast loading, search engine setup and launch preparation"] },
  { title: "Apps", text: "Custom software built around the people using it and the work they need to get done.", items: ["Product planning, clear navigation and interface design", "Web and mobile development, data storage and connections to other tools", "Testing, launch and guidance for your team"] },
];
const stages = [
  ["Plan", "Agree on who it’s for, what it needs to do, and what we’ll deliver before work begins.", "Project brief & delivery plan"],
  ["Design", "Review the layout, look, and main features in an interactive preview before development begins.", "Approved design & interactive preview"],
  ["Build", "Build the website or app and connect it to the tools it needs. Review working versions and test the complete experience.", "Working product & final checks"],
  ["Launch", "Launch the product, check that it works, and give your team the code, tools, and instructions. Agree on ongoing support.", "Live product & team guidance"],
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
      <div><h2 id="design-closing-heading">Let’s discuss your project.</h2><p>Tell us what you’re building. We’ll help you decide what it needs and how to bring it to life.</p></div>
      <div className="design-closing-actions"><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="button" data-testid="design-bottom-cta">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></a><a href={`mailto:${CONTACT_EMAIL}`} className="design-contact-link">Email your project details <ArrowRight size={15} aria-hidden="true" /></a></div>
    </section>
  </div>;
}
