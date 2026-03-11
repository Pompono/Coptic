import { NextResponse } from "next/server";

type BackendTranslation = { text?: string; translation?: string; coptic?: string };

function normalizeTranslation(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function extractTranslations(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  const candidates: string[] = [];

  const directKeys = ["translation", "translated_text", "coptic", "output_text", "text"];
  for (const key of directKeys) {
    const hit = normalizeTranslation(obj[key]);
    if (hit) candidates.push(hit);
  }

  const translations = obj.translations;
  if (Array.isArray(translations)) {
    for (const item of translations) {
      if (typeof item === "string") {
        const hit = normalizeTranslation(item);
        if (hit) candidates.push(hit);
        continue;
      }
      if (item && typeof item === "object") {
        const t = item as BackendTranslation;
        const hit = normalizeTranslation(t.text) ?? normalizeTranslation(t.translation) ?? normalizeTranslation(t.coptic);
        if (hit) candidates.push(hit);
      }
    }
  }

  const outputs = obj.outputs;
  if (Array.isArray(outputs)) {
    for (const item of outputs) {
      const hit = normalizeTranslation(item);
      if (hit) candidates.push(hit);
    }
  }

  return [...new Set(candidates)];
}

export async function POST(request: Request) {
  const backendUrl =
    process.env.COPTIC_TRANSLATOR_BACKEND_URL ??
    process.env.NEXT_PUBLIC_COPTIC_TRANSLATOR_BACKEND_URL ??
    "http://127.0.0.1:8000/translate";

  let input: { text?: string };
  try {
    input = (await request.json()) as { text?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = (input.text ?? "").toString().trim();
  if (!text) {
    return NextResponse.json({ error: "Please provide text." }, { status: 400 });
  }

  try {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Translator backend failed with status ${res.status}.`,
          backendUrl,
        },
        { status: 502 }
      );
    }

    const payload = (await res.json()) as unknown;
    const translations = extractTranslations(payload);

    if (translations.length === 0) {
      return NextResponse.json(
        { error: "Translator response did not include a usable translation." },
        { status: 502 }
      );
    }

    return NextResponse.json({ translations });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to contact translator backend.",
        backendUrl,
        hint:
          "Set COPTIC_TRANSLATOR_BACKEND_URL in .env.local (or run backend at http://127.0.0.1:8000/translate), then restart Next.js.",
      },
      { status: 502 }
    );
  }
}
