import bcrypt from "bcryptjs";
import { PrismaClient, ExerciseType, Level } from "@prisma/client";
import { fullCourseCatalog } from "../lib/course-catalog";

const prisma = new PrismaClient();

type SeedExercise = {
  type: ExerciseType;
  prompt: string;
  amharicText?: string;
  transliteration?: string;
  englishText?: string;
  options?: string[];
  answer: string[];
  explanation?: string;
};

type SeedLesson = {
  slug: string;
  title: string;
  description: string;
  xpReward: number;
  durationMin: number;
  order: number;
  exercises: SeedExercise[];
};

type SeedUnit = {
  slug: string;
  title: string;
  description: string;
  level: Level;
  order: number;
  lessons: SeedLesson[];
};

async function main() {
  const passwordHash = await bcrypt.hash("fidelamharic-demo", 12);

  const user = await prisma.user.upsert({
    where: { email: "maya@example.com" },
    update: {},
    create: {
      name: "Maya Tesfaye",
      email: "maya@example.com",
      passwordHash,
      xp: 4280,
      streak: 18,
      hearts: 4,
      dailyGoal: 45
    }
  });

  const examples = [
    { amharicText: "ሰላም", transliteration: "selam", englishText: "hello / peace" },
    { amharicText: "ቡና", transliteration: "buna", englishText: "coffee" },
    { amharicText: "እናቴ", transliteration: "enate", englishText: "my mother" },
    { amharicText: "አስር ብር", transliteration: "asir birr", englishText: "ten birr" },
    { amharicText: "ቤቴ", transliteration: "bete", englishText: "my home" },
    { amharicText: "አመሰግናለሁ", transliteration: "ameseginalehu", englishText: "thank you" }
  ];

  const units: SeedUnit[] = fullCourseCatalog.map((unit, unitIndex) => ({
    slug: unit.slug,
    title: unit.title,
    description: unit.description,
    level: Level[unit.level],
    order: unitIndex + 1,
    lessons: unit.lessons.map(([slug, title, description], lessonIndex) => {
      const example = examples[(unitIndex + lessonIndex) % examples.length];
      return {
        slug,
        title,
        description,
        xpReward: 25 + unitIndex * 5,
        durationMin: 8 + lessonIndex,
        order: lessonIndex + 1,
        exercises: [
          {
            type: ExerciseType.TRANSLATION,
            prompt: `Translate: ${example.englishText}`,
            amharicText: example.amharicText,
            transliteration: example.transliteration,
            englishText: example.englishText,
            options: [example.amharicText, "ውሃ", "ቤት", "እንጀራ"],
            answer: [example.amharicText],
            explanation: "Connect meaning first, then reinforce the fidel spelling."
          },
          {
            type: ExerciseType.PRONUNCIATION,
            prompt: `Record the phrase: ${example.transliteration}`,
            amharicText: example.amharicText,
            transliteration: example.transliteration,
            englishText: example.englishText,
            answer: [example.transliteration]
          },
          {
            type: ExerciseType.FLASHCARD,
            prompt: `What does ${example.amharicText} mean?`,
            amharicText: example.amharicText,
            transliteration: example.transliteration,
            englishText: example.englishText,
            options: [example.englishText, "water", "home", "bread"],
            answer: [example.englishText]
          }
        ]
      };
    })
  }));

  for (const unit of units) {
    const createdUnit = await prisma.courseUnit.upsert({
      where: { slug: unit.slug },
      update: {
        title: unit.title,
        description: unit.description,
        level: unit.level,
        order: unit.order
      },
      create: {
        slug: unit.slug,
        title: unit.title,
        description: unit.description,
        level: unit.level,
        order: unit.order
      }
    });

    for (const lesson of unit.lessons) {
      const createdLesson = await prisma.lesson.upsert({
        where: { slug: lesson.slug },
        update: {
          title: lesson.title,
          description: lesson.description,
          xpReward: lesson.xpReward,
          durationMin: lesson.durationMin,
          order: lesson.order,
          published: true,
          unitId: createdUnit.id
        },
        create: {
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          xpReward: lesson.xpReward,
          durationMin: lesson.durationMin,
          order: lesson.order,
          published: true,
          unitId: createdUnit.id
        }
      });

      await prisma.exercise.deleteMany({ where: { lessonId: createdLesson.id } });
      await prisma.exercise.createMany({
        data: lesson.exercises.map((exercise, index) => ({
          lessonId: createdLesson.id,
          type: exercise.type,
          prompt: exercise.prompt,
          amharicText: exercise.amharicText,
          transliteration: exercise.transliteration,
          englishText: exercise.englishText,
          options: exercise.options ?? undefined,
          answer: exercise.answer,
          explanation: exercise.explanation,
          order: index + 1
        }))
      });

      await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: createdLesson.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          lessonId: createdLesson.id,
          percent: lesson.order === 1 ? 72 : 0,
          correct: 8,
          attempts: 9
        }
      });
    }
  }

  const badges = [
    ["fidel-keeper", "Fidel Keeper", "Finished the first fidel sequence."],
    ["coffee-chat", "Coffee Chat", "Completed a market coffee conversation."],
    ["streak-18", "18-Day Flame", "Kept an 18 day streak."]
  ] as const;

  for (const [slug, name, description] of badges) {
    const badge = await prisma.badge.upsert({
      where: { slug },
      update: { name, description },
      create: { slug, name, description }
    });

    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: user.id,
          badgeId: badge.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        badgeId: badge.id
      }
    });
  }

  await prisma.reviewCard.deleteMany({ where: { userId: user.id } });
  await prisma.reviewCard.createMany({
    data: [
      { userId: user.id, front: "Coffee", back: "ቡና", strength: 84, intervalDays: 3 },
      { userId: user.id, front: "Thank you", back: "አመሰግናለሁ", strength: 68, intervalDays: 2 },
      { userId: user.id, front: "My home", back: "ቤቴ", strength: 41, intervalDays: 1 }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
