"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type TranslationPayload = {
  translation?: string;
  confidence?: number;
  dialect?: "sahidic" | "bohairic";
  error?: string;
  details?: string;
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

const COPTIC_CASE_MAP: Record<string, string> = {
  "Ϧ": "ϧ", "ϧ": "Ϧ", "Ⲁ": "ⲁ", "ⲁ": "Ⲁ", "Ⲃ": "ⲃ", "ⲃ": "Ⲃ", "Ⲅ": "ⲅ", "ⲅ": "Ⲅ",
  "Ⲇ": "ⲇ", "ⲇ": "Ⲇ", "Ⲉ": "ⲉ", "ⲉ": "Ⲉ", "Ⲍ": "ⲍ", "ⲍ": "Ⲍ", "Ⲏ": "ⲏ", "ⲏ": "Ⲏ",
  "Ⲑ": "ⲑ", "ⲑ": "Ⲑ", "Ⲓ": "ⲓ", "ⲓ": "Ⲓ", "Ⲕ": "ⲕ", "ⲕ": "Ⲕ", "Ⲗ": "ⲗ", "ⲗ": "Ⲗ",
  "Ⲙ": "ⲙ", "ⲙ": "Ⲙ", "Ⲛ": "ⲛ", "ⲛ": "Ⲛ", "Ⲝ": "ⲝ", "ⲝ": "Ⲝ", "Ⲟ": "ⲟ", "ⲟ": "Ⲟ",
  "Ⲡ": "ⲡ", "ⲡ": "Ⲡ", "Ⲣ": "ⲣ", "ⲣ": "Ⲣ", "Ⲥ": "ⲥ", "ⲥ": "Ⲥ", "Ⲧ": "ⲧ", "ⲧ": "Ⲧ",
  "Ⲩ": "ⲩ", "ⲩ": "Ⲩ", "Ⲫ": "ⲫ", "ⲫ": "Ⲫ", "Ⲭ": "ⲭ", "ⲭ": "Ⲭ", "Ⲯ": "ⲯ", "ⲯ": "Ⲯ",
  "Ⲱ": "ⲱ", "ⲱ": "Ⲱ", "Ϣ": "ϣ", "ϣ": "Ϣ", "Ϥ": "ϥ", "ϥ": "Ϥ", "Ϩ": "ϩ", "ϩ": "Ϩ",
  "Ϫ": "ϫ", "ϫ": "Ϫ", "Ϭ": "ϭ", "ϭ": "Ϭ", "Ϯ": "ϯ", "ϯ": "Ϯ",
};

const isCopticLetter = (ch: string) => !!COPTIC_CASE_MAP[ch];

const removeLastChar = (s: string) => {
  const chars = Array.from(s);
  chars.pop();
  return chars.join("");
};

const isKeyObj = (k: KeyDef): k is { key: SpecialKey; label?: string } => typeof k !== "string";

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

