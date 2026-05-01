import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Key, MapPin, Moon, Sun, Globe } from "lucide-react";
import { getStoredItem, setStoredItem } from "../lib/storage";
import type { Lang } from "../App";

interface LandingPageProps {
  onStartGame: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  lang: Lang;
  onSetLang: (l: Lang) => void;
}

const copy = {
  en: {
    tagline: "Where in the world is this?",
    subtitle:
      "You're shown a real street-level photo. Study it — spot the signs, architecture, vegetation, terrain. Then pinpoint the exact location on the map before your guesses run out.",
    howTitle: "How to play",
    steps: [
      { icon: "📸", text: "Study the street-level image in the Visual Feed panel." },
      { icon: "🗺️", text: "Pan the map to where you think the photo was taken." },
      { icon: "📍", text: "Submit your guess and receive distance & direction hints." },
      { icon: "🎯", text: "You have 10 attempts. Zero in on the target." },
    ],
    difficultyLabel: "Select protocol",
    easy: "Novice",
    easyDesc: "Wide radius, full clues",
    medium: "Explorer",
    mediumDesc: "Standard challenge",
    hard: "Cartographer",
    hardDesc: "No direction, no visuals",
    start: "Commence Search",
    connected: "Uplink Established",
    apiLabel: "Enter your Google Maps API key",
    apiButton: "Initialize Tracker",
    apiHint: "A personal key is required for map and street view streaming.",
    apiApis: "Enable: Maps JS API · Street View Static API · Geocoding API",
  },
  tr: {
    tagline: "Dünyanın neresinde bu?",
    subtitle:
      "Gerçek bir sokak fotoğrafı gösterilir. İncele — tabelaları, mimariyi, bitkileri, araziyi fark et. Ardından hamleler bitmeden haritada tam konumu tespit et.",
    howTitle: "Nasıl oynanır",
    steps: [
      { icon: "📸", text: "Sol paneldeki Görsel Akış'ta sokak fotoğrafını incele." },
      { icon: "🗺️", text: "Fotoğrafın çekildiğini düşündüğün yere haritayı kaydır." },
      { icon: "📍", text: "Tahminini gönder ve mesafe & yön ipuçlarını al." },
      { icon: "🎯", text: "10 hamlen var. Hedefe kilitle." },
    ],
    difficultyLabel: "Protokol seçin",
    easy: "Acemi",
    easyDesc: "Geniş yarıçap, tam ipuçları",
    medium: "Kaşif",
    mediumDesc: "Standart zorluk",
    hard: "Kartograf",
    hardDesc: "Yön yok, görsel yok",
    start: "Aramayı Başlat",
    connected: "Bağlantı Kuruldu",
    apiLabel: "Google Maps API anahtarını girin",
    apiButton: "İzleyiciyi Başlat",
    apiHint: "Harita ve sokak görünümü için kişisel API anahtarı gereklidir.",
    apiApis: "Etkinleştirin: Maps JS API · Street View Static API · Geocoding API",
  },
};

