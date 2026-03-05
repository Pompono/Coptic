"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BohExample = { sentence: string; translation: string; source?: string };
type BohairicEntryRaw = {
  word: string;
  tla_id?: string;
  entry_url?: string;
  bohairic_variants?: string[];
  pos?: string;
  scriptorium_tag?: string;
  greek_origin?: string;
  senses?: string[];
  bohairic_examples?: BohExample[];
};

type CombinedEntryRaw = {
  lemma: string;
  forms?: string[];
  pos?: string;
  gloss?: string[];
  hasGloss?: boolean;
  source?: string;
  license?: string;
};

type Entry = {
  lemma: string;
  forms: string[];
  pos: string;
  gloss: string[];
  dialect: "boh" | "unknown";
  entryUrl?: string;
  tag?: string;
  greek?: string;
  examples?: BohExample[];
};

function norm(s: string) {
  return (s || "").toLowerCase().normalize("NFKC").trim();
}

function hasExamples(e: Entry) {
  return !!(e.examples && e.examples.length > 0);
}

function uniqueStrings(arr: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of arr) {
    const t = (x ?? "").toString().trim();
    if (!t) continue;
    const k = t.normalize("NFKC");
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [bohairicOnly, setBohairicOnly] = useState(false);
  const [posFilter, setPosFilter] = useState("All");
  const [examplesOnly, setExamplesOnly] = useState(false);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoadState("loading");

        // Bohairic-only scraped dataset
        const bohRes = await fetch("/bohairic_dictionary.json", {
          cache: "no-store",
        });
        const bohRaw = (await bohRes.json()) as BohairicEntryRaw[];

        // Larger combined dataset
        const comboRes = await fetch("/coptic_dictionary_combined.json", {
          cache: "no-store",
        });
        const comboRaw = (await comboRes.json()) as CombinedEntryRaw[];

        const bohEntries: Entry[] = bohRaw.map((r) => ({
          lemma: r.word,
          forms: uniqueStrings([r.word, ...(r.bohairic_variants ?? [])]),
          pos: r.pos ?? "",
          gloss: uniqueStrings(r.senses ?? []),
          dialect: "boh",
          entryUrl: r.entry_url,
          tag: r.scriptorium_tag,
          greek: r.greek_origin,
          examples: r.bohairic_examples ?? [],
        }));

        const comboEntries: Entry[] = comboRaw.map((r) => ({
          lemma: r.lemma,
          forms: uniqueStrings([r.lemma, ...(r.forms ?? [])]),
          pos: r.pos ?? "",
          gloss: uniqueStrings(r.gloss ?? []),
          dialect: "unknown",
        }));

        const merged = [...bohEntries, ...comboEntries];

        // Dedup only exact duplicates (same lemma + pos + dialect + gloss+forms)
        const seen = new Set<string>();
        const deduped: Entry[] = [];
        for (const e of merged) {
          const key =
            e.lemma +
            "|" +
            e.pos +
            "|" +
            e.dialect +
            "|" +
            e.forms.join(",") +
            "|" +
            e.gloss.join(",");
          if (seen.has(key)) continue;
          seen.add(key);
          deduped.push(e);
        }

        if (!cancelled) {
          setEntries(deduped);
          setLoadState("ready");
        }
      } catch (e) {
        if (!cancelled) setLoadState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const posOptions = useMemo(() => {
    const s = new Set<string>();
    for (const e of entries) {
      const p = (e.pos || "").trim();
      if (p) s.add(p);
    }
    return ["All", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = norm(query);

    let list = entries;

    if (bohairicOnly) list = list.filter((e) => e.dialect === "boh");
    if (examplesOnly) list = list.filter((e) => hasExamples(e));
    if (posFilter !== "All") list = list.filter((e) => e.pos === posFilter);

    if (!q) {
      // Default ordering: Bohairic first, then lemma alpha
      return list
        .slice()
        .sort((a, b) =>
          a.dialect !== b.dialect
            ? a.dialect === "boh"
              ? -1
              : 1
            : a.lemma.localeCompare(b.lemma)
        )
        .slice(0, 80);
    }

    // Search across lemma/forms/gloss
    const scored: Array<{ e: Entry; score: number }> = [];
    for (const e of list) {
      const lemma = norm(e.lemma);
      const forms = e.forms.map(norm);
      const gloss = e.gloss.map(norm);

      let score = 0;

      if (lemma === q) score += 100;
      else if (lemma.startsWith(q)) score += 60;
      else if (lemma.includes(q)) score += 40;

      if (forms.some((f) => f === q)) score += 35;
      else if (forms.some((f) => f.startsWith(q))) score += 25;
      else if (forms.some((f) => f.includes(q))) score += 15;

      if (gloss.some((g) => g.includes(q))) score += 10;

      if (score > 0) {
        // Prefer Bohairic when ties
        if (e.dialect === "boh") score += 3;
        scored.push({ e, score });
      }
    }

    scored.sort((a, b) => b.score - a.score || a.e.lemma.localeCompare(b.e.lemma));
    return scored.map((x) => x.e).slice(0, 80);
  }, [entries, query, bohairicOnly, posFilter, examplesOnly]);

  const totalShown = filtered.length;
  const totalAll = useMemo(() => {
    let list = entries;
    if (bohairicOnly) list = list.filter((e) => e.dialect === "boh");
    if (examplesOnly) list = list.filter((e) => hasExamples(e));
    if (posFilter !== "All") list = list.filter((e) => e.pos === posFilter);
    return list.length;
  }, [entries, bohairicOnly, examplesOnly, posFilter]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
          >
            ← Home
          </Link>

          <button
            type="button"
            onClick={() => setBohairicOnly((v) => !v)}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
              bohairicOnly
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10",
            ].join(" ")}
            aria-pressed={bohairicOnly}
          >
            <span
              className={[
                "h-2.5 w-2.5 rounded-full",
                bohairicOnly ? "bg-emerald-300" : "bg-white/30",
              ].join(" ")}
            />
            Bohairic-only
          </button>
        </div>

        <h1 className="mt-7 text-4xl font-semibold tracking-tight">
          Coptic Dictionary
        </h1>
        <p className="mt-2 text-white/60">Search lemma, forms, or gloss</p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-3">
            <span className="text-white/50">🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Coptic or English..."
              className="w-full bg-transparent text-base outline-none placeholder:text-white/35"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2">
              <span className="text-sm text-white/60">POS</span>
              <select
                value={posFilter}
                onChange={(e) => setPosFilter(e.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                {posOptions.map((p) => (
                  <option key={p} value={p} className="bg-black">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={examplesOnly}
                onChange={(e) => setExamplesOnly(e.target.checked)}
                className="h-4 w-4 accent-emerald-400"
              />
              Has examples
            </label>

            <div className="text-sm text-white/55">
              {loadState === "loading" ? (
                <span>Loading…</span>
              ) : loadState === "error" ? (
                <span className="text-red-300">Failed to load dictionary files.</span>
              ) : (
                <span>
                  {totalShown} shown • {totalAll} total •{" "}
                  <span className="text-white/70">
                    Badge: <b>Bohairic</b> = verified Bohairic; <b>Unknown</b> = dialect not guaranteed.
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((e, idx) => (
            <div
              key={`${e.dialect}-${e.lemma}-${e.pos}-${idx}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold tracking-tight">
                    {e.lemma}
                  </div>

                  {e.forms.length > 1 && (
                    <div className="mt-1 text-sm text-white/55">
                      Forms:{" "}
                      <span className="text-white/70">
                        {e.forms.filter((x) => x !== e.lemma).slice(0, 8).join(", ")}
                      </span>
                      {e.forms.length > 9 ? <span className="text-white/40"> …</span> : null}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span
                    className={[
                      "rounded-full border px-3 py-1 text-xs",
                      e.dialect === "boh"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                        : "border-white/15 bg-white/5 text-white/70",
                    ].join(" ")}
                  >
                    {e.dialect === "boh" ? "Bohairic" : "Unknown"}
                  </span>

                  {e.pos ? (
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                      {e.pos}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/65">
                {e.tag ? <span>Tag: {e.tag}</span> : null}
                {e.greek ? <span>Greek: {e.greek}</span> : null}

                <Link
                  href={`/dictionary/${encodeURIComponent(e.lemma)}`}
                  className="text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white"
                >
                  View entry
                </Link>
              </div>

              <div className="mt-4">
                {e.gloss.length ? (
                  <ul className="list-disc space-y-1 pl-5 text-white/85">
                    {e.gloss.slice(0, 8).map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                    {e.gloss.length > 8 ? (
                      <li className="text-white/45">…</li>
                    ) : null}
                  </ul>
                ) : (
                  <div className="text-sm text-white/45">No gloss.</div>
                )}
              </div>

              {hasExamples(e) ? (
                <div className="mt-4 text-sm text-white/70">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                    Includes examples
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}