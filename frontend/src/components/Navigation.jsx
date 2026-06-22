import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const LOGO = "/ackra-logo.svg";

const CALENDLY = "https://calendly.com/evoskin9/ak-automations-meeting-s";

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

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false);
  const solRef = useRef(null);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
    setSolOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (solRef.current && !solRef.current.contains(e.target)) setSolOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const inSolutions = loc.pathname.startsWith("/solutions");

  return (
    <header
      data-testid="site-nav"
      className="fixed top-0 left-0 right-0 z-50 bg-[#05050A]/80 backdrop-blur-xl"
      style={{ borderBottom: "1px solid var(--rule)" }}
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 h-14 md:h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5">
          <img src={LOGO} alt="" className="h-7 w-7 object-cover" />
          <span className="font-serif text-white text-[15px] tracking-tightest leading-none mt-0.5">
            Ackra<span className="text-periwinkle">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13px]">
          {LINKS.slice(0, 1).map((l) => (
            <NavItem key={l.to} link={l} />
          ))}

          <div ref={solRef} className="relative">
            <button
              onClick={() => setSolOpen((s) => !s)}
              data-testid="nav-solutions-toggle"
              aria-haspopup="true"
              aria-expanded={solOpen}
              className={`inline-flex items-center gap-1.5 transition-colors ${
                inSolutions ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              Solutions
              <span className="mono text-[10px] mt-px opacity-70">{solOpen ? "−" : "+"}</span>
            </button>
            {solOpen && (
              <div
                data-testid="nav-solutions-menu"
                className="absolute top-full mt-3 left-0 w-[300px] bg-[#05050A] backdrop-blur-xl"
                style={{ border: "1px solid var(--rule-hard)" }}
              >
                {SOLUTIONS.map((s, i) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    data-testid={`nav-solutions-${s.to.split("/").pop()}`}
                    className="block px-5 py-4 hover:bg-white/[0.04] transition"
                    style={{ borderTop: i === 0 ? "none" : "1px solid var(--rule)" }}
                  >
                    <span className="mono text-[10px] text-white/40">0{i + 1}</span>
                    <p className="mt-1 text-white text-[14px]">{s.label}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {LINKS.slice(1).map((l) => (
            <NavItem key={l.to} link={l} />
          ))}
        </nav>

        <a
          href={CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="nav-cta-book"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-[12px] text-black bg-white hover:bg-periwinkle hover:text-black transition-colors mono tracking-mono uppercase"
        >
          Book a 30-min call
          <span aria-hidden>↗</span>
        </a>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden p-2 text-white mono text-xs"
          aria-label="Toggle menu"
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {open && (
        <div
          data-testid="nav-mobile-panel"
          className="md:hidden bg-[#05050A]"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          <div className="px-6 py-6 flex flex-col">
            {LINKS.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center justify-between py-4 text-base ${
                    isActive ? "text-white" : "text-white/60"
                  }`
                }
                style={{ borderBottom: i < LINKS.length - 1 ? "1px solid var(--rule)" : "none" }}
              >
                <span>{l.label}</span>
                <span className="mono text-[10px] text-white/30">0{i + 1}</span>
              </NavLink>
            ))}
            <p className="mt-6 mono text-[10px] tracking-mono text-white/30 uppercase">
              Solutions
            </p>
            {SOLUTIONS.map((s) => (
              <NavLink
                key={s.to}
                to={s.to}
                data-testid={`nav-mobile-solutions-${s.to.split("/").pop()}`}
                className={({ isActive }) =>
                  `py-3 text-[15px] ${isActive ? "text-white" : "text-white/55"}`
                }
              >
                {s.label}
              </NavLink>
            ))}
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-mobile-cta-book"
              className="mt-6 inline-flex items-center justify-center px-4 py-3 bg-white text-black mono text-xs tracking-mono uppercase"
            >
              Book a 30-min call ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ link }) {
  return (
    <NavLink
      to={link.to}
      end={link.to === "/"}
      data-testid={`nav-link-${link.label.toLowerCase()}`}
      className={({ isActive }) =>
        `transition-colors ${isActive ? "text-white" : "text-white/55 hover:text-white"}`
      }
    >
      {link.label}
    </NavLink>
  );
}
