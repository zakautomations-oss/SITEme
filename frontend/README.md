# Ackra AI website

React 18, Vite 8, Tailwind CSS 3, and a Python FastAPI function on Vercel.

## Local development

Use Node 24 (the exact tested version is in `.nvmrc`) and Yarn 1.22.22.

```sh
yarn install --frozen-lockfile
yarn dev
```

Vite proxies `/api` to `http://127.0.0.1:8010`. Set `API_ORIGIN` to use a different local backend. No local command defaults to the production API.

```sh
yarn test
yarn build
yarn test:build
API_ORIGIN=http://127.0.0.1:8010 yarn preview
```

`yarn preview` serves the generated pages at `http://127.0.0.1:4173`, including clean URLs, canonical redirects, text compression, and actual 404 responses. Omit `API_ORIGIN` to review static pages without a backend; API calls then return an explicit 503.

## Static pages and metadata

`src/config/site.js` owns site/contact/booking constants. `src/config/routes.js` owns route metadata and the sitemap's public routes. The production build first creates the browser assets, then uses React's streaming server renderer to resolve lazy routes and emit complete HTML. Hydration adds interactions to the generated content.

Output includes six public pages, an admin loading shell marked `noindex`, and `404.html`. Admin data is never fetched during the build. No server-side React runtime is needed in production.

When adding a public route, add its metadata and React route, plus any case-normalizing redirect in `vercel.json`. Keep `tests/build.test.mjs`'s explicit public-route list current. The tests verify meaningful page content, route-specific metadata, sitemap coverage, process anchors, and HTTP status handling.

## Vercel

The project root directory is `frontend`. `vercel.json` sets the Vite framework, frozen Yarn install, build command, `dist` output, clean URLs, and canonical redirects. Only `/api/*` rewrites to `api/index.py`; missing pages and assets use the generated `404.html` with HTTP 404. The existing FastAPI function remains a Vercel Python function.

`ci/website-checks.yml` is a ready-to-install GitHub Actions template for frontend components, the production build and its HTTP behavior, and the Python API with a mocked database. To enable it, a repository maintainer can copy it to `.github/workflows/checks.yml` using a credential with workflow permission. It does not deploy or use production credentials. The current editing credential cannot install Actions workflows, so these checks were run locally for this release.

## API configuration and tests

The Python function uses `MONGO_URL`, `DB_NAME`, and `ADMIN_TOKEN` from server-side environment variables. Configure them in the appropriate Vercel environment; never expose them through a `VITE_` variable. Missing admin configuration denies access. Database connectivity failures return a bounded 503 response. `/api/health` performs a real database ping.

Use Python 3.12 and an isolated virtual environment for the API tests:

```sh
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-test.txt
python -m unittest discover -s tests -p 'test_*.py' -v
```

Tests use a mocked database and synthetic inquiries. The public contact form stores submissions in MongoDB; it does not send notification emails. Authenticated staff can review them at `/admin`, with complete messages and pagination. The legacy authenticated `GET /api/contact` retains its array response for compatibility.

See `DESIGN.md` for the visual system and image/font provenance.
