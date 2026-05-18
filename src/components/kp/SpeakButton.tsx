import { Volume2 } from "lucide-react";
import { useStore } from "@/lib/kp/store";

/**
 * Lightweight accessibility audio guidance.
 * Reads a short instruction aloud using the browser's SpeechSynthesis API.
 * Not a voice assistant — one-tap text-to-speech for low-literacy users.
 */
export function SpeakButton({ text, msText, label = "Listen", className = "" }: { text: string; msText?: string; label?: string; className?: string }) {
  const lang = useStore(s => s.language);
  const speak = () => {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const phrase = lang === "ms" && msText ? msText : text;
      const utter = new SpeechSynthesisUtterance(phrase);
      utter.lang = lang === "ms" ? "ms-MY" : "en-US";
      utter.rate = 0.92;
      window.speechSynthesis.speak(utter);
    } catch { /* no-op */ }
  };
  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`${label}: ${text}`}
      className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary-soft text-primary text-xs font-bold active:opacity-80 ${className}`}
    >
      <Volume2 className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}