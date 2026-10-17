import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");

test("Amplify writer allowlists server variables and Next loads them without logging values", async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "coptic-runtime-env-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [path.resolve("scripts/write-amplify-runtime-env.mjs")], {
    cwd: dir,
    env: {
      COPTIC_API_BASE_URL: "https://api.coptlingo.com",
      COPTIC_API_KEY: "env-writer-test-only",
      NEXT_PUBLIC_UNRELATED: "must-not-be-copied",
    },
    encoding: "utf8",
  });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "");
  const file = path.join(dir, ".env.production");
  const contents = await readFile(file, "utf8");
  assert.equal(contents.split("\n").filter(Boolean).length, 2);
  assert.doesNotMatch(contents, /NEXT_PUBLIC|must-not-be-copied/);
  assert.equal((await stat(file)).mode & 0o777, 0o600);
  const config = loadEnvConfig(dir, false, { info() {}, error() {} }, true);
  assert.equal(config.parsedEnv.COPTIC_API_BASE_URL, "https://api.coptlingo.com");
  assert.equal(config.parsedEnv.COPTIC_API_KEY, "env-writer-test-only");
  const buildSpec = await readFile("amplify.yml", "utf8");
  assert.match(buildSpec, /node scripts\/write-amplify-runtime-env\.mjs[\s\S]*npm run build/);
  assert.match(await readFile(".gitignore", "utf8"), /^\.env\.production$/m);
});
