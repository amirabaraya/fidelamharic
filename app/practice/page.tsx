import { AppShell } from "@/components/app-shell";
import { PracticeLab } from "@/components/practice-lab";
import { getCurrentLearner } from "@/lib/learner";
import { prisma } from "@/lib/prisma";

export default async function PracticePage() {
  const learner = await getCurrentLearner();
  const exercises = await prisma.exercise.findMany({
    where: {
      amharicText: { not: null },
      transliteration: { not: null },
      englishText: { not: null },
      lesson: { published: true }
    },
    orderBy: [{ lesson: { unit: { order: "asc" } } }, { lesson: { order: "asc" } }, { order: "asc" }],
    take: 18,
    select: {
      id: true,
      amharicText: true,
      transliteration: true,
      englishText: true,
      prompt: true,
      lesson: {
        select: {
          title: true,
          slug: true,
          unit: { select: { title: true } }
        }
      }
    }
  });

  return (
    <AppShell title="Practice" learner={learner}>
      <PracticeLab phrases={exercises.map((exercise) => ({
        id: exercise.id,
        amharic: exercise.amharicText ?? "",
        transliteration: exercise.transliteration ?? "",
        english: exercise.englishText ?? "",
        prompt: exercise.prompt,
        lessonTitle: exercise.lesson.title,
        lessonSlug: exercise.lesson.slug,
        unitTitle: exercise.lesson.unit.title
      }))} />
    </AppShell>
  );
}
