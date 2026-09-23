import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import DesignShowcase from "./DesignShowcase";
import "../pages/design.css";

export default function DesignFeature() {
  return <section className="design-feature site-container" aria-labelledby="design-feature-heading">
    <div className="design-feature-intro">
      <p className="design-section-label">Website & app development</p>
      <h2 id="design-feature-heading">Websites and apps.<br />Built end to end.</h2>
      <p className="design-intro-copy">From the first brief to the live product. Strategy, design and development, with one team accountable for the delivery.</p>
      <Link to="/website-app-design" className="text-link" data-testid="home-design-link">Explore design & build <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </div>
    <DesignShowcase compact />
  </section>;
}
