"use client";

import Link from "next/link";
import { useState } from "react";

type TranslationPayload = {
  translation?: string;
  confidence?: number;
  dialect?: "sahidic" | "bohairic";
  error?: string;
  details?: string;
};

export default function TranslatorPage() {
  const [translationInput, setTranslationInput] = useState("");
  const [translatorDialect, setTranslatorDialect] = useState<"sahidic" | "bohairic">("bohairic");
  const [translationState, setTranslationState] = useState<"idle" | "loading" | "error">("idle");
  const [translationError, setTranslationError] = useState("");
  const [translationOutput, setTranslationOutput] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);

  const runTranslation = async () => {
    const text = translationInput.trim();
    if (!text) {
      setTranslationError("Enter Coptic text to translate.");
      setTranslationOutput("");
      setConfidence(null);
      setTranslationState("error");
      return;
    }

    setTranslationState("loading");
    setTranslationError("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          dialect: translatorDialect,
          includeConfidence: true,
        }),
      });

      const payload = (await res.json()) as TranslationPayload;
      if (!res.ok) {
        setTranslationOutput("");
        setConfidence(null);
        setTranslationState("error");

        const details = [payload.error, payload.details].filter(Boolean).join(" ");
        setTranslationError(details || "Translation request failed.");
        return;
      }

      const top = typeof payload.translation === "string" ? payload.translation.trim() : "";
      setTranslationOutput(top);
      setConfidence(typeof payload.confidence === "number" ? payload.confidence : null);
      setTranslationState("idle");
    } catch {
      setTranslationOutput("");
      setConfidence(null);
      setTranslationState("error");
      setTranslationError("Could not reach translation service.");
    }
  };

  const dialectLabel = translatorDialect === "bohairic" ? "Bohairic" : "Sahidic";

  return (
    <main className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-1)] px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--surface-2)]"
          >
            ← Home
          </Link>

          <Link
            href="/dictionary"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-1)] px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--surface-2)]"
          >
            Dictionary
          </Link>
        </div>

        <h1 className="mt-7 text-4xl font-semibold tracking-tight">Coptic Translator</h1>
        <p className="mt-2 text-[var(--text-muted)]">Coptic → English translator (local model)</p>

        <div className="mt-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-1)] p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)]">Dialect</span>
            <button
              type="button"
              onClick={() =>
                setTranslatorDialect((current) => (current === "bohairic" ? "sahidic" : "bohairic"))
              }
              className="rounded-full border border-[var(--border-color)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-color)] hover:bg-[var(--surface-1)]"
              title="Toggle translator dialect"
            >
              {dialectLabel}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={translationInput}
              onChange={(e) => setTranslationInput(e.target.value)}
              placeholder="Type Coptic text..."
              className="min-w-[260px] flex-1 rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-2 text-sm text-[var(--text-color)] outline-none placeholder:text-[var(--text-soft)]"
            />
            <button
              type="button"
              onClick={runTranslation}
              disabled={translationState === "loading"}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-color)] hover:bg-[var(--surface-1)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {translationState === "loading" ? "Translating…" : "Translate"}
            </button>
          </div>

          {translationState === "error" ? (
            <p className="mt-3 text-xs text-rose-300">{translationError}</p>
          ) : null}

          <div className="mt-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] p-4">
            <p className="text-xs text-[var(--text-muted)]">Output</p>
            <p className="mt-2 text-lg text-[var(--text-color)]">{translationOutput || "Translation will appear here."}</p>
            {confidence !== null ? (
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Confidence: {(confidence * 100).toFixed(1)}%
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}