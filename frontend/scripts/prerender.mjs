import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { render, renderAppStudy, renderWebsiteStudy } from "../.prerender/entry-server.js";
import { PAGE_PATHS, PUBLIC_ROUTES, getRouteMeta } from "../src/config/routes.js";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE_HREF } from "../src/config/site.js";

const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const template = await readFile(resolve("dist/index.html"), "utf8");
if (!template.includes("<!--app-head-->") || !template.includes("<!--app-html-->")) {
  throw new Error("The static HTML template is missing its head or body marker.");
}

function renderHead(pathname) {
  const meta = getRouteMeta(pathname);
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_URL + "/ackra-logo.svg",
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_HREF.replace("tel:", ""),
    address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
  };
  return [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<meta name="robots" content="${escape(meta.robots)}" />`,
    `<meta name="googlebot" content="${escape(meta.robots)}" />`,
    meta.canonical ? `<link rel="canonical" href="${escape(meta.canonical)}" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escape(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    meta.canonical ? `<meta property="og:url" content="${escape(meta.canonical)}" />` : "",
    `<meta property="og:image" content="${SITE_URL}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Ackra AI — AI Agents Built For Your Business" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${SITE_URL}/og-image.png" />`,
    PUBLIC_ROUTES[pathname] ? `<script type="application/ld+json">${JSON.stringify(organization).replace(/</g, "\\u003c")}</script>` : "",
  ].filter(Boolean).join("\n    ");
}

for (const pathname of [...PAGE_PATHS, "/404"]) {
  const appHtml = await render(pathname);
  const html = template.replace("<!--app-head-->", renderHead(pathname)).replace("<!--app-html-->", appHtml).replace('<div id="root">', '<div id="root" data-prerendered="true">');
  const filename = pathname === "/" ? "index.html" : `${pathname.slice(1)}.html`;
  const destination = resolve("dist", filename);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
  console.log(`Prerendered ${pathname}`);
}

const urls = Object.keys(PUBLIC_ROUTES).map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join("\n");

// Full studies use the same native previews as the site, without a JS bundle.
await mkdir(resolve("dist/studies"), { recursive: true });
for (const study of [
  { id: "app", title: "App", component: "AppDesignPreview", render: renderAppStudy },
  { id: "website", title: "Website", component: "WebsiteDesignPreview", render: renderWebsiteStudy },
]) {
  const studyCss = await readFile(resolve(`src/components/${study.component}.css`), "utf8");
  await writeFile(resolve(`dist/studies/alder-rowe-${study.id}.html`), `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Alder / Rowe — ${study.title} design concept by Ackra</title><meta name="robots" content="noindex, follow" />
<style>
@font-face{font-family:Geist;font-style:normal;font-weight:400 700;font-display:swap;src:url("/fonts/geist-latin.woff2") format("woff2")}
*{box-sizing:border-box}body{margin:0;background:#e9edf0;color:#161a20;font-family:Geist,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.study-header{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:28px 4vw;max-width:1680px;margin:auto}
.study-header h1{font-size:22px;font-weight:500;margin:0;letter-spacing:-.03em}.study-header p{font-size:12px;color:#59606a;margin:5px 0 0}
.study-header a{color:inherit;font-size:13px;text-underline-offset:4px}.study-header a:focus-visible{outline:2px solid #1251ce;outline-offset:5px}
.study-main{max-width:1680px;margin:0 auto;padding:0 2vw 32px}
@media(max-width:599px){.study-header{align-items:flex-start;padding:22px 20px;gap:16px}.study-header h1{font-size:19px}.study-header a{max-width:100px;line-height:1.5}.study-main{padding:0 12px 24px}}
${studyCss}
</style></head><body><header class="study-header"><div><h1>Alder / Rowe</h1><p>Concept study · Fictional practice</p></div><a href="/website-app-design">Back to design &amp; build</a></header><main class="study-main">${study.render()}</main></body></html>`);
  console.log(`Prerendered /studies/alder-rowe-${study.id}.html`);
}

await writeFile(resolve("dist/sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await writeFile(resolve("dist/robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
