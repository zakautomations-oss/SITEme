import { SITE_URL } from "./site.js";

export const PUBLIC_ROUTES = {
  "/": {
    title: "Ackra AI | Custom AI Systems for Your Business",
    description: "Custom AI systems that connect your tools, automate complex workflows, and support your team. Built and managed by Ackra.",
  },
  "/website-app-design": {
    title: "Website & App Development | Design & Build by Ackra AI",
    description: "Websites and apps, designed and built end to end. Ackra handles strategy, design, development, integrations, testing, and launch with one team.",
  },
  "/services": {
    title: "Our Process | Ackra AI",
    description: "From the first conversation to a working AI agent. See how Ackra AI scopes, builds, tests, and maintains automation around your business.",
  },
  "/about": {
    title: "About | Ackra AI",
    description: "Meet Ackra AI, a New York studio building custom AI systems, connected workflows, and agents around the way your business works.",
  },
  "/contact": {
    title: "Contact | Ackra AI",
    description: "Tell us about your website, app, or AI system. Book a 45-minute call with Ackra to discuss your goals and the right approach for your business.",
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
