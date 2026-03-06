"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { lessons } from "../../../lib/lesson";

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

function normalize(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

function removeLastChar(s: string) {
  const chars = Array.from(s);
  chars.pop();
  return chars.join("");
}

function isKeyObj(k: KeyDef): k is { key: SpecialKey; label?: string } {
  return typeof k !== "string";
}

/**
 * Manual case map (both directions).
 */
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

// Icons (no deps)
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

/**
 * ABC page should be LOWERCASE by default (matches iOS behavior).
 * Mode switching:
 * ABC -> ⲁ̅ⲃ̅ⲅ̅ to Numbers -> #+= to Symbols -> ⲁ̅ⲃ̅ⲅ̅ back to ABC
 */

// ABC (lowercase default)
const KB_ABC: KeyDef[][] = [
  ["ϧ", "ⲱ", "ⲉ", "ⲣ", "ⲧ", "ⲏ", "ⲩ", "ⲓ", "ⲟ", "ⲡ"],
  ["ⲁ", "ϣ", "ⲇ", "ⲫ", "ⲅ", "ϩ", "ϫ", "ⲕ", "ⲗ", "ⲑ"],
  ["ⲍ", "ⲝ", "ⲥ", "ϥ", "ⲃ", "ⲛ", "ⲙ", "ⲭ"],
  // single shift + ONE backspace (removed duplicate backspace)
  [{ key: "shift" }, "ⲯ", "ϭ", "ϯ", { key: "backspace" }],
  [{ key: "toNumbers", label: "ⲁ̅ⲃ̅ⲅ̅" }, "̀", { key: "space" }, { key: "return" }],
];

// Numbers
const KB_NUMBERS: KeyDef[][] = [
  ["ⲁ̅", "ⲃ̅", "ⲅ̅", "ⲇ̅", "ⲉ̅", "ⲋ̅", "ⲍ̅", "ⲏ̅", "ⲑ̅", "ⲓ̅"],
  ["ⲕ̅", "ⲗ̅", "ⲙ̅", "ⲛ̅", "ⲝ̅", "ⲟ̅", "ⲡ̅", "ϥ̅", "ⲣ̅"],
  ["ⲥ̅", "ⲧ̅", "̅", "ⲫ̅", "ⲭ̅", "ⲯ̅", "ⲱ̅", "ϣ̅", { key: "backspace" }],
  [".", "⳾", ":", "–", "⸗", { key: "backspace" }],
  [{ key: "toSymbols", label: "#+=" }, { key: "toABC", label: "ⲁ̅ⲃ̅ⲅ̅" }, { key: "space" }, { key: "return" }],
];

// Symbols
const KB_SYMBOLS: KeyDef[][] = [
  ["̈", "॓", "̂", "︤", "̄", "︥", "̅", "̿", "̇", "̣"],
  ["́", "̑", "͡", "⳽", "𐋠", "⳰", "⳯", "⳱", "︦", "⸗"],
  ["[", "]", "{", "}", "(", ")", "^", "*", "+", "=", { key: "backspace" }],
  ["|", "~", "-", "_", "<", ">", "”", "’", "!", "?"],
  [{ key: "toABC", label: "ⲁ̅ⲃ̅ⲅ̅" }, ";", ":", "@", "#", "&", ",", ".", "$", "\\", "/", "%", { key: "space" }, { key: "return" }],
];

export default function LessonClient({ lessonId }: { lessonId: string }) {
  const lesson = useMemo(() => lessons.find((l) => l.id === lessonId), [lessonId]);

  const [stepIndex, setStepIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const [mode, setMode] = useState<PageMode>("ABC");
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  // shiftMode:
  // - "off" = lowercase
  // - "once" = next letter uppercased, then off
  // - "lock" = caps lock
  const [shiftMode, setShiftMode] = useState<"off" | "once" | "lock">("off");
  const lastShiftTapRef = useRef<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [stepIndex, mode]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobileViewport(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!lesson) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, color: "white" }}>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>Lesson not found</h1>
        <p style={{ opacity: 0.85 }}>That lesson id doesn’t exist.</p>
        <p style={{ marginTop: 14 }}>
          <Link href="/learn" style={{ color: "white" }}>
            ← Back to Learn
          </Link>
        </p>
      </main>
    );
  }

  const step = lesson.steps[stepIndex];
  const expected = step.answer;

  const check = () => {
    const ok = normalize(typed) === normalize(expected);
    setStatus(ok ? "correct" : "wrong");
  };

  const next = () => {
    const isLast = stepIndex >= lesson.steps.length - 1;
    if (isLast) {
      setTyped("");
      setStatus("idle");
      setShiftMode("off");
      return;
    }
    setStepIndex((i) => i + 1);
    setTyped("");
    setStatus("idle");
    setShiftMode("off");
  };

  const handleShiftTap = () => {
    const now = Date.now();
    const delta = now - lastShiftTapRef.current;
    lastShiftTapRef.current = now;

    // If caps lock is on, pressing shift once disables it (your request)
    if (shiftMode === "lock") {
      setShiftMode("off");
      return;
    }

    // Double tap within 350ms => caps lock
    if (delta > 0 && delta < 350) {
      setShiftMode("lock");
      return;
    }

    // Single tap toggles once mode on/off
    setShiftMode((prev) => (prev === "off" ? "once" : "off"));
  };

  const applyShiftToChar = (ch: string) => {
    if (!isCopticLetter(ch)) return ch;

    // shiftMode off => keep lowercase as defined in KB_ABC
    if (shiftMode === "off") return ch;

    // toggle case
    const out = COPTIC_CASE_MAP[ch] ?? ch;

    // if single shift, revert after one key press
    if (shiftMode === "once") setShiftMode("off");

    return out;
  };

  const page: KeyDef[][] = mode === "ABC" ? KB_ABC : mode === "NUMBERS" ? KB_NUMBERS : KB_SYMBOLS;

  // This makes the keyboard DISPLAY flip too (not just the output)
  const displayKey = (k: KeyDef) => {
    if (isKeyObj(k)) return k.label ?? "";
    if (!isCopticLetter(k)) return k;

    // If shift is active (once or lock), show the toggled version
    if (shiftMode === "off") return k;
    return COPTIC_CASE_MAP[k] ?? k;
  };

  const handleKey = (k: KeyDef) => {
    inputRef.current?.focus();

    if (isKeyObj(k)) {
      switch (k.key) {
        case "backspace":
          setTyped((t) => removeLastChar(t));
          setStatus("idle");
          return;

        case "shift":
          handleShiftTap();
          return;

        case "space":
          setTyped((t) => t + " ");
          setStatus("idle");
          return;

        case "return":
          check();
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

    const out = applyShiftToChar(ch);

    setTyped((t) => t + out);
    setStatus("idle");
  };

  const shiftActive = shiftMode !== "off";
  const capsLock = shiftMode === "lock";

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        color: "white",
        paddingBottom: isMobileViewport ? "calc(360px + env(safe-area-inset-bottom, 0px))" : 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <div style={{ opacity: 0.85, marginBottom: 6 }}>{lesson.title}</div>
          <h1 style={{ fontSize: 28, margin: 0 }}>Step {stepIndex + 1}</h1>
        </div>
        <Link href="/learn" style={{ color: "white" }}>
          ← Back
        </Link>
      </div>

      <p style={{ marginTop: 18, fontSize: 18 }}>{step.prompt}</p>

      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => {
          setTyped(e.target.value);
          setStatus("idle");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") check();
        }}
        placeholder="Type here..."
        autoFocus
        spellCheck={false}
        autoComplete="off"
        style={{
          marginTop: 14,
          width: "100%",
          padding: 14,
          borderRadius: 12,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          minHeight: 56,
          fontSize: 26,
          color: "white",
          outline: "none",
          fontFamily: "var(--coptic-font-family)",
          fontWeight: 500,
        }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={check}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "white",
            color: "black",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
          }}
        >
          Check
        </button>

        <button
          onClick={() => {
            setTyped("");
            setStatus("idle");
            setShiftMode("off");
            inputRef.current?.focus();
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.10)",
            color: "white",
            fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.18)",
            cursor: "pointer",
          }}
        >
          Clear
        </button>

        {status === "correct" ? (
          <span style={{ color: "#7CFC9A", fontWeight: 800 }}>Correct ✅</span>
        ) : status === "wrong" ? (
          <span style={{ color: "#FF6B6B", fontWeight: 800 }}>
            Not quite — expected: <span className="coptic-text" style={{ opacity: 0.9 }}>{expected}</span>
          </span>
        ) : null}
      </div>

      {status === "correct" ? (
        <div style={{ marginTop: 14 }}>
          <button
            onClick={next}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.10)",
              color: "white",
              fontWeight: 800,
              border: "1px solid rgba(255,255,255,0.18)",
              cursor: "pointer",
            }}
          >
            Next →
          </button>
        </div>
      ) : null}

      {/* Keyboard */}
      <div
        style={{
          marginTop: 18,
          position: isMobileViewport ? "fixed" : "static",
          left: isMobileViewport ? 0 : undefined,
          right: isMobileViewport ? 0 : undefined,
          bottom: isMobileViewport ? 0 : undefined,
          zIndex: isMobileViewport ? 50 : undefined,
          background: isMobileViewport ? "rgba(6,6,7,0.96)" : undefined,
          borderTop: isMobileViewport ? "1px solid rgba(255,255,255,0.12)" : undefined,
          backdropFilter: isMobileViewport ? "blur(10px)" : undefined,
          padding: isMobileViewport ? "10px 10px calc(8px + env(safe-area-inset-bottom, 0px))" : undefined,
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: isMobileViewport ? 14 : 16,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            maxWidth: isMobileViewport ? "100%" : undefined,
          }}
        >
          {page.map((row, rIdx) => (
            <div
              key={rIdx}
              style={{
                display: "flex",
                gap: isMobileViewport ? 6 : 8,
                justifyContent: "center",
                marginBottom: rIdx === page.length - 1 ? 0 : isMobileViewport ? 8 : 10,
              }}
            >
              {row.map((k, i) => {
                const obj = isKeyObj(k) ? k : null;

                const isSpace = obj?.key === "space";
                const isReturn = obj?.key === "return";
                const isBackspace = obj?.key === "backspace";
                const isShiftKey = obj?.key === "shift";

                const flex = isSpace ? 5 : isReturn ? 2.2 : isBackspace || isShiftKey ? 1.6 : obj ? 1.4 : 1;

                const shiftKeyBg = shiftActive ? "white" : "rgba(255,255,255,0.10)";
                const shiftKeyFg = shiftActive ? "black" : "white";

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleKey(k)}
                    style={{
                      flex,
                      minWidth: isMobileViewport ? 0 : 44,
                      height: isMobileViewport ? 50 : 56,
                      borderRadius: isMobileViewport ? 12 : 14,
                      background: isShiftKey
                        ? shiftKeyBg
                        : obj?.key === "return"
                        ? "rgba(255,255,255,0.18)"
                        : obj?.key === "toNumbers" || obj?.key === "toSymbols" || obj?.key === "toABC"
                        ? "rgba(255,255,255,0.14)"
                        : "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: isShiftKey ? shiftKeyFg : "white",
                      fontSize: isMobileViewport ? 18 : 20,
                      fontWeight: 700,
                      fontFamily: "var(--coptic-font-family)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      userSelect: "none",
                      padding: isMobileViewport ? "0 6px" : "0 10px",
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
      </div>

      <div style={{ marginTop: 22, opacity: 0.55, fontSize: 12 }}>
        Lesson id: {lesson.id} • Step id: {step.id}
      </div>
    </main>
  );
}