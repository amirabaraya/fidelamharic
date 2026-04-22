import {
  Award,
  BookOpen,
  Brain,
  Crown,
  Ear,
  Flame,
  Headphones,
  Heart,
  Mic,
  PenLine,
  Repeat,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy
} from "lucide-react";
import { fullCourseCatalog } from "@/lib/course-catalog";

export const user = {
  name: "Maya Tesfaye",
  handle: "@mayaqal",
  level: "A2 Explorer",
  xp: 4280,
  weeklyXp: 740,
  streak: 18,
  hearts: 4,
  dailyGoal: 36,
  dailyGoalTarget: 45,
  league: "Gold Saffron",
  accuracy: 91
};

export const units = fullCourseCatalog.map((unit, index) => ({
  id: unit.slug,
  title: `Unit ${index + 1}`,
  subtitle: unit.title,
  level: unit.level
    .toLowerCase()
    .replace("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase()),
  progress: [100, 72, 38, 18, 6, 0][index] ?? 0,
  color: ["leaf", "saffron", "ember", "moss", "clay", "charcoal"][index] ?? "leaf",
  lessons: unit.lessons.map((lesson) => lesson[1])
}));

export const skills = [
  { label: "Listening", icon: Headphones, value: 82 },
  { label: "Speaking", icon: Mic, value: 64 },
  { label: "Reading", icon: BookOpen, value: 76 },
  { label: "Writing", icon: PenLine, value: 58 }
];

export const lessons = [
  {
    id: "lesson-greetings",
    title: "Greeting with warmth",
    unit: "Roots and greetings",
    xp: 25,
    minutes: 8,
    type: "Conversation",
    phrase: "ሰላም ነው?",
    transliteration: "Selam new?",
    translation: "Is there peace? / How are you?",
    prompt: "Choose the warm everyday greeting.",
    options: ["ሰላም ነው?", "ውሃ ነው?", "ቤት ነው?", "እንጀራ ነው?"],
    answer: "ሰላም ነው?"
  },
  {
    id: "lesson-market",
    title: "Market numbers",
    unit: "At the market",
    xp: 30,
    minutes: 10,
    type: "Vocabulary",
    phrase: "አስር ብር",
    transliteration: "Asir birr",
    translation: "Ten birr",
    prompt: "Translate: ten birr",
    options: ["አስር ብር", "ሁለት ብር", "አንድ ቤት", "ቡና ነው"],
    answer: "አስር ብር"
  },
  {
    id: "lesson-family",
    title: "My family",
    unit: "Family and home",
    xp: 35,
    minutes: 12,
    type: "Grammar",
    phrase: "እናቴ",
    transliteration: "Enate",
    translation: "My mother",
    prompt: "What does እናቴ mean?",
    options: ["My mother", "Your book", "Our coffee", "His home"],
    answer: "My mother"
  }
];

export const practiceSets = [
  { title: "Speak", description: "Record ሰላም ነው and compare rhythm.", icon: Mic, status: "Ready" },
  { title: "Listen", description: "Identify words from native-speed audio.", icon: Ear, status: "7 clips" },
  { title: "Translate", description: "Switch between English and Amharic.", icon: Repeat, status: "Mixed" },
  { title: "Recall", description: "Spaced flashcards due today.", icon: Brain, status: "18 due" }
];

export const reviewCards = [
  { front: "Coffee", back: "ቡና", next: "Tomorrow", strength: 84 },
  { front: "Thank you", back: "አመሰግናለሁ", next: "3 days", strength: 68 },
  { front: "My home", back: "ቤቴ", next: "Today", strength: 41 },
  { front: "Peace", back: "ሰላም", next: "1 week", strength: 93 }
];

export const leaderboard = [
  { rank: 1, name: "Samrawit", xp: 1250, streak: 41 },
  { rank: 2, name: "Noah", xp: 1090, streak: 26 },
  { rank: 3, name: "Maya", xp: 740, streak: 18 },
  { rank: 4, name: "Lulit", xp: 710, streak: 14 },
  { rank: 5, name: "Eli", xp: 690, streak: 9 }
];

export const badges = [
  { label: "Fidel Keeper", icon: ShieldCheck, earned: true },
  { label: "Coffee Chat", icon: Sparkles, earned: true },
  { label: "18-Day Flame", icon: Flame, earned: true },
  { label: "Pronunciation Gold", icon: Award, earned: false },
  { label: "Story Listener", icon: Star, earned: false },
  { label: "League Crown", icon: Crown, earned: true }
];

export const adminContent = [
  { title: "Fidel vowel drills", status: "Published", level: "Beginner", exercises: 24 },
  { title: "Family possessives", status: "Draft", level: "A2", exercises: 16 },
  { title: "Market listening pack", status: "Review", level: "Beginner", exercises: 18 },
  { title: "News Amharic opinions", status: "Planned", level: "Advanced", exercises: 9 }
];

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Trophy },
  { href: "/course", label: "Course", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Mic },
  { href: "/review", label: "Review", icon: Repeat },
  { href: "/leaderboard", label: "League", icon: Crown },
  { href: "/profile", label: "Profile", icon: Heart }
];
