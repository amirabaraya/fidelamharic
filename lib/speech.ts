function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };

    window.setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

function findVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const primary = lang.split("-")[0].toLowerCase();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase()) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(primary)) ??
    voices.find((voice) => /amharic|ethiopic|ethiopia/i.test(`${voice.name} ${voice.lang}`)) ??
    null
  );
}

export async function speakText(text: string, lang = "am-ET", rate = 0.82, fallbackText?: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const voices = await loadVoices();
  const voice = findVoice(voices, lang);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
  } else if (fallbackText) {
    utterance.text = fallbackText;
    utterance.lang = "en-US";
    utterance.rate = Math.min(0.92, rate + 0.08);
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function scoreTranscript(transcript: string, expected: string) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();

  const heard = normalize(transcript);
  const target = normalize(expected);
  if (!heard || !target) return 0;
  if (heard === target) return 100;

  const heardParts = new Set(heard.split(/\s+/));
  const targetParts = target.split(/\s+/);
  const matched = targetParts.filter((part) => heardParts.has(part)).length;

  return Math.round((matched / targetParts.length) * 100);
}

export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  return Recognition ? new Recognition() : null;
}