export default function TranslatorPage() {
  const [translationInput, setTranslationInput] = useState("");
  const [translatorDialect, setTranslatorDialect] = useState<"sahidic" | "bohairic">("bohairic");
  const [translationState, setTranslationState] = useState<"idle" | "loading" | "error">("idle");
  const [translationError, setTranslationError] = useState("");
  const [translationOutput, setTranslationOutput] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mode, setMode] = useState<PageMode>("ABC");
  const [shiftMode, setShiftMode] = useState<"off" | "once" | "lock">("off");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastShiftTapRef = useRef<number>(0);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobileViewport(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const hideKeyboardOnManualInputFocus = () => {
    if (!isMobileViewport) return;
    setShowKeyboard(false);
  };

  const page: KeyDef[][] = mode === "ABC" ? KB_ABC : mode === "NUMBERS" ? KB_NUMBERS : KB_SYMBOLS;
  const isCopticMode = mode === "ABC";

  const applyShiftToChar = (ch: string) => {
    if (!isCopticMode || !isCopticLetter(ch) || shiftMode === "off") return ch;
    const out = COPTIC_CASE_MAP[ch] ?? ch;
    if (shiftMode === "once") setShiftMode("off");
    return out;
  };

  const displayKey = (k: KeyDef) => {
    if (isKeyObj(k)) return k.label ?? "";
    if (!isCopticMode || !isCopticLetter(k) || shiftMode === "off") return k;
    return COPTIC_CASE_MAP[k] ?? k;
  };

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

  const handleKey = (k: KeyDef) => {
    if (isKeyObj(k)) {
      switch (k.key) {
        case "backspace":
          setTranslationInput((q) => removeLastChar(q));
          return;
        case "shift":
          if (isCopticMode) handleShiftTap();
          return;
        case "space":
          setTranslationInput((q) => q + " ");
          return;
        case "return":
          inputRef.current?.blur();
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

    const out = applyShiftToChar(typeof k === "string" ? k : "");
    if (!out) return;
    setTranslationInput((q) => q + out);
  };

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
    <main
      className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]"
      style={{
        paddingBottom: isMobileViewport && showKeyboard ? "calc(340px + env(safe-area-inset-bottom, 0px))" : undefined,
      }}
    >
      <div
        className="mx-auto max-w-5xl px-5 py-8"
        style={{
          paddingBottom: isMobileViewport && showKeyboard ? "calc(24px + env(safe-area-inset-bottom, 0px))" : undefined,
        }}
      >
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
              ref={inputRef}
              value={translationInput}
              onChange={(e) => setTranslationInput(e.target.value)}
              onPointerDown={hideKeyboardOnManualInputFocus}
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

          {!isMobileViewport ? (
            <div className="mt-4 rounded-2xl border border-[var(--kb-border)] p-3" style={{ background: "var(--kb-shell)" }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Coptic keyboard</span>
                <button
                  type="button"
                  onClick={() => setShowKeyboard((v) => !v)}
                  className="rounded-full border border-[var(--border-color)] bg-[var(--surface-1)] px-3 py-1 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
                >
                  {showKeyboard ? "Hide" : "Show"}
                </button>
              </div>

              {showKeyboard ? (
                <KeyboardGrid page={page} handleKey={handleKey} displayKey={displayKey} shiftMode={shiftMode} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {isMobileViewport && showKeyboard ? (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            padding: "0 10px calc(8px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setShowKeyboard(false)}
              className="rounded-full border border-[var(--border-color)] bg-[var(--panel-bg)] px-4 py-2 text-xs font-medium text-[var(--text-color)] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            >
              Hide Coptic keyboard
            </button>
          </div>
          <KeyboardGrid page={page} handleKey={handleKey} displayKey={displayKey} shiftMode={shiftMode} mobile />
        </div>
      ) : null}

      {isMobileViewport && !showKeyboard ? (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            type="button"
            onClick={() => setShowKeyboard(true)}
            className="rounded-full border border-[var(--border-color)] bg-[var(--panel-bg)] px-4 py-2 text-xs font-medium text-[var(--text-color)] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          >
            Show Coptic keyboard
          </button>
        </div>
      ) : null}
    </main>
  );
}

function KeyboardGrid({
  page,
  handleKey,
  displayKey,
  shiftMode,
  mobile = false,
}: {
  page: KeyDef[][];
  handleKey: (k: KeyDef) => void;
  displayKey: (k: KeyDef) => string;
  shiftMode: "off" | "once" | "lock";
  mobile?: boolean;
}) {
  const shiftActive = shiftMode !== "off";
  const capsLock = shiftMode === "lock";

  return (
    <div style={{ padding: 12, borderRadius: mobile ? 14 : 16, background: "var(--kb-panel)", border: "1px solid var(--kb-border)" }}>
      {page.map((row, rIdx) => (
        <div key={rIdx} style={{ display: "flex", gap: mobile ? 6 : 8, justifyContent: "center", marginBottom: rIdx === page.length - 1 ? 0 : mobile ? 8 : 10 }}>
          {row.map((k, i) => {
            const obj = isKeyObj(k) ? k : null;
            const isSpace = obj?.key === "space";
            const isReturn = obj?.key === "return";
            const isBackspace = obj?.key === "backspace";
            const isShiftKey = obj?.key === "shift";
            const flex = isSpace ? 5 : isReturn ? 2.2 : isBackspace || isShiftKey ? 1.6 : obj ? 1.4 : 1;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleKey(k)}
                style={{
                  flex,
                  minWidth: mobile ? 0 : 44,
                  height: mobile ? 50 : 56,
                  borderRadius: mobile ? 12 : 14,
                  background: isShiftKey
                    ? shiftActive
                      ? "var(--accent-color)"
                      : "var(--kb-key)"
                    : obj?.key === "return"
                    ? "var(--kb-key-return)"
                    : obj?.key === "toNumbers" || obj?.key === "toSymbols" || obj?.key === "toABC"
                    ? "var(--kb-key-alt)"
                    : "var(--kb-key)",
                  border: "1px solid var(--kb-border)",
                  color: isShiftKey ? (shiftActive ? "var(--accent-contrast-color)" : "var(--kb-text)") : "var(--kb-text)",
                  fontSize: mobile ? 18 : 20,
                  fontWeight: 700,
                  fontFamily: "var(--coptic-font-family)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  userSelect: "none",
                  padding: mobile ? "0 6px" : "0 10px",
                  position: "relative",
                }}
              >
                {isBackspace ? <IconBackspace /> : isShiftKey ? <><IconShift />{capsLock ? <span style={{ position: "absolute", bottom: 8, width: 18, height: 3, borderRadius: 3, background: "var(--accent-contrast-color)", opacity: 0.9 }} /> : null}</> : isReturn ? "↩" : isSpace ? "" : <span className="coptic-text">{displayKey(k)}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}