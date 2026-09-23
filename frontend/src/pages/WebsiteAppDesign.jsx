import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import DesignShowcase from "../components/DesignShowcase";
import { BOOKING_URL } from "../config/site";
import "./design.css";

const capabilities = [
  { number: "01", title: "Websites with a point of view.", text: "A clear story, a distinctive identity, and an effortless path to action. We design, develop, and launch your site, with the content tools and integrations your business needs.", items: ["Brand & creative direction", "Content structure & user journeys", "Responsive design & development", "CMS, performance & technical SEO"] },
  { number: "02", title: "Apps people want to use.", text: "Turn a complex idea into a working product. We map the journeys, design the interface, build the application, and connect the services behind it — then test and launch it with you.", items: ["Product strategy & experience design", "Interactive prototypes & user flows", "Web & mobile app development", "Design systems & connected services"] },
];
const stages = [
  ["Find the right direction.", "We get close to your business, your audience, and the problem to solve. Together, we define the scope and what a successful launch needs to achieve.", "Brief, priorities & project scope"],
  ["Make the experience tangible.", "We shape the structure, explore the visual direction, and prototype the key journeys. You see how it looks and feels before development begins.", "Design direction & interactive prototype"],
  ["Build every detail properly.", "We develop the experience, connect the services it needs, and test across screens, devices, and real user scenarios. Design stays involved throughout.", "Working product & quality assurance"],
  ["Launch with a clear handover.", "We prepare the release, check the live experience, and hand over the tools and documentation your team needs. Ongoing support is agreed around your product.", "Launch, documentation & support plan"],
];

export default function WebsiteAppDesign() {
  return <div className="design-page" data-testid="page-website-app-design">
    <section className="design-hero site-container" aria-labelledby="design-heading">
      <div className="design-section-label"><span className="design-label-dot" />Website & app development<span>Designed. Developed. Delivered.</span></div>
      <h1 id="design-heading">Designed with purpose.<br /><span>Built end to end.</span></h1>
      <div className="design-hero-bottom"><p>We take your website or app from the first idea to a working product. Strategy, design, development, integrations, testing, and launch — handled by one team, with a clear handover and ongoing support agreed around your needs.</p><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="button" data-testid="design-hero-cta">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      <DesignShowcase />
    </section>
    <section className="design-offering site-container" aria-labelledby="design-offering-heading">
      <div className="design-offering-heading"><p className="design-section-label">Considered as a whole</p><h2 id="design-offering-heading">Beautiful is the beginning.<br /><span>Useful is the point.</span></h2><p>Every decision has a job to do. How the story unfolds. How the interface responds. How easily someone finds what they came for.</p></div>
      <div className="design-capabilities">{capabilities.map((item) => <article key={item.number}><span className="design-index">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><ul>{item.items.map((detail) => <li key={detail}>{detail}<span aria-hidden="true">↗</span></li>)}</ul></article>)}</div>
    </section>
    <section className="design-execution" aria-labelledby="design-execution-heading"><div className="site-container design-execution-grid"><div className="design-execution-intro"><p className="design-section-label">From idea to everyday use</p><h2 id="design-execution-heading">The thinking.<br />The craft.<br /><span>The follow-through.</span></h2><p>A considered process with clear decisions, visible progress, and the same attention to detail all the way to launch.</p><Link to="/contact" className="text-link">Tell us what you have in mind <ArrowRight size={17} aria-hidden="true" /></Link></div><ol className="design-stages">{stages.map(([title, text, outcome], index) => <li key={title}><span className="design-index">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p><span className="design-stage-outcome">{outcome}</span></div></li>)}</ol></div></section>
    <section className="design-handover site-container" aria-labelledby="design-handover-heading"><p className="design-section-label">Built for what comes next</p><div><h2 id="design-handover-heading">A launch is a milestone.<br /><span>Your product keeps going.</span></h2><p>Your team gets a coherent design system, a maintainable build, and a clear handover. Where it adds value, we can connect your experience to the AI systems and workflows Ackra builds.</p></div><div className="design-quality-list"><span>Responsive by design</span><span>Accessibility considered</span><span>Performance tested</span><span>Ready to evolve</span></div></section>
    <section className="design-closing site-container"><p className="design-section-label">Your next chapter</p><div><h2>Let’s build something<br /><span>worth choosing.</span></h2><div><p>Bring the ambition. We’ll work through the direction, the scope, and the right way to bring it to life.</p><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="button" data-testid="design-bottom-cta">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></a><Link to="/contact" className="design-contact-link">Prefer to write? Tell us about it <ArrowRight size={15} aria-hidden="true" /></Link></div></div></section>
  </div>;
}
