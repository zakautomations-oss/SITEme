import { SITE_URL } from "./site.js";

export const PUBLIC_ROUTES = {
  "/": {
    title: "AI for Jewelry Businesses | Ackra AI",
    description: "Custom AI for jewelry stores, brands, and online jewelers. Handle product enquiries, consultation bookings, order updates, and follow-ups with Ackra.",
  },
  "/website-app-design": {
    title: "Website & App Development | Design & Build by Ackra AI",
    description: "Websites and apps, from your first idea to launch. One Ackra team handles planning, design, development, testing, and launch.",
  },
  "/services": {
    title: "Our Process | Ackra AI",
    description: "See how Ackra plans, builds, and supports AI for your jewelry business, from understanding your enquiries and orders to testing with your team.",
  },
  "/about": {
    title: "About | Ackra AI",
    description: "Ackra builds and manages AI for jewelry businesses, helping teams handle customer enquiries, appointments, and the work behind each sale.",
  },
  "/contact": {
    title: "Contact | Ackra AI",
    description: "Discuss AI for your jewelry business, or a website or app for any industry. Book a 45-minute call with Ackra to talk through your goals.",
  },
  "/solutions/reduce-workload": {
    title: "Reduce Jewelry Business Admin | Ackra AI",
    description: "Reduce routine admin in your jewelry business. Connect customer records, order updates, repair enquiries, and follow-ups with custom AI from Ackra.",
  },
  "/solutions/increase-conversion": {
    title: "Customer Enquiries & Bookings for Jewelers | Ackra AI",
    description: "Help jewelry customers ask about pieces, book consultations, and follow up on quotes. AI handles routine conversations with your team’s support.",
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
