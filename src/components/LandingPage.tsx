import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Key, Globe } from "lucide-react";
import { getStoredItem, setStoredItem } from "../lib/storage";
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

const C = {
  en: {
    eyebrow: "Street Intelligence Game",
    tagline: "Where in the world\nis this?",
    sub: "Study the street-level photo. Deduce the location. Pin it on the map — in 10 guesses or fewer.",
    steps: [
      ["01", "Study the street view image in the visual feed"],
      ["02", "Pan the map to where you think it was taken"],
      ["03", "Submit your guess — get distance & direction hints"],
      ["04", "5 rounds · score up to 5,000 pts each"],
    ],
    region: "Region",
    regionOpts: REGION_LABELS,
    difficulty: "Protocol",
    diffs: [
      { id: "easy",   label: "Novice",       sub: "Wide radius · full hints" },
      { id: "medium", label: "Explorer",     sub: "Standard challenge"       },
      { id: "hard",   label: "Cartographer", sub: "No direction · no visuals" },
    ],
    start: "Commence Search",
    connected: "Signal Acquired",
    apiLabel: "Google Maps API key",
    apiBtn: "Initialize",
    apiSub: "Enable: Maps JS API · Street View · Geocoding",
    langToggle: "TR",
  },
  tr: {
    eyebrow: "Sokak İstihbarat Oyunu",
    tagline: "Dünyanın neresinde\nburaydı?",
    sub: "Sokak fotoğrafını incele. Konumu tespit et. Haritada işaretle — 10 hamlede veya daha azında.",
    steps: [
      ["01", "Görsel akıştaki sokak görüntüsünü incele"],
      ["02", "Haritayı fotoğrafın çekildiğini düşündüğün yere kaydır"],
      ["03", "Tahminini gönder — mesafe & yön ipuçlarını al"],
      ["04", "5 tur · her tur için en fazla 5.000 puan"],
    ],
    region: "Bölge",
    regionOpts: REGION_LABELS,
    difficulty: "Protokol",
    diffs: [
      { id: "easy",   label: "Acemi",      sub: "Geniş yarıçap · tam ipucu" },
      { id: "medium", label: "Kaşif",      sub: "Standart zorluk"            },
      { id: "hard",   label: "Kartograf",  sub: "Yön yok · görsel yok"       },
    ],
    start: "Aramayı Başlat",
    connected: "Sinyal Alındı",
    apiLabel: "Google Maps API anahtarı",
    apiBtn: "Başlat",
    apiSub: "Etkinleştirin: Maps JS API · Street View · Geocoding",
    langToggle: "EN",
  },
};

const REGIONS = Object.keys(REGION_LABELS) as Region[];

export default function LandingPage({
  onStartGame, apiKey, onSaveKey, lang, onSetLang, region, onSetRegion,
}: LandingPageProps) {
  const [keyInput, setKeyInput] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const t = C[lang];

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

  return (
    <main className="relative min-h-[100dvh] bg-[#080706] overflow-hidden flex items-center justify-center">
      {/* Animated coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220,38,38,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          animation: "gridMove 20s linear infinite",
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, #080706 100%)"
      }} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-20">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">P&S v2.1</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSetLang(lang === "en" ? "tr" : "en")}
            className="flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-white/40 hover:text-white/80 transition-colors uppercase"
          >
            <Globe className="w-3.5 h-3.5" />
            {t.langToggle}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-16">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[10px] tracking-[0.35em] text-[#dc2626] uppercase mb-8 text-center"
        >
          {t.eyebrow}
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif italic text-[#f7f6f2] text-center leading-tight mb-6"
          style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}
        >
          {t.tagline.split("\n").map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-center text-[13px] text-white/35 leading-relaxed mb-12 font-light"
        >
          {t.sub}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-px bg-white/8 mb-10"
        />

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 gap-x-6 gap-y-4 mb-10"
        >
          {t.steps.map(([num, text], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.07 }}
              className="flex items-start gap-3"
            >
              <span className="font-mono text-[10px] text-[#dc2626] mt-0.5 shrink-0">{num}</span>
              <span className="text-[11px] text-white/45 leading-snug">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-8" />

        {/* Action block */}
        {!apiKey ? (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div className="relative flex items-center border-b border-white/15 focus-within:border-[#dc2626] transition-colors pb-2">
              <Key className="w-4 h-4 text-white/30 absolute left-0" strokeWidth={1.5} />
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder={t.apiLabel}
                className="w-full pl-7 bg-transparent text-[14px] text-white/80 placeholder:text-white/20 outline-none font-light"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 border border-white/15 text-white/70 text-[11px] font-mono uppercase tracking-[0.25em] hover:border-[#dc2626] hover:text-white transition-all duration-300"
            >
              {t.apiBtn}
            </button>
            <p className="text-center text-[10px] text-white/20 font-mono tracking-wider">
              {t.apiSub}
            </p>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col gap-6"
          >
            {/* Signal indicator */}
            <div className="flex items-center justify-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-emerald-500/80 uppercase">
                {t.connected}
              </span>
            </div>

            {/* Region selector */}
            <div>
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/25 uppercase mb-3 text-center">
                {t.region}
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => onSetRegion(r)}
                    className={`py-2 text-center text-[9px] font-mono uppercase tracking-wider border transition-all ${
                      region === r
                        ? "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/8"
                        : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
                    }`}
                  >
                    {t.regionOpts[r][lang].split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/25 uppercase mb-3 text-center">
                {t.difficulty}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {t.diffs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`py-3 px-2 text-center border transition-all ${
                      difficulty === d.id
                        ? "border-[#dc2626] bg-[#dc2626]/8"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className={`text-[10px] font-mono uppercase tracking-wider mb-1 ${difficulty === d.id ? "text-[#dc2626]" : "text-white/50"}`}>
                      {d.label}
                    </div>
                    <div className="text-[8px] text-white/20 leading-tight">{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start */}
            <button
              onClick={handleStart}
              className="w-full py-4 bg-[#dc2626] text-white text-[11px] font-mono uppercase tracking-[0.35em] hover:bg-[#b91c1c] transition-colors duration-200 mt-2"
            >
              {t.start}
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4 z-20">
        <span className="font-mono text-[9px] tracking-widest text-white/12 uppercase">
          © 2025 Peek & Seek
        </span>
        <span className="font-mono text-[9px] tracking-widest text-white/12 uppercase">
          Powered by Google Maps
        </span>
      </div>
    </main>
  );
}
