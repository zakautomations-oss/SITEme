import React from "react";
import { ArrowRight } from "lucide-react";
import "./WebsiteDesignPreview.css";

/** A static concept composed of native text, vector graphics, and photography. */
export default function WebsiteDesignPreview({ loading = "eager" }) {
  return (
    <div className="website-design-preview" role="img" aria-label="Alder / Rowe architecture website concept. The headline reads Architecture for the way we live. Courtyard House, a residential project from 2026, appears beside large architectural photography and a detail view. The website is an illustrative concept, not an interactive client website.">
      <div className="website-preview-canvas" aria-hidden="true">
        <div className="website-preview-header">
          <span className="website-preview-brand">ALDER / ROWE</span>
          <div className="website-preview-navigation"><span>Projects</span><span>Practice</span><span>Contact</span></div>
          <svg className="website-preview-menu" viewBox="0 0 30 26" fill="none" focusable="false"><path d="M1 7H29M1 19H29" /></svg>
        </div>
        <div className="website-preview-headline website-preview-headline-desktop"><span>Architecture for</span><span>the way we live.</span></div>
        <div className="website-preview-headline website-preview-headline-mobile"><span>Architecture</span><span>for the way</span><span>we live.</span></div>
        <div className="website-preview-project-layout">
          <div className="website-preview-project">
            <div className="website-preview-project-name">Courtyard House</div>
            <div className="website-preview-project-meta">Residential / 2026</div>
            <div className="website-preview-project-link"><span>View project</span><ArrowRight /></div>
            <div className="website-preview-detail">
              <img src="/images/app-courtyard.webp" alt="" width="1536" height="1024" loading={loading} decoding="async" />
            </div>
          </div>
          <div className="website-preview-hero">
            <img src="/images/app-courtyard.webp" alt="" width="1536" height="1024" loading={loading} decoding="async" />
          </div>
        </div>
      </div>
    </div>
  );
}
