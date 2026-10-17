import { MAX_TRANSLATION_CHARACTERS } from "./translationLimits.mjs";

const REQUEST_TIMEOUT_MS = 25_000;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map();

function json(body, status, headers = {}) {
  return Response.json(body, { status, headers });
}

function clientAddress(request) {
  // Amplify's trusted edge appends the connecting address to X-Forwarded-For.
  // Use the rightmost hop, never a caller-supplied identity header.
  const forwarded = request.headers.get("x-forwarded-for");
  const address = forwarded?.split(",").map((part) => part.trim()).filter(Boolean).at(-1);
  return address || "unknown";
}

function takeRateLimit(request, now = Date.now()) {
  const address = clientAddress(request);
  let bucket = rateBuckets.get(address);
  if (!bucket || now - bucket.startedAt >= RATE_WINDOW_MS) {
    bucket = { startedAt: now, count: 0 };
    rateBuckets.set(address, bucket);
  }

  bucket.count += 1;
  if (rateBuckets.size > 10_000) {
    for (const [key, value] of rateBuckets) {
      if (now - value.startedAt >= RATE_WINDOW_MS) rateBuckets.delete(key);
    }
    while (rateBuckets.size > 10_000) rateBuckets.delete(rateBuckets.keys().next().value);
  }

  const remaining = Math.max(0, RATE_LIMIT - bucket.count);
  const headers = {
    "RateLimit-Limit": String(RATE_LIMIT),
    "RateLimit-Remaining": String(remaining),
    "RateLimit-Reset": String(Math.ceil((bucket.startedAt + RATE_WINDOW_MS) / 1000)),
  };

  return { allowed: bucket.count <= RATE_LIMIT, headers };
}

function validBackendUrl(baseUrl) {
  if (!baseUrl) return null;
  try {
    const url = new URL(baseUrl);
    const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    if ((url.protocol !== "https:" && !(local && url.protocol === "http:")) || url.username || url.password
      || (url.pathname !== "/" && url.pathname !== "") || url.search || url.hash) return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function createTranslationHandler({ direction, fetchImpl = fetch, env = process.env }) {
  const backendPath = direction === "en-coptic" ? "/api/translate/en-coptic" : "/api/translate";

  return async function POST(request) {
    const rate = takeRateLimit(request);
    if (!rate.allowed) {
      return json({ error: "Too many translation requests. Please try again shortly." }, 429, {
        ...rate.headers,
        "Retry-After": "60",
      });
    }

    let input;
    try {
      const contentLength = Number(request.headers.get("content-length") || 0);
      if (contentLength > 12_000) return json({ error: "Request body is too large." }, 413, rate.headers);
      const body = await request.text();
      if (new TextEncoder().encode(body).byteLength > 12_000) {
        return json({ error: "Request body is too large." }, 413, rate.headers);
      }
      input = JSON.parse(body);
    } catch {
      return json({ error: "Invalid JSON body." }, 400, rate.headers);
    }

    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return json({ error: "Invalid request body." }, 400, rate.headers);
    }

    if (input.dialect !== undefined && input.dialect !== "sahidic" && input.dialect !== "bohairic") {
      return json({ error: "Dialect must be sahidic or bohairic." }, 400, rate.headers);
    }
    if (input.includeConfidence !== undefined && typeof input.includeConfidence !== "boolean") {
      return json({ error: "includeConfidence must be a boolean." }, 400, rate.headers);
    }

    const text = typeof input.text === "string" ? input.text.trim() : "";
    if (!text) return json({ error: "Please provide text." }, 400, rate.headers);
    if (Array.from(text).length > MAX_TRANSLATION_CHARACTERS) {
      return json({ error: `Text must be ${MAX_TRANSLATION_CHARACTERS} characters or fewer.` }, 400, rate.headers);
    }
    const dialect = input.dialect === "sahidic" || input.dialect === "bohairic"
      ? input.dialect
      : direction === "en-coptic" ? "bohairic" : "sahidic";
    const includeConfidence = input.includeConfidence === true;

    const baseUrl = validBackendUrl(env.COPTIC_API_BASE_URL);
    const apiKey = env.COPTIC_API_KEY;
    if (!baseUrl || !apiKey) {
      return json({ error: "Translation service is not configured." }, 503, rate.headers);
    }

    let backendResponse;
    try {
      backendResponse = await fetchImpl(`${baseUrl}${backendPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({ text, dialect, includeConfidence }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        cache: "no-store",
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") {
        return json({ error: "Translation service timed out. Please try again." }, 504, rate.headers);
      }
      return json({ error: "Translation service is temporarily unavailable. Please try again." }, 503, rate.headers);
    }

    if (backendResponse.status === 401 || backendResponse.status === 403) {
      return json({ error: "Translation service authentication failed." }, 502, rate.headers);
    }
    if (!backendResponse.ok) {
      return json({ error: "Translation service could not complete this request." }, 502, rate.headers);
    }

    let result;
    try {
      result = await backendResponse.json();
    } catch {
      return json({ error: "Translation service returned an invalid response." }, 502, rate.headers);
    }
    if (!result || typeof result.translation !== "string" || !result.translation.trim()) {
      return json({ error: "Translation service returned an invalid response." }, 502, rate.headers);
    }

    const response = { translation: result.translation, dialect };
    if (typeof result.confidence === "number" && Number.isFinite(result.confidence)) {
      response.confidence = result.confidence;
    }
    return json(response, 200, rate.headers);
  };
}