const CornerBracket = ({ className }: { className?: string }) => (
  <svg
    className={`absolute w-5 h-5 text-foreground/30 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    <path d="M 24 0 L 0 0 L 0 24" />
  </svg>
);

export default function LandingPage({
  onStartGame,
  apiKey,
  onSaveKey,
  lang,
  onSetLang,
}: LandingPageProps) {
  const [keyInput, setKeyInput] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isDark, setIsDark] = useState(false);
  const t = copy[lang];

  useEffect(() => {
    if (getStoredItem("theme") === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setStoredItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setStoredItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) onSaveKey(keyInput.trim());
  };

  const handleStart = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("difficulty", difficulty);
    window.history.replaceState({}, "", url);
    onStartGame();
  };

  const difficulties = [
    { id: "easy", label: t.easy, desc: t.easyDesc },
    { id: "medium", label: t.medium, desc: t.mediumDesc },
    { id: "hard", label: t.hard, desc: t.hardDesc },
  ];

  return (
    <main className="relative flex-1 flex items-center justify-center min-h-[100dvh] bg-background overflow-hidden cartography-grid">
      {/* Animated world map background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          alt=""
          className={`absolute w-[280%] md:w-[160%] lg:w-[130%] max-w-none h-auto animate-map-drift mix-blend-multiply ${
            isDark ? "opacity-[0.035] invert" : "opacity-[0.07]"
          }`}
          style={{ top: "50%", left: "50%" }}
        />
      </div>

      {/* Animated SVG topo lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none text-foreground"
        viewBox="0 0 1200 800"
        fill="none"
        stroke="currentColor"
        preserveAspectRatio="xMidYMid slice"
      >
        {[0, 30, 60, 90, 120].map((offset, i) => (
          <path
            key={i}
            d={`M-200,${200 + offset} C200,${150 + offset} 500,${280 + offset} 800,${180 + offset} S1100,${260 + offset} 1400,${210 + offset}`}
            strokeWidth="0.6"
            strokeDasharray="8 6"
            className="animate-flow-line"
            style={{ animationDelay: `${i * -2.4}s` }}
          />
        ))}
        {[0, 40, 80].map((offset, i) => (
          <path
            key={`b${i}`}
            d={`M-200,${500 + offset} C300,${460 + offset} 600,${560 + offset} 900,${490 + offset} S1200,${540 + offset} 1400,${510 + offset}`}
            strokeWidth="0.6"
            strokeDasharray="12 8"
            className="animate-flow-line-slow"
            style={{ animationDelay: `${i * -4}s` }}
          />
        ))}
        <ellipse cx="900" cy="600" rx="80" ry="50" strokeWidth="0.5" />
        <ellipse cx="900" cy="600" rx="130" ry="80" strokeWidth="0.5" />
        <circle cx="900" cy="600" r="3" fill="currentColor" />
        <ellipse cx="200" cy="150" rx="50" ry="35" strokeWidth="0.5" />
        <ellipse cx="200" cy="150" rx="90" ry="60" strokeWidth="0.5" />
        <circle cx="200" cy="150" r="2" fill="currentColor" />
      </svg>

      {/* Top controls */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={() => onSetLang(lang === "en" ? "tr" : "en")}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card rounded-full text-foreground hover:bg-muted-bg transition-colors shadow-sm text-[11px] font-medium uppercase tracking-widest"
        >
          <Globe className="w-3 h-3" />
          {lang === "en" ? "TR" : "EN"}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 border border-border bg-card rounded-full text-foreground hover:bg-muted-bg transition-colors shadow-sm"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative bg-card/92 backdrop-blur-xl border border-border shadow-2xl"
        >
          <CornerBracket className="-top-1 -left-1" />
          <CornerBracket className="-top-1 -right-1 rotate-90" />
          <CornerBracket className="-bottom-1 -left-1 -rotate-90" />
          <CornerBracket className="-bottom-1 -right-1 rotate-180" />

          {/* Header strip */}
          <div className="px-8 pt-7 pb-5 border-b border-border/60 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted flex items-center gap-2">
              <MapPin className="w-3 h-3" /> v 2.1
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted">
              Peek & Seek
            </span>
          </div>

          <div className="px-8 pt-8 pb-4 text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-5xl lg:text-6xl font-serif italic text-foreground tracking-tight mb-3"
            >
              Peek & Seek
            </motion.h1>
            <p className="text-[13px] text-accent font-medium uppercase tracking-[0.18em] mb-4">
              {t.tagline}
            </p>
            <p className="text-[13px] text-muted leading-relaxed font-light max-w-md mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* How to play */}
          <div className="px-8 py-5 border-t border-b border-border/40 bg-muted-bg/20">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted mb-4 text-center">
              {t.howTitle}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {t.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-base leading-none mt-0.5">{step.icon}</span>
                  <p className="text-[11px] text-foreground/75 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action area */}
          <div className="px-8 py-7">
            {!apiKey ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-accent absolute left-0" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder={t.apiLabel}
                    className="minimal-input w-full pl-8 py-3 text-[14px] font-medium text-foreground placeholder:font-normal placeholder:text-muted"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full border-2 border-foreground bg-card text-foreground py-3.5 text-[12px] uppercase tracking-[0.15em] font-bold hover:bg-foreground hover:text-card transition-all duration-300"
                >
                  {t.apiButton}
                </button>
                <div className="text-[11px] text-muted text-center space-y-1">
                  <p>{t.apiHint}</p>
                  <p className="text-accent/80 text-[10px] uppercase tracking-wider font-semibold">
                    {t.apiApis}
                  </p>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-foreground font-bold">
                    {t.connected}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted text-center mb-3">
                    {t.difficultyLabel}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {difficulties.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDifficulty(d.id)}
                        className={`py-3 px-2 text-center border transition-colors ${
                          difficulty === d.id
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border text-muted hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="text-[11px] uppercase tracking-wider font-mono font-bold">
                          {d.label}
                        </div>
                        <div className="text-[9px] text-current/60 mt-1 leading-tight">
                          {d.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full border-2 border-accent bg-accent text-white py-4 text-[13px] uppercase tracking-[0.2em] font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                >
                  {t.start}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
