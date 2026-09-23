import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import DesignShowcase from "./DesignShowcase";
import "../pages/design.css";

export default function DesignFeature() {
  return <section className="design-feature site-container" aria-labelledby="design-feature-heading">
    <div className="design-section-label"><span className="design-label-dot" />Website & app development<span>Design & build, end to end</span></div>
    <div className="design-feature-intro">
      <h2 id="design-feature-heading">The way it looks.<br /><span>The way it works.</span></h2>
      <div><p>Distinctive websites. Intuitive apps. We handle the complete build: strategy, design, development, testing, and launch. One team, from the first idea to your live product.</p><Link to="/website-app-design" className="text-link" data-testid="home-design-link">Explore design & build <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </div>
    <DesignShowcase compact />
    <div className="design-feature-scope"><span>One partner. From first sketch to live product.</span><p>Strategy <i /> Design <i /> Development <i /> Launch</p></div>
  </section>;
}
