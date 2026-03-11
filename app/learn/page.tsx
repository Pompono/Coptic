// app/learn/page.tsx
import Link from "next/link";
import { lessons } from "@/lib/lesson";

export default function LearnIndexPage() {
  const first = lessons[0];

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 14 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            border: "1px solid var(--border-color)",
            background: "var(--surface-1)",
            color: "var(--text-color)",
            textDecoration: "none",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          ← Home
        </Link>
      </div>

      <h1 style={{ fontSize: 40, marginBottom: 8 }}>Learn</h1>

      {first ? (
        <Link
          href={`/learn/${first.id}`}
          style={{
            display: "inline-block",
            padding: "12px 16px",
            borderRadius: 12,
            background: "var(--accent-color)",
            color: "var(--accent-contrast-color)",
            fontWeight: 800,
            textDecoration: "none",
            marginBottom: 22,
          }}
        >
          Start Lesson →
        </Link>
      ) : (
        <p>No lessons yet.</p>
      )}

      <h2 style={{ marginTop: 18, marginBottom: 8 }}>All Lessons</h2>
      <ul style={{ paddingLeft: 18, lineHeight: 1.9 }}>
        {lessons.map((l) => (
          <li key={l.id}>
            <Link href={`/learn/${l.id}`}>{l.title}</Link>{" "}
            <span style={{ opacity: 0.7 }}>({l.id})</span>
          </li>
        ))}
      </ul>
    </main>
  );
}