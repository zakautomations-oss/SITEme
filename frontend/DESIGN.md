# Ackra visual system

Ackra builds custom AI systems for businesses, including connected workflows and customer-facing agents. The design keeps the existing logo, violet identity, navigation names, routes, and contact fields. It uses a calm editorial layout, direct language, and practical workflow explanations.

## Foundations

- Geist for body text and controls; Cabinet Grotesk for headings. Both fonts are self-hosted variable WOFF2 files, with their licenses in `public/fonts`.
- Semantic light and dark colors live in `src/index.css`. Components use surface, text, muted, accent, line, error, and success tokens. Control borders are independently calibrated for contrast in `functional.css`.
- Corners are 4px. Content is capped at 1240px. Mobile side margins are 20px, falling to 16px at the smallest breakpoint.
- Page content uses layer 10, the header and its menus layer 40, and the skip link layer 100. The fixed header is 72px high.
- Home uses GSAP word emphasis and a pinned process introduction on desktop viewports at least 1024px wide and 700px tall. Both word colors retain readable contrast in either theme. The motion bundle loads only when those dimensions and the no-reduced-motion preference match. All triggers and observers revert on route exit or media changes. The integration marquee has an explicit pause control and a static reduced-motion fallback. Content remains visible before JavaScript loads.

## Content and interactions

Keep claims specific and verifiable. Do not add fabricated clients, outcomes, testimonials, team biographies, or business statistics. The integration logos describe the tools that workflows can connect with; they are not customer endorsements.

Use “Book a call” for booking actions. `src/config/site.js` owns the booking URL and 45-minute duration as well as public contact details. Public route names and metadata live in `src/config/routes.js`.

Forms need visible labels, keyboard focus, preserved drafts on error, and an announced success or error state. Navigation must remain usable in narrow and short viewports. The theme preference cycles system, light, and dark and is persisted locally.

The homepage's interactive A follows the two open legs in `public/ackra-logo.svg`. `AckraMark` projects that geometry into inline SVG, with silver material in dark mode and charcoal in light mode. The mark stays solid. Pointer movement across the hero adds a small tilt, and horizontal dragging turns the mark. Clicking, Enter, and the arrow keys cycle views; Escape restores the opening view. A small rotation icon is the only visible hint. Full instructions remain available to screen readers. Vertical touch scrolling remains available. Reduced motion disables hover and drag animation, while explicit view changes happen immediately. The animation frame loop stops when the mark settles, and animation frames and pointer listeners clean up on unmount. There is no idle rotation or external rendering dependency. Its initial artwork is prerendered.

## Images and licenses

The computational lattice, workflow tabletop, and studio images in `public/images` were generated for this redesign in September 2026. They are editorial illustrations, not photos of Ackra products, employees, clients, or offices. Each has 640px, 960px, and 1440px WebP variants; the computational lattice also has an 800px variant for smaller screens. Keep descriptive alt text and responsive sizes when reusing them.

The branded A is the primary homepage artwork; the computational image remains on the conversion solution page. Avoid telephone-led hero imagery: voice agents are one capability within Ackra's wider systems and automation offering. AI Elements was evaluated for the interactive mark, but its Persona component exposes fixed Rive variants rather than custom logo geometry. The homepage therefore uses a small custom component instead of adding that runtime.

HubSpot, Notion, Stripe, Zapier, and Google Sheets symbols were sourced from the official Simple Icons CDN (`cdn.simpleicons.org`) and remain their owners’ trademarks. Existing Ackra logo assets are preserved.

## Verification

Run the component, API, production build, and HTTP checks documented in `README.md`. Browser-check key interactions at desktop and mobile widths, both themes, and a short landscape viewport. Lighthouse is a useful diagnostic; scores vary by device, network, and third-party booking content.

## Homepage composition

The editorial split uses a two-line headline, the dimensional Ackra A, and exactly two hero actions. Five horizontal native disclosure panels become stacked disclosures below 1024px. Custom agents follows Review follow-ups and explains bespoke agents using company knowledge and tools with human handoffs. The expanded panel receives extra width so the five-column desktop layout keeps readable labels. The outcome grid contains two full cells, with dense placement and a single-column mobile layout. The closing invitation uses one small editorial image within its heading. Section spacing varies from 72px on phones to 120px on desktop. No decorative badges, arbitrary metrics, invented customers, or stock testimonial content are used.

All CSS is emitted in the initial stylesheet so prerendered pages do not shift when a lazy route hydrates. Native disclosures remain usable without JavaScript. Cabinet Grotesk is the original, unmodified Fontshare variable WOFF2 under FFL 2.0; its license and provenance are stored alongside the font.
