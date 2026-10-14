import React from "react";
import { ArrowLeft, Check, ChevronRight, FileText, Home, Info, MessageCircle } from "lucide-react";
import "./AppDesignPreview.css";

function ScreenHeader({ back = false }) {
  return (
    <div className="app-preview-header">
      {back && <ArrowLeft />}
      <span>Alder / Rowe</span>
    </div>
  );
}

function ScreenNavigation({ active }) {
  return (
    <div className="app-preview-navigation">
      {[
        { label: "Overview", Icon: Home },
        { label: "Documents", Icon: FileText },
        { label: "Messages", Icon: MessageCircle },
      ].map(({ label, Icon }) => (
        <div key={label} className={active === label ? "is-current" : undefined}>
          <Icon />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function FloorPlan() {
  return (
    <svg className="app-preview-floorplan" viewBox="0 0 160 150" focusable="false">
      <rect width="160" height="150" fill="#eeeee8" />
      <path d="M10 12H150V139H10Z" fill="#f9f9f5" stroke="#c8c9bf" />
      <path d="M19 22H139V127H19Z M19 53H55V22 M19 89H55V127 M55 22V40 M55 53V105 M55 118V127 M87 22V56H139 M87 73V98H139 M87 112V127 M55 76H87 M108 22V56 M109 98V127" fill="none" stroke="#353a35" strokeWidth="2.4" />
      <path d="M24 22H42 M62 22H80 M117 22H133 M139 30V47 M139 63V84 M139 105V121 M96 127H119 M25 127H44 M19 62V78" fill="none" stroke="#d6d9d1" strokeWidth="3.5" />
      <path d="M55 40A13 13 0 0 1 68 53H55 M55 105A13 13 0 0 0 68 118H55 M87 56A17 17 0 0 1 104 73H87" fill="none" stroke="#959b91" strokeWidth=".9" />
      <g fill="none" stroke="#c1c5ba" strokeWidth="1">
        <rect x="25" y="28" width="23" height="16" />
        <path d="M28 28V44 M44 28V44" />
        <rect x="26" y="99" width="21" height="18" />
        <path d="M29 99V117 M44 99V117" />
        <rect x="64" y="34" width="15" height="25" rx="2" />
        <rect x="67" y="86" width="10" height="22" rx="3" />
        <rect x="94" y="30" width="8" height="16" />
        <path d="M113 31H132V47H113Z M116 35H129V43H116Z M92 80H132V90H92Z" />
      </g>
      <g fill="#bfc8a4" fillOpacity=".72">
        <circle cx="101" cy="115" r="12" />
        <circle cx="122" cy="113" r="9" />
        <circle cx="126" cy="69" r="8" />
      </g>
      <g stroke="#899478" strokeWidth=".8" opacity=".6">
        <path d="M101 105V124 M92 115H110 M95 108L108 121 M122 106V120 M116 113H128" />
      </g>
      <path d="M13 7H146 M5 18V132 M16 4V10 M142 4V10 M2 22H8 M2 127H8" fill="none" stroke="#9c9f96" strokeWidth=".6" />
    </svg>
  );
}

function ProjectScreen() {
  return (
    <div className="app-preview-screen app-preview-project">
      <ScreenHeader />
      <div className="app-preview-body">
        <div className="app-preview-heading">
          <div className="app-preview-title">Your project</div>
          <div className="app-preview-project-name">Courtyard House</div>
        </div>
        <img className="app-preview-courtyard" src="/images/app-courtyard.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
        <div className="app-preview-project-detail">
          <span>Current phase</span>
          <strong>Design development</strong>
        </div>
        <div className="app-preview-project-detail">
          <span>Next meeting</span>
          <strong>Thursday, 10:30</strong>
        </div>
        <div className="app-preview-team">
          <div className="app-preview-muted-label">Project team</div>
          <div className="app-preview-people">
            {[["AL", "Anna"], ["JM", "James"], ["EC", "Emma"]].map(([initials, name]) => (
              <div key={name}><span className="app-preview-avatar">{initials}</span><span>{name}</span></div>
            ))}
          </div>
        </div>
      </div>
      <ScreenNavigation active="Overview" />
    </div>
  );
}

function ReviewScreen() {
  return (
    <div className="app-preview-screen app-preview-review">
      <ScreenHeader back />
      <div className="app-preview-body">
        <div className="app-preview-heading">
          <div className="app-preview-title">Design review</div>
          <div className="app-preview-subtitle">2 items need your review</div>
        </div>
        <div className="app-preview-review-list">
          <div className="app-preview-review-row">
            <div className="app-preview-thumbnail"><FloorPlan /></div>
            <div className="app-preview-review-copy"><span>Ground floor plan</span><span className="app-preview-status is-approved"><Check />Approved</span></div>
            <ChevronRight className="app-preview-chevron" />
          </div>
          <div className="app-preview-review-row">
            <img className="app-preview-thumbnail" src="/images/app-materials.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
            <div className="app-preview-review-copy"><span>Material palette</span><span className="app-preview-status">Needs review</span></div>
            <ChevronRight className="app-preview-chevron" />
          </div>
          <div className="app-preview-review-row">
            <div className="app-preview-thumbnail app-preview-lighting"><span className="app-preview-light-beam" /><span className="app-preview-sconce" /></div>
            <div className="app-preview-review-copy"><span>Lighting study</span><span className="app-preview-status">Needs review</span></div>
            <ChevronRight className="app-preview-chevron" />
          </div>
        </div>
        <div className="app-preview-note"><Info /><span>Your feedback keeps the project moving.</span></div>
      </div>
      <ScreenNavigation active="Documents" />
    </div>
  );
}

function MaterialsScreen() {
  return (
    <div className="app-preview-screen app-preview-materials">
      <ScreenHeader back />
      <div className="app-preview-body">
        <div className="app-preview-heading">
          <div className="app-preview-title">Material palette</div>
          <div className="app-preview-subtitle">Courtyard House</div>
        </div>
        <img className="app-preview-material-photo" src="/images/app-materials.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
        <div className="app-preview-material-list">
          {[["limestone", "Limestone"], ["oak", "Oak"], ["steel", "Brushed steel"]].map(([material, name]) => (
            <div className="app-preview-material-row" key={material}>
              <span className={`app-preview-swatch app-preview-swatch-${material}`} />
              <span>{name}</span>
            </div>
          ))}
        </div>
        <div className="app-preview-approval">
          <span>Request changes</span>
          <span>Approve selection</span>
        </div>
      </div>
    </div>
  );
}

/** Illustrative screens: real text and vector icons, with no simulated controls. */
export default function AppDesignPreview() {
  return (
    <div className="app-design-preview" role="img" aria-label="Alder / Rowe client portal concept. Three app screens show the Courtyard House project, a design review with one approved drawing and two items awaiting review, and a material palette of limestone, oak, and brushed steel. The screens are illustrative, not interactive.">
      <div className="app-preview-board" aria-hidden="true">
        <ProjectScreen />
        <ReviewScreen />
        <MaterialsScreen />
      </div>
    </div>
  );
}
