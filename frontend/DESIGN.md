# Ackra visual system

Ackra builds and manages custom AI for jewelry stores, showrooms, brands, and online jewelers. The website and app development offering remains open to all industries. The design keeps the existing logo, violet identity, routes, and contact fields, with a calm editorial layout and direct language about customer enquiries, appointments, orders, and routine admin.

## Foundations

- Geist for body text and controls; Cabinet Grotesk for headings. Both fonts are self-hosted variable WOFF2 files, with their licenses in `public/fonts`.
- Semantic light and dark colors live in `src/index.css`. Components use surface, text, muted, accent, line, error, and success tokens. Control borders are independently calibrated for contrast in `functional.css`.
- Corners are 4px. Content is capped at 1240px. Mobile side margins are 20px, falling to 16px at the smallest breakpoint.
- Page content uses layer 10, the header and its menus layer 40, the delayed navigation progress line layer 60, and the skip link layer 100. The fixed header is 72px high.
- Home uses GSAP word emphasis and a pinned process introduction on desktop viewports at least 1024px wide and 700px tall. Both word colors retain readable contrast in either theme. The motion bundle loads only when those dimensions and the no-reduced-motion preference match. All triggers and observers revert on route exit or media changes. The integration marquee has an explicit pause control and a static reduced-motion fallback. Content remains visible before JavaScript loads.

## Content and interactions

Keep claims specific and verifiable. Do not add fabricated clients, outcomes, testimonials, team biographies, or business statistics. The integration logos describe the tools that workflows can connect with; they are not customer endorsements.

Use “Book a call” for global booking actions. The website and app development page uses “Discuss your project” for its contextual booking invitation. `src/config/site.js` owns the booking URL and 45-minute duration as well as public contact details. Public route names and metadata live in `src/config/routes.js`.

Forms need visible labels, keyboard focus, preserved drafts on error, and an announced success or error state. Navigation must remain usable in narrow and short viewports. The theme toggle switches directly between light and dark and persists the choice locally. New visitors and legacy system preferences start in light mode regardless of device appearance, including before JavaScript loads. Existing saved light or dark choices are restored; there is no system option or computer icon.

The header and page shell persist across routes. Ordinary public-page links use native View Transitions where available: a short content crossfade with a steady header. Hover and keyboard focus prefetch only page code. Slow destinations retain readable outgoing content and show a delayed, indeterminate progress line with an accessible loading status. The snapshot hold ends after 650ms even if loading continues; focus and scroll move after the destination commits. Modified clicks, downloads, external links, and hashes retain their normal behavior. Reduced motion bypasses the crossfade and uses a static loading cue.

Initial page entrances use a small vertical movement for the heading, followed by copy, actions, and artwork. Headings stay opaque for readable first paint. Menus use a shorter version of the same entrance. All entrance effects are disabled with reduced motion; no page content depends on animation or JavaScript to become readable.

The homepage's interactive A follows the two open legs in `public/ackra-logo.svg`. `AckraMark` projects that geometry into inline SVG, with silver material in dark mode and charcoal in light mode. The solid mark sits directly on the page without a background panel. Pointer movement across the hero adds a responsive tilt, and mouse dragging turns it in either direction. A transparent hit area extends 12px beyond the artwork stage, or 10px on mobile. Touch dragging starts horizontally so vertical page scrolling remains available. The wider drag range settles into the chosen orientation, which becomes the baseline for subsequent pointer movement. Clicking, Enter, and the arrow keys cycle views; Escape restores the opening view. A small rotation icon is the only visible hint. Full instructions remain available to screen readers. Vertical touch scrolling remains available. Reduced motion disables hover and drag animation, while explicit view changes happen immediately. The animation frame loop stops when the mark settles, and animation frames and pointer listeners clean up on unmount. There is no idle rotation or external rendering dependency. Its initial artwork is prerendered.

## Images and licenses

The quiet lake, computational lattice, workflow tabletop, and studio images in `public/images` were generated for this redesign in September 2026. They are editorial illustrations, not photos of Ackra products, employees, clients, or offices. Each has 640px, 960px, and 1440px WebP variants; the computational lattice also has an 800px variant for smaller screens. Keep descriptive alt text and responsive sizes.

The jewelry workbench appears in the homepage capability panel, the jewelry packing desk in the Reduce workload hero, and the showroom consultation scene in the customer-enquiry solution hero. These original images were generated in October 2026 and exported as responsive 640px, 960px, and 1440px JPEGs. They are illustrative scenes, not Ackra client work, customer stores, or products for sale. The studio image remains a small accent in the homepage closing invitation. About and Process use typography-led openings; secondary invitations are text-led. The previous tabletop, computational lattice, and lake assets are retained but no longer used on these pages.

The branded A remains the primary homepage artwork, supported by jewelry imagery further down the page. Avoid telephone-led hero imagery: voice agents are one capability within Ackra's wider systems and automation offering. AI Elements was evaluated for the interactive mark, but its Persona component exposes fixed Rive variants rather than custom logo geometry. The homepage therefore uses a small custom component instead of adding that runtime.

