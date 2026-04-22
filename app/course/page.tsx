import { AppShell } from "@/components/app-shell";
import { UnitCard } from "@/components/lesson-card";
import { Card } from "@/components/ui";
import { fullCourseCatalog, sourceMaterials } from "@/lib/course-catalog";
import { units } from "@/lib/learning-data";

export default function CoursePage() {
  return (
    <AppShell title="Course Map">
      <Card className="mb-6 bg-charcoal text-cream dark:bg-black">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Beginner to advanced</p>
        <h2 className="mt-3 font-display text-5xl font-bold">Follow the thread from fidel to fluent nuance.</h2>
        <p className="mt-4 max-w-3xl text-cream/72">
          Units open in gentle arcs: script, phrase, sound, structure, conversation, and review. Each stop blends
          vocabulary drills, listening, speaking, writing, and mixed translation.
        </p>
      </Card>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit, index) => (
          <UnitCard key={unit.id} unit={unit} index={index} />
        ))}
      </div>
      <Card className="mt-6">
        <h2 className="font-display text-4xl font-bold">Source library</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/64 dark:text-cream/64">
          Your worksheets, textbook, model exams, literature PDFs, poetry, and audio are organized into teaching tracks.
          Longer books are used for summaries, vocabulary, themes, questions, and short excerpt practice rather than full public republication.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sourceMaterials.map((source) => (
            <div key={source.group} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
              <h3 className="font-display text-3xl font-bold">{source.group}</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{source.use}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-leaf dark:text-saffron">
                {source.files.length} source files
              </p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-6">
        <h2 className="font-display text-4xl font-bold">Chapter-by-chapter curriculum</h2>
        <div className="mt-5 grid gap-4">
          {fullCourseCatalog.map((unit) => (
            <div key={unit.slug} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf dark:text-saffron">
                    {unit.level.replace("_", " ")}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold">{unit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{unit.description}</p>
                  <p className="mt-2 text-xs font-semibold text-charcoal/52 dark:text-cream/52">Based on: {unit.source}</p>
                </div>
                <p className="rounded-full bg-leaf px-4 py-2 text-sm font-black text-cream">{unit.lessons.length} chapters</p>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {unit.lessons.map(([slug, title, description, exercises], index) => (
                  <div key={slug} className="rounded-2xl bg-parchment p-4 dark:bg-charcoal/72">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-leaf dark:text-saffron">
                      Chapter {index + 1}
                    </p>
                    <h4 className="mt-1 font-display text-2xl font-bold">{title}</h4>
                    <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exercises.map((exercise) => (
                        <span
                          key={exercise}
                          className="rounded-full bg-leaf/10 px-3 py-1 text-xs font-bold text-leaf dark:bg-saffron/12 dark:text-saffron"
                        >
                          {exercise}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
