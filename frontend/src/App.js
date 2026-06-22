import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import "./App.css";

// Route-level code splitting: heavy pages (three.js on Home) load on demand.
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const SolutionReduceWorkload = lazy(() => import("./pages/SolutionReduceWorkload"));
const SolutionIncreaseConversion = lazy(() => import("./pages/SolutionIncreaseConversion"));
const NotFound = lazy(() => import("./pages/NotFound"));

const SITE = "Ackra AI";
const DEFAULT_DESC =
  "Ackra AI builds and manages custom AI agents for voice, text, reviews, and workflow automation. Live in 3 weeks. Based in New York City.";

const ROUTE_META = {
  "/": {
    title: "Ackra AI | AI Agents Built For Your Business",
    description: DEFAULT_DESC,
  },
  "/services": {
    title: "Process | Ackra AI",
    description:
      "How Ackra AI scopes, builds, and ships a custom AI agent in about three weeks, from first call to live automation.",
  },
  "/about": {
    title: "About | Ackra AI",
    description:
      "Ackra AI is a New York studio building and managing custom AI agents for voice, text, reviews, and workflow automation.",
  },
  "/contact": {
    title: "Contact | Ackra AI",
    description:
      "Tell us the workflow that costs you the most time. We reply within one business hour with a sample agent spec.",
  },
  "/solutions/reduce-workload": {
    title: "Reduce Workload | Ackra AI",
    description:
      "AI agents that take inbox triage, cross-tool sync, and follow-ups off your team's plate so you can close the laptop.",
  },
  "/solutions/increase-conversion": {
    title: "Increase Conversion | Ackra AI",
    description:
      "AI agents that reply in seconds, qualify leads, and follow up relentlessly so more conversations become booked calls.",
  },
};

function upsertMeta(name, value, attr) {
  if (!value) return;
  const key = attr || "name";
  let el = document.head.querySelector(`meta[${key}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function RouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = ROUTE_META[pathname];
    const title = meta ? meta.title : `Page not found | ${SITE}`;
    const description = meta ? meta.description : DEFAULT_DESC;
    document.title = title;
    upsertMeta("description", description);
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute(
        "href",
        "https://ackra.ai" + (pathname === "/" ? "" : pathname)
      );
    }
  }, [pathname]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell grain" data-testid="app-shell">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] bg-white text-black px-4 py-2 mono text-[11px] tracking-mono uppercase"
        >
          Skip to content
        </a>
        <ScrollToTop />
        <RouteMeta />
        <Navigation />
        <main
          id="main"
          className="relative z-10"
          style={{ scrollMarginTop: "4rem" }}
        >
          <Suspense fallback={<div className="min-h-screen bg-ink" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/solutions/reduce-workload"
                element={<SolutionReduceWorkload />}
              />
              <Route
                path="/solutions/increase-conversion"
                element={<SolutionIncreaseConversion />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
