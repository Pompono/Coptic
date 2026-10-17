import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadTsModule } from "./tsModule.mjs";

// Exercise the production entry points, not just the shared helper. PR #3's
// helper tests passed while these routes still launched Python.
test("production route exports proxy both directions without subprocesses", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalEnv = Object.fromEntries(["NODE_ENV", "COPTIC_API_BASE_URL", "COPTIC_API_KEY"].map((key) => [key, process.env[key]]));
  t.after(() => {
    globalThis.fetch = originalFetch;
    for (const key of ["NODE_ENV", "COPTIC_API_BASE_URL", "COPTIC_API_KEY"]) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
  });
  process.env.NODE_ENV = "production";
  process.env.COPTIC_API_BASE_URL = "https://api.coptlingo.com";
  process.env.COPTIC_API_KEY = "route-test-only";

  for (const [file, endpoint, dialect] of [
    ["app/api/translate/route.ts", "/api/translate", "sahidic"],
    ["app/api/translate/en-coptic/route.ts", "/api/translate/en-coptic", "bohairic"],
  ]) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /child_process|\b(?:spawn|exec|execFile|fork)\s*\(|python|runTranslatorCLI/i);
    let calls = 0;
    globalThis.fetch = async (url, options) => {
      calls += 1;
      assert.equal(url, `https://api.coptlingo.com${endpoint}`);
      assert.equal(options.headers["X-API-Key"], "route-test-only");
      assert.equal(options.redirect, "error");
      assert.equal(options.cache, "no-store");
      assert.ok(options.signal instanceof AbortSignal);
      assert.deepEqual(JSON.parse(options.body), { text: "sample", dialect, includeConfidence: true });
      return Response.json({ translation: "translated", confidence: 0.9, processed_input: "private diagnostic" });
    };
    const route = await loadTsModule(file);
    assert.equal(route.runtime, "nodejs");
    const request = (body) => new Request(`https://site.example${endpoint}`, {
      method: "POST", body: JSON.stringify(body),
    });
    const response = await route.POST(request({ text: " sample ", includeConfidence: true }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { translation: "translated", dialect, confidence: 0.9 });
    assert.equal(calls, 1);
    assert.equal((await route.POST(request({ text: "x".repeat(1201) }))).status, 400);
    assert.equal(calls, 1);
    delete process.env.COPTIC_API_KEY;
    const unavailable = await route.POST(request({ text: "sample" }));
    assert.equal(unavailable.status, 503);
    assert.deepEqual(await unavailable.json(), { error: "Translation service is not configured." });
    assert.equal(calls, 1);
    process.env.COPTIC_API_KEY = "route-test-only";
  }
});