HubSpot, Notion, Stripe, Zapier, and Google Sheets symbols were sourced from the official Simple Icons CDN (`cdn.simpleicons.org`) and remain their owners’ trademarks. Existing Ackra logo assets are preserved.

## Verification

Run the component, API, production build, and HTTP checks documented in `README.md`. Browser-check key interactions at desktop and mobile widths, both themes, and a short landscape viewport. Lighthouse is a useful diagnostic; scores vary by device, network, and third-party booking content.

## Homepage composition

The editorial split uses a two-line headline, the dimensional Ackra A, and exactly two hero actions. Three horizontal native disclosure panels become stacked disclosures below 1024px: Business automation, Customer conversations, and Custom projects. Business automation explains customer records, order details, and repair updates. Customer conversations covers product questions, consultations, and enquiry follow-ups. Custom projects describes custom orders, repairs, and trade enquiries using the business’s information and tools. Each explanation makes clear when the team takes over. The expanded panel receives extra width to keep desktop labels and content readable. The outcome grid contains two full cells, with dense placement and a single-column mobile layout. The closing invitation uses one small editorial image within its heading. Section spacing varies from 72px on phones to 120px on desktop. No decorative badges, arbitrary metrics, invented customers, or stock testimonial content are used.

Capability switching expands the desktop panel over 440ms and brings in its content after 160ms. Content keeps its final line width during expansion, avoiding compressed text reflow. The desktop panel has a shared 520px minimum height while open, and still grows for content. Mobile reveals use a short 220ms entrance. Only deliberate changes animate; initial disclosure content remains visible, closed content remains inaccessible, and reduced-motion changes are immediate.

All CSS is emitted in the initial stylesheet so prerendered pages do not shift when a lazy route hydrates. Native disclosures remain usable without JavaScript. Cabinet Grotesk is the original, unmodified Fontshare variable WOFF2 under FFL 2.0; its license and provenance are stored alongside the font.

## Website and app development

The homepage introduces the development offering after the AI capabilities and before the outcome panels. The offering remains accessible through the homepage feature and footer link to `/website-app-design`; there is no separate desktop or mobile header tab. Its copy, design studies, and metadata stay general, covering websites, apps, and execution from strategy through launch. Service labels use “Website & app development” and the page explains planning, design, development, connected tools, testing, and launch in plain business language. The existing URL stays stable. Contact welcomes these enquiries without changing its fields or submission contract. Engagement pricing remains private.

The Alder / Rowe study is an original, illustrative website and client-portal concept for a fictional architecture practice. It is explicitly labeled as a concept, never presented as client work or a shipped application. Both previews use native HTML text and SVG icons at their displayed size, never screenshots of interface text or CSS-scaled miniatures. The website preserves its editorial headline, project details, and courtyard photography with a responsive mobile composition. Desktop app views show three flat screens; mobile shows the Design review screen with readable type. Only the architectural and materials photographs are raster assets. Full studies are prerendered from the same components into /studies/alder-rowe-website.html and /studies/alder-rowe-app.html, with the same CSS and no JavaScript requirement; each carries a noindex directive.

The offering uses a restrained hierarchy: direct end-to-end headline, one study, concrete website/application scope, four delivery stages, and a project invitation. No ornamental counters, static link arrows, decorative grids, or repeated slogan sections. Design dials: variance 4, motion 2, density 4. The surrounding interface preserves Ackra typography, light/dark tokens, 4px geometry, routes, and existing AI service content. The concept's own visual identity uses neutral surfaces and a small cobalt functional accent.

Website and App tabs support pointer input, arrow keys, Home and End, with unique IDs and linked panels. The previews are illustrative. Each preview exposes one descriptive image role; its decorative interface has no focusable or simulated functional controls. The actual tabs and full-study links are functional. Reduced motion disables control transitions.

Both previews use app-courtyard.webp, and the app also uses app-materials.webp: original 1536 x 1024 photographs generated with the built-in image-generation tool in October 2026 for this fictional concept. The website and app interfaces themselves are native rendering rather than generated image text. WebsiteDesignPreview and AppDesignPreview are shared by the homepage, dedicated design page, and full studies so none falls back to the superseded raster screenshots. The general website and app studies keep their existing imagery; the jewelry focus applies to the AI offering.

## Public copy

Keep the tone professional and concrete. Position AI around jewelry businesses through familiar tasks before introducing technical terms. Describe product availability and order/repair status as answers from the business’s records; recommendations, pricing decisions, and complex requests remain with the jewelry team. Do not invent specialist integrations, clients, or results. Use “How it works” for the process page and “Win more customers” for the enquiry solution, retaining the existing URLs. Preserve the design-page brand line: “Built for revenue, looks, and something never seen before.”

The shared social image is `public/ackra-social-neutral.png`, a neutral Ackra wordmark card. Route titles and descriptions supply the jewelry or general-development context. It replaces the old card containing a launch-time claim. The generation prompts and source dimensions are recorded in `public/images/jewelry-image-provenance.json`.
