// app/page.tsx
import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 10 }}>
        Coptic
      </h1>

      <p style={{ opacity: 0.85, marginBottom: 24 }}>
        A real learning flow: lessons → practice → progress.
      </p>

      <div style={{ display: "flex", gap: 12 }}>

        <Link
          href="/learn"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 12,
            background: "white",
            color: "black",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Start Learning →
        </Link>

        <Link
          href="/dictionary"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Dictionary →
        </Link>

      </div>
    </main>
  );
}