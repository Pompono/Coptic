import test from "node:test";
import assert from "node:assert/strict";
import { createTranslationHandler } from "../lib/translationProxy.mjs";

const env = {
  COPTIC_API_BASE_URL: "https://api.coptlingo.com/",
  COPTIC_API_KEY: "test-only-secret",
};
let requestId = 0;

function request(body, { ip = `198.51.100.${++requestId}` } = {}) {
  return new Request("https://site.example/api/translate", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `203.0.113.99, ${ip}` },
    body: JSON.stringify(body),
  });
}

for (const direction of ["coptic-en", "en-coptic"]) {
  const endpoint = direction === "en-coptic" ? "/api/translate/en-coptic" : "/api/translate";
  const label = direction === "en-coptic" ? "English to Coptic" : "Coptic to English";

  test(`${label}: forwards text, dialect, confidence, and private API key`, async () => {
    let calledUrl;
    let calledOptions;
    const handler = createTranslationHandler({
      direction,
      env,
      fetchImpl: async (url, options) => {
        calledUrl = url;
        calledOptions = options;
        return Response.json({ translation: "translated", confidence: 0.91, dialect: "bohairic" });
      },
    });

    const response = await handler(request({ text: "  sample text ", dialect: "bohairic", includeConfidence: true }));
    assert.equal(response.status, 200);
    assert.equal(calledUrl, `https://api.coptlingo.com${endpoint}`);
    assert.equal(calledOptions.headers["X-API-Key"], "test-only-secret");
    assert.deepEqual(JSON.parse(calledOptions.body), {
      text: "sample text", dialect: "bohairic", includeConfidence: true,
    });
    assert.deepEqual(await response.json(), { translation: "translated", dialect: "bohairic", confidence: 0.91 });
  });

  test(`${label}: returns a safe timeout response`, async () => {
    const handler = createTranslationHandler({
      direction,
      env,
      fetchImpl: async () => { throw Object.assign(new Error("internal timeout details"), { name: "TimeoutError" }); },
    });
    const response = await handler(request({ text: "sample" }));
    assert.equal(response.status, 504);
    assert.deepEqual(await response.json(), { error: "Translation service timed out. Please try again." });
  });

  test(`${label}: hides backend authentication details`, async () => {
    const handler = createTranslationHandler({
      direction,
      env,
      fetchImpl: async () => Response.json({ detail: "secret backend diagnostic" }, { status: 401 }),
    });
    const response = await handler(request({ text: "sample" }));
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: "Translation service authentication failed." });
  });

  test(`${label}: returns a safe unavailable response`, async () => {
    const handler = createTranslationHandler({ direction, env, fetchImpl: async () => { throw new Error("network internals"); } });
    const response = await handler(request({ text: "sample" }));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "Translation service is temporarily unavailable. Please try again." });
  });
}

test("rate limits requests by the last trusted proxy hop, not an identity header", async () => {
  const handler = createTranslationHandler({ direction: "coptic-en", env, fetchImpl: async () => Response.json({ translation: "ok" }) });
  const ip = `198.51.100.${++requestId}`;
  let lastResponse;
  for (let index = 0; index < 31; index += 1) {
    lastResponse = await handler(new Request("https://site.example/api/translate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `spoofed, ${ip}`,
        "x-user-id": `user-${index}`,
      },
      body: JSON.stringify({ text: "sample" }),
    }));
  }
  assert.equal(lastResponse.status, 429);
  assert.equal(lastResponse.headers.get("retry-after"), "60");
});

test("rejects invalid and oversized text without calling the backend", async () => {
  let calls = 0;
  const handler = createTranslationHandler({ direction: "coptic-en", env, fetchImpl: async () => { calls += 1; return Response.json({ translation: "ok" }); } });
  assert.equal((await handler(request({ text: "  " }))).status, 400);
  assert.equal((await handler(request({ text: "x".repeat(1_201) }))).status, 400);
  assert.equal(calls, 0);
});

for (const direction of ["coptic-en", "en-coptic"]) {
  test(`${direction}: accepts 1,200 Unicode characters and rejects 1,201`, async () => {
    let calls = 0;
    const handler = createTranslationHandler({
      direction,
      env,
      fetchImpl: async () => {
        calls += 1;
        return Response.json({ translation: "translated" });
      },
    });
    const accepted = await handler(request({ text: "😀".repeat(1_200) }));
    assert.equal(accepted.status, 200);
    assert.equal(calls, 1);

    const rejected = await handler(request({ text: "x".repeat(1_201) }));
    assert.equal(rejected.status, 400);
    assert.deepEqual(await rejected.json(), { error: "Text must be 1200 characters or fewer." });
    assert.equal(calls, 1);
  });
}
