# Production translator investigation (2026-10-17)

## Confirmed source regression

`main` was `e0183a8202d793591cb139416e18c0555f151641` (PR #3's merge).
Commit `4542686` replaced both Python Route Handlers with the HTTPS proxy.
The next commit, `6521c0d`, restored both complete Python handlers. Commit
`33ff0c6` did not correct them. The merge preserved that final tree: the helper,
tests, limits, UI validation, Amplify build spec, and env writer arrived, but
neither route replacement did. This was a regression inside PR #3, not a
subsequent revert or a merge conflict introduced by the merge commit.

Both live POST endpoints returned HTTP 502 with `spawn python3 ENOENT` during
this investigation. The backend readiness endpoint returned HTTP 200 with
`status: ready`. Deploying the existing main source can reproduce the error;
there is no need to assume a stale bundle or browser cache to explain it.

GitHub exposed no Actions runs, commit statuses, or check runs for the merge.
The cloud environment had no configured AWS identity or backend secret. The
actual Amplify deployed SHA, branch/domain mapping, console overrides, build
logs, runtime variables, and cache contents could not be inspected. An older
deployment remains possible; the live error alone cannot identify its SHA.
PR #4 also already proposes the two route replacements, but is unmerged.
This fix is independently based on main and adds regression coverage and
redirect protection. Review the overlapping PRs before merging either.

## Fix and validation

Both routes now export the existing proxy handler with explicit Node.js runtime.
The helper keeps its backend paths, dialect defaults, confidence response,
1,200 Unicode character limit, safe errors, rate limit, and 25-second timeout.
Redirects are rejected to keep `X-API-Key` from reaching a redirected host.
Published-text lookup and other application features are unchanged.

- `npm test`: passed, all nine test files; direct execution also confirmed all
  32 individual tests pass. New tests exercise both actual production route
  exports, reject subprocess code, and check the Amplify env writer with a
  synthetic value through Next's env loader.
- TypeScript, ESLint, and production build: passed. Build emitted an existing
  outdated Browserslist data warning.
- `next start` against a local mock backend: both built routes passed, including
  authentication header, body/response shape, dialect/confidence, 1,200/1,201
  boundaries, and redirect rejection. The server loaded synthetic credentials
  from `.env.production`, with neither API variable supplied in its process env.
- All 34 files in `.next/static` were checked: neither the synthetic key nor
  `COPTIC_API_KEY` appeared. No real secret was retrieved, printed, or used.
- Real backend readiness: passed. Authenticated real-model integration was not
  executed because no private key was available. No AWS changes were made.

## Amplify follow-up (after review and deployment approval)

1. In the Amplify console, open the app serving `coptlingo.com`. Under **Hosting
   > Custom domains**, confirm that the production domain maps to the `main`
   branch of `Pompono/Coptic`. Check the latest deployment's commit SHA and
   source repository. A deployment of `e0183a8` still contains the broken routes.
2. Under **Hosting > Environment variables**, set the `main` branch values:
   `COPTIC_API_BASE_URL=https://api.coptlingo.com` and `COPTIC_API_KEY` to the
   existing backend key. Check branch overrides. Do not add a `NEXT_PUBLIC_`
   prefix, print the key in build commands, or create a new backend key.
3. Under **Hosting > Build settings**, verify the effective spec matches the
   checked-in `amplify.yml`: `npm ci`, then
   `node scripts/write-amplify-runtime-env.mjs`, then `npm run build`, with
   artifact directory `.next`. If console settings or a monorepo app root
   override the repository configuration, correct them to build this app root
   and execute the writer before the build.
4. After the reviewed fix is merged and deployment is authorized, build the
   new main commit. Confirm the build log shows the correct SHA, env-writer
   command, and both dynamic translation routes. The writer produces an ignored,
   mode-0600 `.env.production` containing only the two server variables; Amplify
   build variables alone are not sufficient for SSR. Restrict artifact access.
5. Test both directions through `https://coptlingo.com/translator`. This uses
   the server-side key without putting it in the browser. A 503 configuration
   error means the env file/variables need attention; 502 authentication means
   the existing key does not match. No EC2 restart is needed.
6. Only if the verified new deployment still runs old code, use Amplify's
   **Clear cache and redeploy** action and inspect the selected SHA, effective
   build spec, and domain/branch mapping again. The checked-in cache includes
   only `node_modules` and `.next/cache`, not complete server route artifacts.
   Clearing a browser cache cannot repair the source regression.

The code is validated for review and deployment, but authenticated production
translation and the actual Amplify environment still require verification.
