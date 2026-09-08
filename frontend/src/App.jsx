import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { canonicalPath, getRouteMeta } from "./config/routes.js";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const SolutionReduceWorkload = lazy(() => import("./pages/SolutionReduceWorkload"));
const SolutionIncreaseConversion = lazy(() => import("./pages/SolutionIncreaseConversion"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingPage({ admin = false }) {
  return <div className="min-h-[65vh] px-6 pt-24" style={{ background: "var(--surface)", color: "var(--muted)" }} role="status">{admin ? "Loading admin access…" : "Loading page…"}</div>;
}

// No session storage, API requests, or private data enter the static build.
function AdminPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <Admin /> : <LoadingPage admin />;
}

function setMeta(name, content, attribute = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function RouteMeta() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const path = canonicalPath(pathname);
    if (path && path !== pathname) navigate(path + search + hash, { replace: true });
    const meta = getRouteMeta(pathname);
    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("og:title", meta.title, "property");
    setMeta("og:description", meta.description, "property");
    setMeta("og:url", meta.canonical, "property");
    setMeta("twitter:title", meta.title);
    setMeta("twitter:description", meta.description);
    setMeta("robots", meta.robots);
    setMeta("googlebot", meta.robots);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (meta.canonical) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = meta.canonical;
    } else {
      canonical?.remove();
    }
  }, [pathname, search, hash, navigate]);
  return null;
}

function RouteFocus({ previousPath }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const changed = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (hash) {
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      document.getElementById(id)?.scrollIntoView();
    } else if (changed) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  // Keep navigation history outside the error boundary, which remounts per page.
  const previousPath = useRef(pathname);
  return (
    <AppErrorBoundary key={pathname}>
        <div className="app-shell" data-testid="app-shell">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-white text-black px-4 py-2">Skip to content</a>
          <RouteMeta />
          <Navigation />
          <main id="main" tabIndex={-1} className="relative z-10 outline-none" style={{ scrollMarginTop: "6rem" }}>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/solutions/reduce-workload" element={<SolutionReduceWorkload />} />
                <Route path="/solutions/increase-conversion" element={<SolutionIncreaseConversion />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <RouteFocus previousPath={previousPath} />
            </Suspense>
          </main>
          <Footer />
        </div>
    </AppErrorBoundary>
  );
}
