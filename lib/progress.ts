type Progress = {
  xp: number;
  streak: number;
  lastCompletedDate: string | null;
  completedLessons: string[];
};

const KEY = "coptic-progress";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function getProgress(): Progress {
  if (typeof window === "undefined") {
    return { xp: 0, streak: 0, lastCompletedDate: null, completedLessons: [] };
  }

  const stored = localStorage.getItem(KEY);
  if (!stored) {
    return { xp: 0, streak: 0, lastCompletedDate: null, completedLessons: [] };
  }

  return JSON.parse(stored);
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function addXpAndAdvanceStreak({
  lessonId,
  xpEarned,
}: {
  lessonId: string;
  xpEarned: number;
}) {
  const progress = getProgress();
  const today = getToday();

  progress.xp += xpEarned;

  if (progress.lastCompletedDate !== today) {
    progress.streak += 1;
    progress.lastCompletedDate = today;
  }

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  saveProgress(progress);
}