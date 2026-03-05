// lib/lesson.ts

export type LessonStep = {
  id: string;
  prompt: string;
  answer: string;
};

export type Lesson = {
  id: string; // must match /learn/[lessonId]
  title: string;
  steps: LessonStep[];
};

export const lessons: Lesson[] = [
  {
    id: "lesson1",
    title: "Lesson 1 (Basics)",
    steps: [
      {
        id: "s1",
        prompt: 'Type the Coptic word for "health / wellbeing".',
        answer: "ⲟⲩϫⲁⲓ",
      },
    ],
  },
];