# Coptic iOS to web migration checklist

Comparison baseline: `Pompono/Coptic` (`main`) and `Pompono/Coptic-iOS` (`main`) as cloned for this migration. The iOS repository README describes itself as a Capacitor port that keeps the web repository independent.

## Migration checklist

- [x] Compare repository structure, framework/build configuration, learning and dictionary code, content, storage, translation, and bundled assets.
- [x] Identify browser-portable features, web-specific adaptations, and infrastructure or licensing blockers.
- [x] Port the latest lesson interaction and persistence improvements while retaining the Next.js server application and lesson URLs.
- [x] Add the interactive reading route, dictionary-backed word details, and source-labelled starter passages.
- [x] Add saved vocabulary, review scheduling, recall cards, and the meaning quiz using a separate, versioned local store.
- [x] Port dictionary browsing and preferences where they fit the existing web dictionary data and routes.
- [x] Align shared navigation, typography, theme, responsive layouts, and accessibility with the iOS design system without requiring Capacitor; check the updated routes in a desktop browser.
- [x] Verify persistence compatibility and make migrations additive; preserve existing lesson progress and settings.
- [x] Document browser adaptations and deferred features, especially translation and OCR.
- [x] Run the available type, lint, test, and production-build checks requested in the migration brief; fix regressions.
- [x] Commit implementation in focused stages and open a review pull request against `Pompono/Coptic` `main`.

## Portability decisions

| iOS work | Decision for the web application |
| --- | --- |
| Learning session, lesson exercise definitions, lesson completion feedback, and progress logic | Port shared browser-compatible content and interaction logic. Keep current web routes and existing progress keys; migrate additively. |
| Reading passages, tokenization, dictionary word lookup, grammar notes, and saved senses | Port. Use browser navigation and local storage; keep starter practice text explicitly identified as app-composed. |
| Vocabulary review schedule, recall cards, and meaning quiz | Port to a separate versioned local storage key so it cannot overwrite lesson data. |
| Dictionary browsing worker and display preferences | Port/adapt to a browser worker and the web dictionary corpus. Keep the current web dictionary route available. |
| Theme, Coptic font and keyboard preferences, responsive dock, scroll behavior, and keyboard handling | Port the browser-safe parts, testing desktop mouse/keyboard and mobile touch behavior. Omit Capacitor bridge calls. |
| On-device Coptic-to-English model | Deferred. The iOS implementation needs generated model/runtime assets of about 145 MB, uses AGPL-3.0 model weights, and has limited translation quality and browser performance evidence. Evaluate licensing, deployment size, compatibility, and quality separately before bundling. |
| English-to-Coptic and fallback model service | Deferred. The iOS README requires a separately hosted Node/Python service; the target's Python subprocess routes are not suitable for AWS Amplify's web runtime. No paid service or new infrastructure is approved. |
| Photo scanning and OCR | Deferred. It is experimental, uses an approximately 8 MB model whose upstream repository does not specify a redistribution license, and needs device performance and accuracy validation. |
| iOS app shell, Capacitor plugins, native app icon, native scrolling/keyboard bridges, Xcode workflows | Excluded from the web runtime. Preserve the standalone Next.js application and Amplify deployment model. |
| Existing web translator API routes, dictionary assets, lesson routes, and audio/font assets | Preserve unless a specific compatibility issue is found. These include web functionality and source data absent from the iOS static-export architecture. |

## Compatibility and data notes

- The web repository currently uses a dynamic Next.js app with API routes and the `next start` build flow. The iOS project uses Next.js 16 and a static export for Capacitor. Do not copy the iOS static-export setting into the web app.
- The web repository's package manifest uses `next: latest`; the iOS lockfile pins Next.js 16.1.6. Review the locked web version and build behavior before changing dependencies.
- Existing lesson progress is stored under `coptic-unit-progress:` and failed-step keys under `coptic-unit-failed-steps:`. The iOS learning helper adds its own `coptic-learning:v1` key. Keep existing values readable and avoid broad storage clearing.
- The iOS vocabulary store uses its own versioned key. Retain that separation and preserve malformed stored data rather than overwriting it.
- The web root already bundles a Coptic font, Bohairic and combined dictionary JSON, lesson audio, and lesson illustrations. Keep those bytes/content intact.
- The web target has no Amplify configuration in its root at comparison time. Preserve its current Next.js server-rendered deployment structure and inspect any existing deployment files before changing build configuration.

## Web-only and source-repository differences

- The target has Python translation implementations and `/api/translate` routes that the iOS repository moved into a separate backend. Keep the web source and route behavior during the core migration; document that this runtime is not AWS Amplify compatible until replaced or hosted separately.
- The iOS repository includes app-only scanning, native lifecycle handling, simulator automation, and generated offline model workflows. These are not prerequisites for the core browser migration.
- The target's current dictionary uses `/dictionary/[id]` pages, while iOS uses `/dictionary/entry/?lemma=...` for static export. Keep the target route and adapt dictionary browsing/entry links to it where practical.
- iOS's browser-compatible local inference needs about 145 MB of generated model weights/runtime and carries an AGPL-3.0 model license. Its own evaluation records semantic errors and still requires browser-device performance validation. This migration instead ports the independent published-text lookup: a lazily loaded ~6.2 MB CC BY 4.0 Bohairic corpus with strict whole-passage matching, source attribution, and no fuzzy correction. Experimental inference remains an explicit opt-in to the existing API service.
- The iOS OCR package/model was not ported. Its upstream model repository does not specify a redistribution license; the iOS source also describes it as experimental and not yet evaluated on representative device photos.
