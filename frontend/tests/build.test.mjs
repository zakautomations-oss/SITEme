import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { createPreviewServer } from "../scripts/preview.mjs";

let server;
let origin;
before(async () => {
  server = createPreviewServer({ directory: resolve("dist") });
  await new Promise((done, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", done);
  });
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(() => server?.listening ? new Promise((done) => server.close(done)) : undefined);

const paths = ["/", "/services", "/about", "/contact", "/solutions/reduce-workload", "/solutions/increase-conversion"];
for (const path of paths) {
  test(`initial HTML contains the complete public page and route metadata: ${path}`, async () => {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    assert.equal(document.querySelectorAll("main h1").length, 1);
    assert.ok(document.querySelector("main").textContent.trim().length > 200);
    assert.ok(!document.querySelector("main").textContent.includes("Loading page…"));
    assert.equal(document.querySelector('link[rel="canonical"]').href, "https://ackra.ai" + path);
    assert.equal(document.querySelector('meta[property="og:url"]').content, "https://ackra.ai" + path);
    assert.equal(document.querySelector('meta[property="og:title"]').content, document.title);
    assert.equal(document.querySelector('meta[name="twitter:title"]').content, document.title);
    assert.ok(!document.querySelector('meta[name="robots"]').content.includes("noindex"));
    assert.equal(document.querySelector("#root").dataset.prerendered, "true");
    assert.ok(!html.includes("<!--app-html-->"));
    dom.window.close();
  });
}

test("deep links preserve all four process steps", async () => {
  const dom = new JSDOM(await (await fetch(origin + "/services")).text());
  for (const id of ["step-01", "step-02", "step-03", "step-04"]) assert.ok(dom.window.document.getElementById(id), id);
  dom.window.close();
});

test("noncanonical paths redirect without losing query parameters", async () => {
  for (const path of ["/services/", "/Services", "/SERVICES/", "/services.html", "/Solutions/Reduce-Workload/"]) {
    const response = await fetch(origin + path + "?source=mail", { redirect: "manual" });
    assert.equal(response.status, 308, path);
    const canonical = path.toLowerCase().includes("solutions") ? "/solutions/reduce-workload" : "/services";
    assert.equal(response.headers.get("location"), canonical + "?source=mail");
  }
});

test("missing pages and JavaScript assets return 404 instead of the homepage", async () => {
  for (const path of ["/not-a-real-page", "/assets/no-such-chunk.js", "/solutions/missing"]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const dom = new JSDOM(await response.text());
    assert.equal(dom.window.document.title, "Page not found | Ackra AI");
    assert.ok(dom.window.document.querySelector('meta[name="robots"]').content.includes("noindex"));
    dom.window.close();
  }
});

test("admin starts with a noindex shell and never renders stored submissions", async () => {
  const response = await fetch(origin + "/admin");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(response.headers.get("cache-control"), "no-store");
  const dom = new JSDOM(await response.text());
  assert.equal(dom.window.document.title, "Admin | Ackra AI");
  assert.ok(dom.window.document.querySelector('meta[name="robots"]').content.includes("noindex"));
  assert.equal(dom.window.document.querySelector("table"), null);
  dom.window.close();
});

test("preview negotiates text compression and serves WebP with its image MIME type", async () => {
  for (const encoding of ["br", "gzip"]) {
    const response = await fetch(origin + "/", { headers: { "Accept-Encoding": encoding } });
    assert.equal(response.headers.get("content-encoding"), encoding);
    assert.equal(response.headers.get("vary"), "Accept-Encoding");
    assert.ok((await response.text()).includes('data-prerendered="true"'));
  }
  const plain = await fetch(origin + "/", { headers: { "Accept-Encoding": "br;q=0, gzip;q=0" } });
  assert.equal(plain.headers.get("content-encoding"), null);
  const image = await fetch(origin + "/images/systems-640.webp");
  assert.equal(image.headers.get("content-type"), "image/webp");
});

test("the sitemap has exactly the public routes and no admin entry", async () => {
  const dom = new JSDOM(await readFile(resolve("dist/sitemap.xml"), "utf8"), { contentType: "application/xml" });
  const urls = Array.from(dom.window.document.querySelectorAll("loc"), (node) => node.textContent);
  assert.deepEqual(urls, paths.map((path) => "https://ackra.ai" + path));
  dom.window.close();
});

test("deployment rewrites leave missing resources alone and retain the Python API", async () => {
  const config = JSON.parse(await readFile(resolve("vercel.json"), "utf8"));
  assert.equal(config.framework, "vite");
  assert.equal(config.outputDirectory, "dist");
  assert.equal(config.cleanUrls, true);
  assert.equal(config.trailingSlash, false);
  assert.deepEqual(config.rewrites, [{ source: "/api/:path*", destination: "/api/index" }]);
  assert.ok(!config.routes, "a catch-all route would mask missing assets");
  for (const redirect of config.redirects) {
    const source = new RegExp("^/" + redirect.source.slice("/:path(".length, -1) + "$");
    assert.ok(source.test(redirect.destination.toUpperCase()), redirect.destination);
    assert.ok(!source.test(redirect.destination), "canonical URLs must not redirect to themselves");
  }
});
