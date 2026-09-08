import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Menu, Monitor, Moon, Sun, X } from "lucide-react";
import { BOOKING_LABEL, BOOKING_URL } from "../config/site";
import "./functional.css";

const SOLUTIONS = [
  { to: "/solutions/reduce-workload", label: "Reduce workload" },
  { to: "/solutions/increase-conversion", label: "Increase conversion" },
];
const LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Process" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];
const THEMES = ["system", "light", "dark"];

function readThemePreference() {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem("ackra-theme");
    return THEMES.includes(stored) ? stored : "system";
  } catch { return "system"; }
}

export function ThemeToggle() {
  const [preference, setPreference] = useState(null);
  useEffect(() => { setPreference(readThemePreference()); }, []);
  useEffect(() => {
    if (!preference) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const theme = preference === "system" ? (media.matches ? "dark" : "light") : preference;
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.themePreference = preference;
      window.dispatchEvent(new CustomEvent("ackra-theme-change", { detail: { preference, theme } }));
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [preference]);
  const current = preference || "system";
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
  const Icon = current === "system" ? Monitor : current === "light" ? Sun : Moon;
  return (
    <button
      type="button" className="theme-toggle" data-testid="theme-toggle"
      aria-label={`Theme: ${current}. Switch to ${next} theme`}
      title={`Theme: ${current}. Switch to ${next}`}
      onClick={() => {
        try { localStorage.setItem("ackra-theme", next); } catch { /* Theme works without storage. */ }
        setPreference(next);
      }}
    >
      <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
    </button>
  );
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false);
  const headerRef = useRef(null);
  const mobileRef = useRef(null);
  const menuButtonRef = useRef(null);
  const solRef = useRef(null);
  const solButtonRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); setSolOpen(false); }, [pathname]);
  useEffect(() => {
    const onPointer = (event) => {
      if (!solRef.current?.contains(event.target)) setSolOpen(false);
      if (!headerRef.current?.contains(event.target)) setOpen(false);
    };
    const onEscape = (event) => {
      if (event.key !== "Escape") return;
      if (open) { setOpen(false); menuButtonRef.current?.focus(); }
      else if (solOpen) { setSolOpen(false); solButtonRef.current?.focus(); }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, solOpen]);
  useEffect(() => { if (open) mobileRef.current?.querySelector("a")?.focus(); }, [open]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reset = () => { setOpen(false); setSolOpen(false); };
    desktop.addEventListener("change", reset);
    return () => desktop.removeEventListener("change", reset);
  }, []);

  return (
    <header ref={headerRef} data-testid="site-nav" className="site-header"
      onBlur={(event) => {
        if (open && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <div className="site-container header-inner">
        <Link to="/" data-testid="nav-logo" className="brand-lockup" aria-label="Ackra home">
          <img src="/ackra-logo.svg" alt="" width="30" height="30" />
          <span>Ackra<span className="brand-period">.</span></span>
        </Link>
        <nav className="desktop-navigation" aria-label="Main navigation">
          <NavItem link={LINKS[0]} />
          <div className="solutions-disclosure" ref={solRef}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSolOpen(false); }}>
            <button type="button" ref={solButtonRef} onClick={() => setSolOpen((value) => !value)}
              data-testid="nav-solutions-toggle" aria-expanded={solOpen} aria-controls="solutions-navigation"
              className={`nav-link solutions-toggle ${pathname.startsWith("/solutions") ? "is-active" : ""}`}>
              Solutions <ChevronDown size={14} strokeWidth={1.6} aria-hidden="true" />
            </button>
            {solOpen && (
              <div id="solutions-navigation" data-testid="nav-solutions-menu" className="solutions-menu">
                {SOLUTIONS.map((solution) => (
                  <Link key={solution.to} to={solution.to} data-testid={`nav-solutions-${solution.to.split("/").pop()}`}>
                    {solution.label}<ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {LINKS.slice(1).map((link) => <NavItem key={link.to} link={link} />)}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" data-testid="nav-cta-book" className="button header-book">
            {BOOKING_LABEL}<ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </a>
          <button type="button" ref={menuButtonRef} data-testid="nav-mobile-toggle"
            onClick={() => setOpen((value) => !value)} className="mobile-menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"} aria-controls="mobile-navigation" aria-expanded={open}>
            {open ? <X size={23} strokeWidth={1.6} aria-hidden="true" /> : <Menu size={23} strokeWidth={1.6} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav ref={mobileRef} id="mobile-navigation" aria-label="Mobile navigation" data-testid="nav-mobile-panel" className="mobile-navigation">
          <div className="site-container mobile-navigation-inner">
            <div className="mobile-primary-links">
              {LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === "/"} data-testid={`nav-mobile-link-${link.label.toLowerCase()}`} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="mobile-solutions">
              <p>Solutions</p>
              {SOLUTIONS.map((solution) => (
                <NavLink key={solution.to} to={solution.to} data-testid={`nav-mobile-solutions-${solution.to.split("/").pop()}`} onClick={() => setOpen(false)}>
                  {solution.label}
                </NavLink>
              ))}
            </div>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" data-testid="nav-mobile-cta-book" className="button">
              {BOOKING_LABEL}<ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function NavItem({ link }) {
  return <NavLink to={link.to} end={link.to === "/"} data-testid={`nav-link-${link.label.toLowerCase()}`} className={({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`}>{link.label}</NavLink>;
}
