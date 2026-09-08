import React from "react";
import { ArrowUpRight } from "lucide-react";
import { BOOKING_URL, BOOKING_LABEL, BOOKING_DURATION } from "../config/site";
import { Reveal } from "./AnimatedText";

export function BookingLink({ testId, className = "" }) {
  return <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" data-testid={testId} className={`button ${className}`}>{BOOKING_LABEL}<ArrowUpRight size={17} strokeWidth={1.7} aria-hidden="true" /></a>;
}
export function EditorialImage({ name, alt, priority = false, className = "" }) {
  const dimensions = name === "studio" ? { width: 1440, height: 960 } : { width: 1440, height: 1080 };
  return <img className={`editorial-image ${className}`} src={`/images/${name}-960.webp`} srcSet={`/images/${name}-640.webp 640w, /images/${name}-960.webp 960w, /images/${name}-1440.webp 1440w`} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1280px) 45vw, 560px" {...dimensions} alt={alt} loading={priority ? "eager" : "lazy"} fetchpriority={priority ? "high" : "auto"} decoding="async" />;
}
export function ClosingSection({ title, text, testId, image = false }) {
  return <section className={`closing-section site-container section-space ${image ? "closing-with-image" : ""}`}><Reveal className="closing-copy"><h2 className="section-title">{title}</h2><p className="section-intro">{text}</p><BookingLink testId={testId} /><p className="booking-detail">{BOOKING_DURATION} minutes to talk through your next step.</p></Reveal>{image && <EditorialImage name="studio" alt="Daylight across a worktable behind fluted glass" />}</section>;
}
export function PageHero({ eyebrow, title, text, image, imageAlt, children }) {
  return <section className={`page-hero site-container ${image ? "page-hero-with-image" : ""}`}><div className="hero-copy">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p className="hero-description">{text}</p>{children && <div className="hero-actions">{children}</div>}</div>{image && <EditorialImage name={image} alt={imageAlt} priority />}</section>;
}
