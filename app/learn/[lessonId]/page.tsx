// app/learn/[lessonId]/page.tsx
import Link from "next/link";
import { lessons } from "../../../lib/lesson";
import LessonClient from "./LessonClient";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const lesson = lessons.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: 24,
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>Lesson not found</h1>

        <p style={{ opacity: 0.85 }}>
          Tried id: <code>{lessonId}</code>
        </p>

        <p style={{ opacity: 0.85, marginTop: 10 }}>
          Available lesson ids:{" "}
          <code>{lessons.map((l) => l.id).join(", ") || "(none)"}</code>
        </p>

        <p style={{ marginTop: 14 }}>
          <Link href="/learn" style={{ color: "white" }}>
            ← Back to Learn
          </Link>
        </p>
      </main>
    );
  }

  return <LessonClient lessonId={lessonId} />;
}