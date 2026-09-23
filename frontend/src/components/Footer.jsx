import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { BOOKING_LABEL, BOOKING_URL, CONTACT_EMAIL, CONTACT_PHONE } from "../config/site";
import "./functional.css";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-intro">
          <Link to="/" className="brand-lockup" aria-label="Ackra home">
            <img src="/ackra-logo.svg" alt="" width="30" height="30" />
            <span>Ackra<span className="brand-period">.</span></span>
          </Link>
          <p>AI systems, websites, and apps.<br />Built around your business.</p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" data-testid="footer-book" className="footer-book-link">
            {BOOKING_LABEL}<ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-contact">
          <h2>Contact</h2>
          <a href={`mailto:${CONTACT_EMAIL}`} data-testid="footer-email">{CONTACT_EMAIL}</a>
          <a href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`} data-testid="footer-phone">{CONTACT_PHONE}</a>
          <p>New York City</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <h2>Explore</h2>
          <div>
            <Link to="/" data-testid="footer-link-home">Home</Link>
            <Link to="/website-app-design" data-testid="footer-link-design">Website &amp; app design</Link>
            <Link to="/services" data-testid="footer-link-services">Process</Link>
            <Link to="/about" data-testid="footer-link-about">About</Link>
            <Link to="/contact" data-testid="footer-link-contact">Contact</Link>
            <Link to="/solutions/reduce-workload">Reduce workload</Link>
            <Link to="/solutions/increase-conversion">Increase conversion</Link>
          </div>
        </nav>
      </div>
      <div className="site-container footer-bottom"><p>© {new Date().getFullYear()} Ackra AI</p></div>
    </footer>
  );
}
