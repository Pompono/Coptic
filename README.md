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

**Experimental service** and English-to-Coptic still call the existing API routes.
Those routes launch Python translator processes and require the Python
dependencies and model weights in `translator/requirements.txt`. This setup is
not suitable for the AWS Amplify web runtime as currently configured. The
browser-safe published-text lookup works without that service. No paid service
or external translation hosting is required for the learning tools.

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

`COPTIC_TRANSLATOR_PYTHON_BIN` optionally selects the Python executable and
`COPTIC_TRANSLATOR_DEFAULT_DIALECT` selects the fallback dialect (`bohairic` or
`sahidic`). These settings support compatible self-hosted Next.js environments;
they do not make the Python subprocess routes compatible with AWS Amplify.
