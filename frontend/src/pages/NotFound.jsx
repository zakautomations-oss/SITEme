import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return <section data-testid="page-not-found" className="site-container not-found">
    <p className="body-note">Error 404</p>
    <h1 className="section-title">This page couldn’t be found.</h1>
    <p className="section-intro">The link may have changed or been mistyped. Head back home or let us know what you were looking for.</p>
    <div className="hero-actions"><Link to="/" data-testid="notfound-home" className="button"><ArrowLeft size={17} aria-hidden="true" />Back to home</Link><Link to="/contact" data-testid="notfound-contact" className="button button-secondary">Contact<ArrowRight size={17} aria-hidden="true" /></Link></div>
  </section>;
}
