# Ackra visual system

Ackra serves business owners who want useful, managed AI agents. The design keeps the existing logo, violet identity, navigation names, routes, and contact fields. It uses a calm editorial layout, direct language, and practical workflow explanations.

## Foundations

- Geist for body text and controls; Bricolage Grotesque for headings. Both fonts are self-hosted variable WOFF2 files, with their licenses in `public/fonts`.
- Semantic light and dark colors live in `src/index.css`. Components use surface, text, muted, accent, line, error, and success tokens. Control borders are independently calibrated for contrast in `functional.css`.
- Corners are 4px. Content is capped at 1240px. Mobile side margins are 20px, falling to 16px at the smallest breakpoint.
- Page content uses layer 10, the header and its menus layer 40, and the skip link layer 100. The fixed header is 72px high.
- Motion is limited to short entrance and hover transitions. Reduced-motion preference disables them. Content remains visible before JavaScript loads.

## Content and interactions

Keep claims specific and verifiable. Do not add fabricated clients, outcomes, testimonials, team biographies, or business statistics. The integration logos describe the tools that workflows can connect with; they are not customer endorsements.

Use “Book a call” for booking actions. `src/config/site.js` owns the booking URL and 45-minute duration as well as public contact details. Public route names and metadata live in `src/config/routes.js`.

Forms need visible labels, keyboard focus, preserved drafts on error, and an announced success or error state. Navigation must remain usable in narrow and short viewports. The theme preference cycles system, light, and dark and is persisted locally.

## Images and licenses

The handset, workflow tabletop, and studio images in `public/images` were generated for this redesign in September 2026. They are editorial illustrations of working environments, not photos of Ackra employees, clients, or offices. Each has 640px, 960px, and 1440px WebP variants. Keep descriptive alt text and responsive sizes when reusing them.

HubSpot, Notion, Stripe, Zapier, and Google Sheets symbols were sourced from the official Simple Icons CDN (`cdn.simpleicons.org`) and remain their owners’ trademarks. Existing Ackra logo assets are preserved.

## Verification

Run the component, API, production build, and HTTP checks documented in `README.md`. Browser-check key interactions at desktop and mobile widths, both themes, and a short landscape viewport. Lighthouse is a useful diagnostic; scores vary by device, network, and third-party booking content.
