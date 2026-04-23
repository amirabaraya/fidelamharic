"use client";

import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Keyboard, Mic2, Play, Repeat, Shuffle, Waves } from "lucide-react";
import { Button, Card, ProgressBar } from "@/components/ui";
import { practiceSets } from "@/lib/learning-data";
import { getSpeechRecognition, scoreTranscript, speakText } from "@/lib/speech";

type PracticePhrase = {
  id: string;
  amharic: string;
  transliteration: string;
  english: string;
  prompt: string;
  lessonTitle: string;
  lessonSlug: string;
  unitTitle: string;
};

const fallbackPhrases: PracticePhrase[] = [
  {
    id: "fallback-selam",
    amharic: "ሰላም",
    transliteration: "selam",
    english: "hello / peace",
    prompt: "Listen and say hello.",
    lessonTitle: "Meet fidel",
    lessonSlug: "meet-fidel",
    unitTitle: "Fidel Foundations"
  }
];

export function PracticeLab({ phrases }: { phrases: PracticePhrase[] }) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("Ready when you are.");
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const phraseList = phrases.length ? phrases : fallbackPhrases;
  const phrase = phraseList[index] ?? phraseList[0];
  const simpleMeaning = phrase.english.toLowerCase().split(" / ")[0].trim();
  const tip = `Break it into syllables: ${phrase.transliteration}. Understand "${phrase.english}" first, then connect it to the fidel spelling.`;

  const writingCorrect = useMemo(
    () => typedAnswer.trim().toLowerCase() === simpleMeaning,
    [simpleMeaning, typedAnswer]
  );

  function resetForNewPhrase(message: string) {
    setTranscript("");
    setTypedAnswer("");
    setScore(0);
    setStatus(message);
  }

  function playTeacher() {
    speakText(
      `${phrase.english}. In Amharic, say ${phrase.transliteration}. ${tip}`,
      "en-US",
      0.9
    ).then((spoken) => {
      setStatus(spoken ? "Teacher voice is explaining the phrase." : "Speech playback is not available in this browser.");
    });
    setCompleted((items) => [...new Set([...items, "teacher"])]);
  }

  function playAmharic() {
    speakText(
      phrase.amharic,
      "am-ET",
      0.72,
      `Amharic pronunciation: ${phrase.transliteration}. ${tip}`
    ).then((spoken) => {
      setStatus(
        spoken
          ? "Playing Amharic audio. If your device has no Amharic voice, you will hear the pronunciation guide."
          : "Speech playback is not available in this browser."
      );
    });
    setCompleted((items) => [...new Set([...items, "listen"])]);
  }

  function recordVoice() {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      setStatus("Voice recognition is not available here. Try Chrome or Edge, or practice with the transliteration.");
      return;
    }

    setTranscript("");
    setStatus("Listening. Say the phrase using the transliteration if Amharic recognition is unavailable.");
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const heard = event.results[0]?.[0]?.transcript ?? "";
      const result = scoreTranscript(heard, phrase.transliteration);
      setTranscript(heard);
      setScore(result);
      setCompleted((items) => [...new Set([...items, "speak"])]);
      setStatus(result >= 70 ? "Nice rhythm. Keep that shape." : "Good start. Listen once more and try the syllable chunks.");
    };
    recognition.onerror = (event) => {
      setStatus(`Microphone practice could not start: ${event.error}.`);
    };
    recognition.onend = () => {
      setStatus((current) => (current === "Listening. Say the phrase using the transliteration if Amharic recognition is unavailable." ? "Listening ended." : current));
    };
    recognition.start();
  }

  function nextPhrase() {
    setIndex((current) => (current + 1) % phraseList.length);
    resetForNewPhrase("New practice item loaded.");
  }

  function randomPhrase() {
    setIndex((current) => (phraseList.length <= 1 ? current : (current + 3) % phraseList.length));
    resetForNewPhrase("Fresh mixed practice item loaded.");
  }

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <Card className="pattern bg-leaf text-cream">
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cream/70">Beginner speaking lab</p>
            <h2 className="mt-3 font-display text-6xl font-bold">{phrase.amharic}</h2>
            <p className="mt-2 text-xl font-bold text-saffron">{phrase.transliteration}</p>
            <p className="mt-3 text-cream/82">{phrase.english}</p>
            <p className="mt-4 max-w-2xl rounded-2xl bg-cream/12 p-4 text-sm leading-6 text-cream/82">
              {tip}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={playTeacher}>
                <Play size={18} /> Teach me
              </Button>
              <Button variant="secondary" onClick={playAmharic}>
                <Waves size={18} /> Play Amharic
              </Button>
              <Button variant="secondary" onClick={recordVoice}>
                <Mic2 size={18} /> Record
              </Button>
              <Button variant="secondary" onClick={nextPhrase}>
                <Repeat size={18} /> Next
              </Button>
              <Button variant="secondary" onClick={randomPhrase}>
                <Shuffle size={18} /> Mix
              </Button>
              <Button href={`/lesson?lesson=${phrase.lessonSlug}`} variant="secondary">
                <BookOpen size={18} /> Lesson
              </Button>
            </div>
            <div className="mt-8 grid h-32 grid-cols-[repeat(24,minmax(0,1fr))] items-center gap-1 rounded-3xl bg-cream/12 p-4" aria-label="Audio waveform visualization">
              {Array.from({ length: 24 }).map((_, waveformIndex) => (
                <span
                  key={waveformIndex}
                  className="rounded-full bg-saffron transition-all"
                  style={{ height: `${20 + (((waveformIndex + index) * 17) % 76)}%` }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm font-bold text-cream/80" role="status">
              {status}
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-4xl font-bold">Today&apos;s drills</h3>
          <p className="mt-2 text-sm font-bold text-charcoal/58 dark:text-cream/58">
            {phraseList.length} practice items from your course. Current: {phrase.unitTitle} / {phrase.lessonTitle}
          </p>
          <div className="mt-5 space-y-3">
            {practiceSets.map((set) => (
              <div key={set.title} className="flex items-center justify-between rounded-2xl bg-cream p-4 dark:bg-ink/64">
                <span className="flex items-center gap-3">
                  <set.icon className="text-leaf dark:text-saffron" />
                  <span>
                    <strong className="block">{set.title}</strong>
                    <span className="text-xs text-charcoal/58 dark:text-cream/58">{set.status}</span>
                  </span>
                </span>
                {completed.includes(set.title.toLowerCase()) ? <CheckCircle2 size={17} /> : <Repeat size={17} />}
              </div>
            ))}
          </div>
          {transcript ? (
            <div className="mt-5 rounded-2xl bg-cream p-4 dark:bg-ink/64">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-leaf dark:text-saffron">Heard</p>
              <p className="mt-2 font-bold">{transcript}</p>
              <ProgressBar value={score} className="mt-4" />
              <p className="mt-2 text-sm text-charcoal/64 dark:text-cream/64">{score}% match to {phrase.transliteration}</p>
            </div>
          ) : null}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Card>
          <Keyboard className="text-leaf dark:text-saffron" />
          <h3 className="mt-4 font-display text-3xl font-bold">Meaning check</h3>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-bold">Type the English meaning</span>
            <input
              value={typedAnswer}
              onChange={(event) => setTypedAnswer(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink"
              placeholder={simpleMeaning || "hello"}
            />
          </label>
          <p className="mt-3 text-sm font-bold text-leaf dark:text-saffron">
            {typedAnswer ? (writingCorrect ? "Correct." : "Try the simplest meaning first.") : "Start with the everyday English meaning."}
          </p>
        </Card>
        <Card>
          <Waves className="text-leaf dark:text-saffron" />
          <h3 className="mt-4 font-display text-3xl font-bold">Listen and repeat</h3>
          <ProgressBar value={completed.includes("listen") ? 100 : 35} className="mt-5" />
          <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">Use the Amharic audio before recording.</p>
        </Card>
        <Card>
          <Repeat className="text-leaf dark:text-saffron" />
          <h3 className="mt-4 font-display text-3xl font-bold">Vocabulary recall</h3>
          <ProgressBar value={score || 0} className="mt-5" />
          <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">Your speaking score helps you decide what to review next.</p>
        </Card>
      </div>
    </>
  );
}
