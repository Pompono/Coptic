# Coptic

A standalone Next.js web application for learning Bohairic Coptic. It is deployed
from `main` to AWS Amplify and remains usable in desktop and mobile browsers.

## Learning tools

- **Learn** provides a lesson path, guided lessons, interactive exercises, review
  checkpoints, audio, and local completion tracking.
- **Read Coptic** includes clearly labelled practice passages and lets you open a
  saved custom passage. Select a word for supported dictionary matches, listed
  forms, grammatical notes, sources, and available recordings.
- **Vocabulary & review** saves dictionary senses on this device and schedules
  recall cards. A meaning quiz is available when multiple saved meanings exist.
- **Dictionary** supports search, browsing, filters, entry details, and saved
  vocabulary.
- **Settings** include the light/dark theme, Coptic font, Bohairic-only mode, and
  local progress controls.

Lesson progress keeps the existing `coptic-unit-progress:` and
`coptic-unit-failed-steps:` local-storage keys. Learning review uses the separate
`coptic-learning:v1` key. Saved vocabulary and the reader each use independent,
versioned stores. These features do not sync between browsers or devices.

## Translation

Coptic-to-English defaults to **Published text**. It performs a strict whole-
passage lookup in the bundled Bohairic parallel-text corpus and returns its
existing English rendering with matched Coptic, source, and row attribution. It
does not use fuzzy matching or invent missing letters or translations. The
corpus is about 6.2 MB, loads only when this method is used, and is licensed
CC BY 4.0. Its source and attribution are documented in
[`public/reference-translation/README.md`](public/reference-translation/README.md).
Coverage is limited to some whole Bohairic passages; there is no published
Sahidic coverage and an exact match does not certify a source translation.

**Experimental service** and English-to-Coptic keep their existing browser
request formats, while the Next.js API routes proxy requests to the standalone
FastAPI service over HTTPS. Published-text lookup remains local and does not
call the model service. Requests are limited to 2,000 characters, time out
after 15 seconds, and receive safe errors if the backend is unavailable.

### AWS Amplify environment variables

In the Amplify app's environment variables for every deployed branch, configure
these server-side values:

```dotenv
COPTIC_API_BASE_URL=https://api.coptlingo.com
COPTIC_API_KEY=<the private API key configured on the FastAPI service>
```

Keep `COPTIC_API_KEY` private: do not prefix it with `NEXT_PUBLIC_`, expose it
to client components, or commit it to the repository. The Next.js server sends
it as the `X-API-Key` header to `POST /api/translate` and
`POST /api/translate/en-coptic`. Both requests include `text`, `dialect`, and
`includeConfidence`. The backend should accept that header and request schema.
Set the URL to an HTTPS origin without a path suffix.

The routes apply an in-process limit of 30 requests per minute, keyed by the
address appended by Amplify's trusted forwarding proxy; caller-supplied identity
headers are ignored. Serverless instances do not share memory, so configure an
AWS WAF rate-based rule on the public app for a durable edge limit before a
wide launch. Keep WAF's forwarded-IP configuration aligned with the trusted
proxy chain so clients cannot choose their own rate-limit identity.

For local development, set the same variables in `.env.local` and never commit
that file. Translation routes return a safe service-unavailable response when
either value is missing.

The iOS repository's experimental offline model is not bundled here. Its
generated weights add about 145 MB, are licensed AGPL-3.0, and the source project
documents quality and browser performance limits. Photo OCR is also deferred:
its upstream model repository does not specify a redistribution license.

## Run locally

```bash
npm ci
npm run dev
```

The app uses a standard Next.js server build. Do not add `output: "export"` to
`next.config.js`; the web repository retains its own routes and deployment
workflow.

Available checks:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The Python translator can be run directly with:

```bash
python translator/cli.py "ⲡⲉⲛⲛⲟⲩϯ" --dialect bohairic --include-confidence
```

The Python scripts remain available for local model development; the website's
translation API routes do not launch them.
