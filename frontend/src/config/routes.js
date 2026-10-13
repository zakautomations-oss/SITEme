import { SITE_URL } from "./site.js";

export const PUBLIC_ROUTES = {
  "/": {
    title: "Ackra AI | Custom AI Systems for Your Business",
    description: "AI that handles repetitive tasks, keeps your business tools up to date, and helps customers get answers. Built and managed by Ackra.",
  },
  "/website-app-design": {
    title: "Website & App Development | Design & Build by Ackra AI",
    description: "Websites and apps, from your first idea to launch. One Ackra team handles planning, design, development, testing, and launch.",
  },
  "/services": {
    title: "Our Process | Ackra AI",
    description: "From the first conversation to a working AI system. See how Ackra plans, builds, tests, and supports AI for your business.",
  },
  "/about": {
    title: "About | Ackra AI",
    description: "Meet Ackra AI, a New York studio building AI to handle routine tasks, connect business tools, and help customers get answers.",
  },
  "/contact": {
    title: "Contact | Ackra AI",
    description: "Tell us about your website, app, or AI system. Book a 45-minute call with Ackra to discuss your goals and the right approach for your business.",
  },
  "/solutions/reduce-workload": {
    title: "Reduce Workload | Ackra AI",
    description: "Spend less time on repetitive admin. AI sorts messages, follows up with customers, and updates your business tools so your team can focus.",
  },
  "/solutions/increase-conversion": {
    title: "Win More Customers | Ackra AI",
    description: "Answer enquiries, understand what customers need, and help them book an appointment. AI handles calls, texts, and web chats with your team’s support.",
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
