"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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

type SpecialKey =
  | "backspace"
  | "shift"
  | "space"
  | "return"
  | "toABC"
  | "toNumbers"
  | "toSymbols";

type KeyDef =
  | string
  | {
      key: SpecialKey;
      label?: string;
    };

type PageMode = "ABC" | "NUMBERS" | "SYMBOLS";

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

function removeLastChar(s: string) {
  const chars = Array.from(s);
  chars.pop();
  return chars.join("");
}

function isKeyObj(k: KeyDef): k is { key: SpecialKey; label?: string } {
  return typeof k !== "string";
}

const COPTIC_CASE_MAP: Record<string, string> = {
  "Ϧ": "ϧ",
  "ϧ": "Ϧ",
  "Ⲁ": "ⲁ",
  "ⲁ": "Ⲁ",
  "Ⲃ": "ⲃ",
  "ⲃ": "Ⲃ",
  "Ⲅ": "ⲅ",
  "ⲅ": "Ⲅ",
  "Ⲇ": "ⲇ",
  "ⲇ": "Ⲇ",
  "Ⲉ": "ⲉ",
  "ⲉ": "Ⲉ",
  "Ⲍ": "ⲍ",
  "ⲍ": "Ⲍ",
  "Ⲏ": "ⲏ",
  "ⲏ": "Ⲏ",
  "Ⲑ": "ⲑ",
  "ⲑ": "Ⲑ",
  "Ⲓ": "ⲓ",
  "ⲓ": "Ⲓ",
  "Ⲕ": "ⲕ",
  "ⲕ": "Ⲕ",
  "Ⲗ": "ⲗ",
  "ⲗ": "Ⲗ",
  "Ⲙ": "ⲙ",
  "ⲙ": "Ⲙ",
  "Ⲛ": "ⲛ",
  "ⲛ": "Ⲛ",
  "Ⲝ": "ⲝ",
  "ⲝ": "Ⲝ",
  "Ⲟ": "ⲟ",
  "ⲟ": "Ⲟ",
  "Ⲡ": "ⲡ",
  "ⲡ": "Ⲡ",
  "Ⲣ": "ⲣ",
  "ⲣ": "Ⲣ",
  "Ⲥ": "ⲥ",
  "ⲥ": "Ⲥ",
  "Ⲧ": "ⲧ",
  "ⲧ": "Ⲧ",
  "Ⲩ": "ⲩ",
  "ⲩ": "Ⲩ",
  "Ⲫ": "ⲫ",
  "ⲫ": "Ⲫ",
  "Ⲭ": "ⲭ",
  "ⲭ": "Ⲭ",
  "Ⲯ": "ⲯ",
  "ⲯ": "Ⲯ",
  "Ⲱ": "ⲱ",
  "ⲱ": "Ⲱ",
  "Ϣ": "ϣ",
  "ϣ": "Ϣ",
  "Ϥ": "ϥ",
  "ϥ": "Ϥ",
  "Ϩ": "ϩ",
  "ϩ": "Ϩ",
  "Ϫ": "ϫ",
  "ϫ": "Ϫ",
  "Ϭ": "ϭ",
  "ϭ": "Ϭ",
  "Ϯ": "ϯ",
  "ϯ": "Ϯ",
};

const isCopticLetter = (ch: string) => !!COPTIC_CASE_MAP[ch];

function IconBackspace({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 5H11c-.6 0-1.1.3-1.5.8L4 12l5.5 6.2c.4.5.9.8 1.5.8h9c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm-2.6 10.2-1.2 1.2L14 14.2l-2.2 2.2-1.2-1.2L12.8 13l-2.2-2.2 1.2-1.2L14 11.8l2.2-2.2 1.2 1.2L15.2 13l2.2 2.2Z"
      />
    </svg>
  );
}

function IconShift({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3 4 11h5v6h6v-6h5L12 3Zm1 12H11v-6H9.5L12 6.5 14.5 9H13v6Z"
      />
    </svg>
  );
}

const KB_ABC: KeyDef[][] = [
  ["ϧ", "ⲱ", "ⲉ", "ⲣ", "ⲧ", "ⲏ", "ⲩ", "ⲓ", "ⲟ", "ⲡ"],
  ["ⲁ", "ϣ", "ⲇ", "ⲫ", "ⲅ", "ϩ", "ϫ", "ⲕ", "ⲗ", "ⲑ"],
  ["ⲍ", "ⲝ", "ⲥ", "ϥ", "ⲃ", "ⲛ", "ⲙ", "ⲭ"],
  [{ key: "shift" }, "ⲯ", "ϭ", "ϯ", { key: "backspace" }],
  [{ key: "toNumbers", label: "ⲁ̅ⲃ̅ⲅ̅" }, "̀", { key: "space" }, { key: "return" }],
];

