import React from "react";
import { Link } from "react-router-dom";

const LOGO = "/ackra-logo.svg";

const CALENDLY = "https://calendly.com/evoskin9/ak-automations-meeting-s";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="rule-top relative bg-ink">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-16 grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 md:col-span-6">
          <p className="mono text-[10px] tracking-mono uppercase text-white/40">
            01 / Booking
          </p>
          <h3 className="font-serif text-3xl md:text-5xl tracking-tightest leading-[0.95] mt-3 max-w-md">
            Book a 30-minute scoping call.
          </h3>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-book"
            className="mt-6 inline-flex items-center gap-2 mono text-[12px] tracking-mono uppercase text-periwinkle hover:text-white transition"
          >
            calendly.com/evoskin9 ↗
          </a>
        </div>

        <div className="col-span-6 md:col-span-3 rule-top md:rule-top-0 pt-6 md:pt-0">
          <p className="mono text-[10px] tracking-mono uppercase text-white/40">
            02 / Direct
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href="mailto:ackra@ackraai.com"
                data-testid="footer-email"
                className="text-white/80 hover:text-white transition text-[14px]"
              >
                ackra@ackraai.com
              </a>
            </li>
            <li>
              <a
                href="tel:+16469442162"
                data-testid="footer-phone"
                className="text-white/80 hover:text-white transition text-[14px]"
              >
                +1 (646) 944 2162
              </a>
            </li>
            <li className="text-white/40 text-[14px]">New York City</li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-3 rule-top md:rule-top-0 pt-6 md:pt-0">
          <p className="mono text-[10px] tracking-mono uppercase text-white/40">
            03 / Index
          </p>
          <ul className="mt-3 space-y-2 text-[14px]">
            <li><Link to="/" data-testid="footer-link-home" className="text-white/80 hover:text-white transition">Home</Link></li>
            <li><Link to="/services" data-testid="footer-link-services" className="text-white/80 hover:text-white transition">Process</Link></li>
            <li><Link to="/solutions/reduce-workload" className="text-white/80 hover:text-white transition">Reduce workload</Link></li>
            <li><Link to="/solutions/increase-conversion" className="text-white/80 hover:text-white transition">Increase conversion</Link></li>
            <li><Link to="/about" data-testid="footer-link-about" className="text-white/80 hover:text-white transition">About</Link></li>
            <li><Link to="/contact" data-testid="footer-link-contact" className="text-white/80 hover:text-white transition">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="rule-top">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mono text-[10px] tracking-mono uppercase text-white/40">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" className="h-5 w-5" />
            <span>Ackra © {new Date().getFullYear()}</span>
          </div>
          <p>v1.2 / built in nyc</p>
        </div>
      </div>
    </footer>
  );
}
