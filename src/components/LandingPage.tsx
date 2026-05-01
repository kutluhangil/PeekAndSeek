import { useState, type ChangeEvent, type KeyboardEvent, type FocusEvent } from "react";
import { ChevronRight, Check, ChevronDown, ChevronUp } from "lucide-react";
import { WorldMap } from "./WorldMap";
import { REGION_LABELS } from "../lib/regions";
import type { Lang } from "../App";
import type { Region } from "../lib/regions";

interface LandingPageProps {
  onStartGame: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  lang: Lang;
  onSetLang: (l: Lang) => void;
  region: Region;
  onSetRegion: (r: Region) => void;
}

const DIFFICULTIES = {
  en: [
    { id: "easy", label: "Novice", desc: "Warm/cold hints · wide target radius" },
    { id: "medium", label: "Explorer", desc: "Country hint only · tighter radius" },
    { id: "hard", label: "Cartographer", desc: "No hints · no street view" },
  ],
  tr: [
    { id: "easy", label: "Acemi", desc: "Sıcak/soğuk ipucu · geniş hedef" },
    { id: "medium", label: "Kaşif", desc: "Sadece ülke ipucu · dar hedef" },
    { id: "hard", label: "Kartograf", desc: "İpucu yok · sokak görünümü yok" },
  ],
};

const STEPS = {
  en: [
    { icon: "📷", label: "Photo shown", desc: "A street-level photo from somewhere in the world." },
    { icon: "📍", label: "Pin it", desc: "Click the map to guess where it was taken." },
    { icon: "🌡️", label: "Warmer / colder", desc: "Each guess tells you closer or farther." },
    { icon: "🏆", label: "Score", desc: "Fewer guesses = higher score. 5 rounds." },
  ],
  tr: [
    { icon: "📷", label: "Fotoğraf", desc: "Dünyanın bir yerinden sokak fotoğrafı gösterilir." },
    { icon: "📍", label: "İşaretle", desc: "Haritada fotoğrafın yerini pin at." },
    { icon: "🌡️", label: "Sıcak / soğuk", desc: "Her tahmin seni hedefe yaklaştırır ya da uzaklaştırır." },
    { icon: "🏆", label: "Puan", desc: "Az hamlede bul, yüksek puan al. 5 tur." },
  ],
};

const COPY = {
  en: {
    tagline: "Can you find it\non the map?",
    howTitle: "How it works",
    difficulty: "Difficulty",
    region: "Region",
    start: "Start Playing",
    apiLabel: "Google Maps API Key",
    apiPlaceholder: "AIza...",
    apiSave: "Save",
    apiHint: "Required · Maps JS API · Street View · Geocoding",
    apiConnected: "API connected",
    langToggle: "TR",
    tries: "10 tries per round",
  },
  tr: {
    tagline: "Haritada\nbulabilir misin?",
    howTitle: "Nasıl oynanır",
    difficulty: "Zorluk",
    region: "Bölge",
    start: "Oynamaya Başla",
    apiLabel: "Google Maps API Anahtarı",
    apiPlaceholder: "AIza...",
    apiSave: "Kaydet",
    apiHint: "Gerekli · Maps JS API · Street View · Geocoding",
    apiConnected: "API bağlandı",
    langToggle: "EN",
    tries: "Tur başına 10 hamle",
  },
};

const REGION_LABELS_TR: Record<Region, string> = {
  world: "Dünya",
  europe: "Avrupa",
  turkey: "Türkiye",
  americas: "Amerika",
  asia: "Asya",
};

const REGIONS = Object.keys(REGION_LABELS) as Region[];

// Reusable base styles as inline for CSS variable support
const btn = (active: boolean) =>
  `w-full flex items-center justify-between px-4 py-3 text-left text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
    active
      ? "bg-[#1c1917] text-[#fdfcf8] border border-[#1c1917]"
      : "bg-transparent text-[#1c1917] border border-[#e5e3dc] hover:border-[#1c1917]"
  }`;

const chipBtn = (active: boolean) =>
  `px-4 py-2 text-[12px] font-medium cursor-pointer transition-all duration-150 ${
    active
      ? "bg-[#1c1917] text-[#fdfcf8] border border-[#1c1917]"
      : "bg-transparent text-[#1c1917] border border-[#e5e3dc] hover:border-[#1c1917]"
  }`;

