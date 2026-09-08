import { SITE_URL } from "./site.js";

export const PUBLIC_ROUTES = {
  "/": {
    title: "Ackra AI | AI Agents Built For Your Business",
    description: "Custom AI agents for the work that slows you down. Ackra AI builds and manages voice, text, and workflow automation for your business.",
  },
  "/services": {
    title: "Our Process | Ackra AI",
    description: "From the first conversation to a working AI agent. See how Ackra AI scopes, builds, tests, and maintains automation around your business.",
  },
  "/about": {
    title: "About | Ackra AI",
    description: "Meet Ackra AI, a New York studio building and managing custom AI agents for voice, text, reviews, and everyday business workflows.",
  },
  "/contact": {
    title: "Contact | Ackra AI",
    description: "Tell us which workflow is taking up your time, or book a 45-minute call to explore what an AI agent could do for your business.",
  },
  "/solutions/reduce-workload": {
    title: "Reduce Workload | Ackra AI",
    description: "Give repetitive work a new home. Custom AI agents handle inbox triage, follow-ups, and cross-tool updates so your team can focus.",
  },
  "/solutions/increase-conversion": {
    title: "Increase Conversion | Ackra AI",
    description: "Make more of every enquiry. AI agents respond, qualify, follow up, and help interested customers take the next step.",
  },
};

export const PAGE_PATHS = [...Object.keys(PUBLIC_ROUTES), "/admin"];

// Only normalize routes we own. Asset names and unknown paths remain exact.
export function canonicalPath(pathname) {
  const normalized = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  return PAGE_PATHS.includes(normalized) ? normalized : null;
}

export function getRouteMeta(pathname) {
  const path = canonicalPath(pathname);
  if (path && PUBLIC_ROUTES[path]) {
    return {
      ...PUBLIC_ROUTES[path],
      canonical: SITE_URL + (path === "/" ? "/" : path),
      robots: "index, follow, max-image-preview:large",
    };
  }
  return {
    title: path === "/admin" ? "Admin | Ackra AI" : "Page not found | Ackra AI",
    description: path === "/admin" ? "Private Ackra AI administration." : "This page could not be found. Explore Ackra AI or get in touch with our team.",
    canonical: path === "/admin" ? SITE_URL + path : null,
    robots: "noindex, nofollow",
  };
}