const KB_NUMBERS: KeyDef[][] = [
  ["ⲁ̅", "ⲃ̅", "ⲅ̅", "ⲇ̅", "ⲉ̅", "ⲋ̅", "ⲍ̅", "ⲏ̅", "ⲑ̅", "ⲓ̅"],
  ["ⲕ̅", "ⲗ̅", "ⲙ̅", "ⲛ̅", "ⲝ̅", "ⲟ̅", "ⲡ̅", "ϥ̅", "ⲣ̅"],
  ["ⲥ̅", "ⲧ̅", "ⲩ̅", "ⲫ̅", "ⲭ̅", "ⲯ̅", "ⲱ̅", "ϣ̅", { key: "backspace" }],
  [".", "⳾", ":", "–", "⸗", { key: "backspace" }],
  [{ key: "toSymbols", label: "#+=" }, { key: "toABC", label: "ⲁ̅ⲃ̅ⲅ̅" }, { key: "space" }, { key: "return" }],
];

const KB_SYMBOLS: KeyDef[][] = [
  ["̈", "॓", "̂", "︤", "̄", "︥", "̅", "̿", "̇", "̣"],
  ["́", "̑", "͡", "⳽", "𐋠", "⳰", "⳯", "⳱", "︦", "⸗"],
  ["[", "]", "{", "}", "(", ")", "^", "*", "+", "=", { key: "backspace" }],
  ["|", "~", "-", "_", "<", ">", "”", "’", "!", "?"],
  [{ key: "toABC", label: "ⲁ̅ⲃ̅ⲅ̅" }, ";", ":", "@", "#", "&", ",", ".", "$", "\\", "/", "%", { key: "space" }, { key: "return" }],
];

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [bohairicOnly, setBohairicOnly] = useState(false);
  const [posFilter, setPosFilter] = useState("All");
  const [examplesOnly, setExamplesOnly] = useState(false);
  const [posOpen, setPosOpen] = useState(false);
  const [posSearch, setPosSearch] = useState("");
  const posDropdownRef = useRef<HTMLDivElement | null>(null);

  const [showKeyboard, setShowKeyboard] = useState(true);
  const [mode, setMode] = useState<PageMode>("ABC");
  const [shiftMode, setShiftMode] = useState<"off" | "once" | "lock">("off");
  const lastShiftTapRef = useRef<number>(0);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoadState("loading");

        const bohRes = await fetch("/bohairic_dictionary.json", {
          cache: "no-store",
        });
        const bohRaw = (await bohRes.json()) as BohairicEntryRaw[];

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
      } catch {
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

  const posCounts = useMemo(() => {
    let list = entries;
    if (bohairicOnly) list = list.filter((e) => e.dialect === "boh");
    if (examplesOnly) list = list.filter((e) => hasExamples(e));

    const counts = new Map<string, number>();
    for (const e of list) {
      const p = (e.pos || "").trim();
      if (!p) continue;
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
    return counts;
  }, [entries, bohairicOnly, examplesOnly]);

  const posSearchNorm = posSearch.trim().toLowerCase();
  const displayedPosOptions = useMemo(() => {
    if (!posSearchNorm) return posOptions;
    return posOptions.filter((p) =>
      p === "All" ? "all parts of speech".includes(posSearchNorm) : p.toLowerCase().includes(posSearchNorm)
    );
  }, [posOptions, posSearchNorm]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!posDropdownRef.current) return;
      if (!posDropdownRef.current.contains(event.target as Node)) {
        setPosOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const handleShiftTap = () => {
    const now = Date.now();
    const delta = now - lastShiftTapRef.current;
    lastShiftTapRef.current = now;

    if (shiftMode === "lock") {
      setShiftMode("off");
      return;
    }

    if (delta > 0 && delta < 350) {
      setShiftMode("lock");
      return;
    }

    setShiftMode((prev) => (prev === "off" ? "once" : "off"));
  };

  const applyShiftToChar = (ch: string) => {
    if (!isCopticLetter(ch)) return ch;
    if (shiftMode === "off") return ch;

    const out = COPTIC_CASE_MAP[ch] ?? ch;
    if (shiftMode === "once") setShiftMode("off");
    return out;
  };

  const displayKey = (k: KeyDef) => {
    if (isKeyObj(k)) return k.label ?? "";
    if (!isCopticLetter(k)) return k;
    if (shiftMode === "off") return k;
    return COPTIC_CASE_MAP[k] ?? k;
  };

  const handleKey = (k: KeyDef) => {
    if (isKeyObj(k)) {
      switch (k.key) {
        case "backspace":
          setQuery((q) => removeLastChar(q));
          return;
        case "shift":
          handleShiftTap();
          return;
        case "space":
          setQuery((q) => q + " ");
          return;
        case "return":
          return;
        case "toABC":
          setMode("ABC");
          setShiftMode("off");
          return;
        case "toNumbers":
          setMode("NUMBERS");
          setShiftMode("off");
          return;
        case "toSymbols":
          setMode("SYMBOLS");
          setShiftMode("off");
          return;
      }
    }

    const ch = typeof k === "string" ? k : "";
    if (!ch) return;
    setQuery((q) => q + applyShiftToChar(ch));
  };

  const page: KeyDef[][] = mode === "ABC" ? KB_ABC : mode === "NUMBERS" ? KB_NUMBERS : KB_SYMBOLS;
  const shiftActive = shiftMode !== "off";
  const capsLock = shiftMode === "lock";

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

        <h1 className="mt-7 text-4xl font-semibold tracking-tight">Coptic Dictionary</h1>
        <p className="mt-2 text-white/60">Search lemma, forms, or gloss</p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-3">
            <span className="text-white/50">🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Coptic or English..."
              className="coptic-text w-full bg-transparent text-base outline-none placeholder:text-white/35"
            />
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/5 p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-white/65">Coptic keyboard</span>
              <button
                type="button"
                onClick={() => setShowKeyboard((v) => !v)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/70 hover:bg-white/10"
              >
                {showKeyboard ? "Hide" : "Show"}
              </button>
            </div>

            {showKeyboard ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                {page.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      marginBottom: rIdx === page.length - 1 ? 0 : 10,
                    }}
                  >
                    {row.map((k, i) => {
                      const obj = isKeyObj(k) ? k : null;

                      const isSpace = obj?.key === "space";
                      const isReturn = obj?.key === "return";
                      const isBackspace = obj?.key === "backspace";
                      const isShiftKey = obj?.key === "shift";

                      const flex = isSpace
                        ? 5
                        : isReturn
                        ? 2.2
                        : isBackspace || isShiftKey
                        ? 1.6
                        : obj
                        ? 1.4
                        : 1;

                      const shiftKeyBg = shiftActive ? "white" : "rgba(255,255,255,0.10)";
                      const shiftKeyFg = shiftActive ? "black" : "white";

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleKey(k)}
                          style={{
                            flex,
                            minWidth: 44,
                            height: 56,
                            borderRadius: 14,
                            background: isShiftKey
                              ? shiftKeyBg
                              : obj?.key === "return"
                              ? "rgba(255,255,255,0.18)"
                              : obj?.key === "toNumbers" || obj?.key === "toSymbols" || obj?.key === "toABC"
                              ? "rgba(255,255,255,0.14)"
                              : "rgba(255,255,255,0.10)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: isShiftKey ? shiftKeyFg : "white",
                            fontSize: 20,
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            userSelect: "none",
                            padding: "0 10px",
                            position: "relative",
                          }}
                        >
                          {isBackspace ? (
                            <IconBackspace />
                          ) : isShiftKey ? (
                            <>
                              <IconShift />
                              {capsLock ? (
                                <span
                                  style={{
                                    position: "absolute",
                                    bottom: 8,
                                    width: 18,
                                    height: 3,
                                    borderRadius: 3,
                                    background: "black",
                                    opacity: 0.9,
                                  }}
                                />
                              ) : null}
                            </>
                          ) : isReturn ? (
                            "↩"
                          ) : isSpace ? (
                            ""
                          ) : (
                            <span className="coptic-text">{displayKey(k)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div ref={posDropdownRef} className="relative min-w-[340px] flex-1">
              <button
                type="button"
                onClick={() => setPosOpen((v) => !v)}
                className="flex w-full items-center rounded-xl border border-white/25 bg-transparent px-4 py-2"
                aria-expanded={posOpen}
                aria-haspopup="listbox"
              >
                <span className="text-sm text-white/60">POS</span>
                <span className="ml-4 w-full text-left text-sm text-white">
                  {posFilter === "All" ? "All parts of speech" : posFilter}
                </span>
                <span className="ml-3 text-xs text-white/45">▾</span>
              </button>

              {posOpen ? (
                <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-2xl border border-white/25 bg-black p-3 shadow-[0_12px_28px_rgba(0,0,0,0.7)]">
                  <input
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    placeholder="Filter parts of speech..."
                    className="mb-3 w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/35"
                  />

                  <div className="max-h-80 overflow-auto pr-1">
                    {displayedPosOptions.map((p) => {
                      const isSelected = posFilter === p;
                      const count = p === "All" ? totalAll : posCounts.get(p) ?? 0;

                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPosFilter(p);
                            setPosOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-white/90 hover:bg-white/10"
                          role="option"
                          aria-selected={isSelected}
                        >
                          <span className="text-sm">{p === "All" ? "All parts of speech" : p}</span>
                          <span className="ml-3 text-sm text-white/45">{isSelected ? "✓" : count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setExamplesOnly((v) => !v)}
              className="inline-flex items-center gap-3 rounded-xl border border-white/25 bg-transparent px-4 py-2 text-sm text-white/90"
              aria-pressed={examplesOnly}
            >
              <span
                className={[
                  "relative inline-flex h-7 w-12 rounded-full transition-colors",
                  examplesOnly ? "bg-white/40" : "bg-white/25",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
                    examplesOnly ? "translate-x-6" : "translate-x-1",
                  ].join(" ")}
                />
              </span>
              Has examples
            </button>

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
                  <div className="coptic-text text-2xl font-semibold tracking-tight">{e.lemma}</div>

                  {e.forms.length > 1 && (
                    <div className="mt-1 text-sm text-white/55">
                      Forms:{" "}
                      <span className="coptic-text text-white/70">
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
                    {e.gloss.length > 8 ? <li className="text-white/45">…</li> : null}
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