export default function LandingPage({
  onStartGame,
  apiKey,
  onSaveKey,
  lang,
  onSetLang,
  region,
  onSetRegion,
}: LandingPageProps) {
  const [difficulty, setDifficulty] = useState("medium");
  const [apiInput, setApiInput] = useState(apiKey);
  const [showApi, setShowApi] = useState(!apiKey);
  const c = COPY[lang];
  const diffs = DIFFICULTIES[lang];
  const steps = STEPS[lang];

  const handleStart = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("difficulty", difficulty);
    window.history.replaceState({}, "", `?${params.toString()}`);
    onStartGame();
  };

  const handleSaveKey = () => {
    if (apiInput.trim()) {
      onSaveKey(apiInput.trim());
      setShowApi(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center px-6 py-16 overflow-hidden"
      style={{ minHeight: "100dvh", background: "#fdfcf8" }}
    >
      <WorldMap opacity={0.07} />

      {/* Language toggle */}
      <button
        onClick={() => onSetLang(lang === "en" ? "tr" : "en")}
        className="fixed top-6 right-6 z-20 text-[11px] font-medium tracking-[0.2em] uppercase px-[10px] py-1 bg-transparent cursor-pointer transition-colors duration-200 border border-[#e5e3dc] text-[#78716c] hover:text-[#1c1917] hover:border-[#1c1917]"
      >
        {c.langToggle}
      </button>

      {/* Main content */}
      <div className="relative w-full animate-fade-up" style={{ maxWidth: 480, zIndex: 10 }}>

        {/* Brand + tagline */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#78716c] mb-3">
            peek &amp; seek
          </p>
          <h1
            className="font-bold leading-[1.1] tracking-tight text-[#1c1917]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", whiteSpace: "pre-line" }}
          >
            {c.tagline}
          </h1>
        </div>

        {/* How it works */}
        <section className="mb-10">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#78716c] mb-3">
            {c.howTitle}
          </p>
          <div className="grid grid-cols-2 gap-[10px]">
            {steps.map((step, i) => (
              <div
                key={i}
                className="p-4"
                style={{ border: "1px solid #e5e3dc", background: "#f5f4ef" }}
              >
                <span className="text-xl block mb-2">{step.icon}</span>
                <p className="text-[13px] font-semibold text-[#1c1917] mb-1">{step.label}</p>
                <p className="text-[12px] text-[#78716c] leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#78716c] text-center mt-2.5 tracking-wide">
            {c.tries}
          </p>
        </section>

        {/* Difficulty */}
        <section className="mb-10">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#78716c] mb-3">
            {c.difficulty}
          </p>
          <div className="flex flex-col gap-2">
            {diffs.map((d) => (
              <button key={d.id} onClick={() => setDifficulty(d.id)} className={btn(difficulty === d.id)}>
                <div>
                  <span>{d.label}</span>
                  <span
                    className="ml-[10px] text-[11px]"
                    style={{
                      opacity: difficulty === d.id ? 0.7 : 1,
                      color: difficulty === d.id ? "inherit" : "#78716c",
                    }}
                  >
                    {d.desc}
                  </span>
                </div>
                {difficulty === d.id && <Check size={15} strokeWidth={2.5} />}
              </button>
            ))}
          </div>
        </section>

        {/* Region */}
        <section className="mb-10">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#78716c] mb-3">
            {c.region}
          </p>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => {
              const label = lang === "tr" ? REGION_LABELS_TR[r] : (REGION_LABELS[r] || r);
              return (
                <button key={r} onClick={() => onSetRegion(r)} className={chipBtn(region === r)}>
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Start */}
        <div className="mb-10">
          <button
            onClick={handleStart}
            className="w-full py-4 bg-[#1c1917] text-[#fdfcf8] text-[13px] font-semibold tracking-[0.12em] uppercase border-none cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {c.start}
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* API Key */}
        <div style={{ borderTop: "1px solid #e5e3dc", paddingTop: "1.5rem" }}>
          <button
            onClick={() => setShowApi((v: boolean) => !v)}
            className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer p-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#78716c]">
                {c.apiLabel}
              </span>
              {apiKey && !showApi && (
                <span className="flex items-center gap-1 text-[10px] text-[#78716c]">
                  <Check size={12} strokeWidth={2.5} />
                  {c.apiConnected}
                </span>
              )}
            </div>
            {showApi
              ? <ChevronUp size={14} color="#78716c" />
              : <ChevronDown size={14} color="#78716c" />
            }
          </button>

          {showApi && (
            <div className="mt-3">
              <p className="text-[11px] text-[#78716c] mb-[10px] leading-[1.5]">
                {c.apiHint}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setApiInput(e.target.value)}
                  placeholder={c.apiPlaceholder}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSaveKey()}
                  className="flex-1 px-3 py-[10px] text-[13px] text-[#1c1917] font-mono bg-transparent outline-none transition-colors"
                  style={{ border: "1px solid #e5e3dc" }}
                  onFocus={(e: FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "#1c1917")}
                  onBlur={(e: FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "#e5e3dc")}
                />
                <button
                  onClick={handleSaveKey}
                  className="px-5 py-[10px] bg-[#1c1917] text-[#fdfcf8] text-[12px] font-medium tracking-wide border-none cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {c.apiSave}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
