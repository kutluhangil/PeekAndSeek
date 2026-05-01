import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Key,
  Globe,
  MapPin,
  Crosshair,
  Radar,
  Satellite,
  Activity,
} from "lucide-react";
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
      { id: "easy", label: "Novice", sub: "Wide radius · full hints" },
      { id: "medium", label: "Explorer", sub: "Standard challenge" },
      { id: "hard", label: "Cartographer", sub: "No direction · no visuals" },
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
      { id: "easy", label: "Acemi", sub: "Geniş yarıçap · tam ipucu" },
      { id: "medium", label: "Kaşif", sub: "Standart zorluk" },
      { id: "hard", label: "Kartograf", sub: "Yön yok · görsel yok" },
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
  onStartGame,
  apiKey,
  onSaveKey,
  lang,
  onSetLang,
  region,
  onSetRegion,
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
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#f8fafc] text-[#0f172a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,250,252,0.98),_rgba(241,245,249,0.94)_35%,_rgba(226,232,240,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.12)_30%,rgba(255,255,255,0)_100%)]" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-[-12%] opacity-80 animate-map-pan"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px),
              linear-gradient(135deg, transparent 49%, rgba(37,99,235,0.28) 50%, transparent 51%),
              radial-gradient(circle at 16% 22%, rgba(14,165,233,0.18) 0 2px, transparent 2.5px),
              radial-gradient(circle at 72% 34%, rgba(15,23,42,0.08) 0 3px, transparent 3.5px),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.82), rgba(255,255,255,0) 68%)
            `,
            backgroundSize:
              "96px 96px, 96px 96px, 280px 280px, 100% 100%, 100% 100%, 100% 100%",
            backgroundPosition: "0 0, 0 0, 0 0, 0 0, 0 0, 0 0",
          }}
        />

        <svg
          className="absolute inset-0 h-full w-full opacity-[0.33]"
          viewBox="0 0 1440 900"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="routeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.0" />
              <stop offset="22%" stopColor="#0ea5e9" stopOpacity="0.28" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.38" />
              <stop offset="78%" stopColor="#0ea5e9" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient
              id="waterGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.06" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0.15  0 1 0 0 0.52  0 0 1 0 0.94  0 0 0 0.22 0"
              />
            </filter>
          </defs>

          <path
            d="M-40 270 C 160 210, 250 180, 420 198 S 740 306, 910 256 S 1200 122, 1500 170"
            fill="none"
            stroke="url(#waterGradient)"
            strokeWidth="28"
          />
          <path
            d="M40 650 C 220 570, 370 570, 520 606 S 760 758, 980 692 S 1250 520, 1490 580"
            fill="none"
            stroke="url(#waterGradient)"
            strokeWidth="18"
            opacity="0.8"
          />

          <path
            d="M-20 160 C 180 130, 300 112, 430 134 S 700 212, 860 184 S 1100 102, 1480 120"
            fill="none"
            stroke="#2563eb"
            strokeOpacity="0.18"
            strokeWidth="3"
            strokeDasharray="18 12"
            className="animate-dash-flow"
          />
          <path
            d="M-30 470 C 170 420, 345 438, 500 484 S 760 606, 930 556 S 1200 402, 1490 446"
            fill="none"
            stroke="#0f766e"
            strokeOpacity="0.14"
            strokeWidth="3"
            strokeDasharray="20 14"
            className="animate-dash-flow-slow"
          />
          <path
            d="M120 120 C 252 186, 300 256, 430 292 S 632 310, 740 362 S 980 504, 1090 548"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#softGlow)"
            className="animate-dash-flow"
          />
          <path
            d="M1180 160 C 1080 220, 1018 260, 940 310 S 802 450, 680 496"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#softGlow)"
            className="animate-dash-flow-slow"
          />

          <g fill="#38bdf8" opacity="0.7">
            <circle cx="430" cy="292" r="5" />
            <circle cx="740" cy="362" r="4.5" />
            <circle cx="1090" cy="548" r="5.5" />
            <circle cx="680" cy="496" r="4.5" />
          </g>
          <g
            fill="#f8fafc"
            stroke="#0f172a"
            strokeOpacity="0.5"
            strokeWidth="2"
            opacity="0.95"
          >
            <circle cx="430" cy="292" r="10" />
            <circle cx="740" cy="362" r="8" />
            <circle cx="1090" cy="548" r="9" />
            <circle cx="680" cy="496" r="8" />
          </g>
        </svg>

        <div className="absolute inset-x-0 top-[22%] h-px bg-gradient-to-r from-transparent via-sky-400/55 to-transparent animate-data-pulse" />
        <div className="absolute inset-x-0 top-[28%] h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
        <div className="absolute inset-y-0 left-[58%] w-px bg-gradient-to-b from-transparent via-sky-400/28 to-transparent" />
        <div className="absolute left-[58%] top-[28%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/16 bg-[radial-gradient(circle,rgba(14,165,233,0.10)_0%,rgba(14,165,233,0.04)_34%,transparent_70%)]" />
        <div className="absolute left-[58%] top-[28%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/22" />
        <div className="absolute left-[58%] top-[28%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/30" />
        <div className="absolute left-[58%] top-[28%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500 shadow-[0_0_0_10px_rgba(14,165,233,0.10)]" />
        <div className="absolute left-[58%] top-[28%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 animate-radar-spin">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,transparent_0deg,rgba(14,165,233,0.04)_16deg,rgba(14,165,233,0.34)_22deg,rgba(14,165,233,0.04)_30deg,transparent_44deg,transparent_360deg)] opacity-85" />
          <div className="absolute inset-[1px] rounded-full border border-sky-400/10" />
        </div>
        <div className="absolute left-[58%] top-[28%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.05)_0%,rgba(14,165,233,0.015)_38%,transparent_66%)] animate-radar-glow" />
        <div className="absolute left-[52%] top-[-12%] h-[125%] w-12 bg-[linear-gradient(180deg,transparent_0%,rgba(14,165,233,0)_36%,rgba(14,165,233,0.10)_50%,rgba(255,255,255,0.12)_52%,rgba(14,165,233,0.04)_56%,transparent_100%)] mix-blend-screen animate-scan-sweep" />

        <div className="absolute -top-20 left-[12%] h-72 w-72 rounded-full bg-sky-400/12 blur-3xl animate-float-slow" />
        <div className="absolute bottom-[-6rem] right-[8%] h-80 w-80 rounded-full bg-slate-900/6 blur-3xl animate-float-slower" />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.07)] backdrop-blur">
            <Satellite className="h-4 w-4 text-sky-600" strokeWidth={2} />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-slate-500">
              P&amp;S v2.1
            </p>
            <p className="text-[12px] text-slate-500">
              Satellite intelligence interface
            </p>
          </div>
        </div>
        <button
          onClick={() => onSetLang(lang === "en" ? "tr" : "en")}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
        >
          <Globe className="h-3.5 w-3.5" />
          {t.langToggle}
        </button>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100dvh-88px)] w-full max-w-7xl items-center gap-10 px-5 pb-10 pt-2 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.14)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              {t.eyebrow}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="font-sans leading-[0.9] font-semibold uppercase tracking-[-0.05em] text-slate-950"
            style={{ fontSize: "clamp(3rem, 7.8vw, 6.5rem)" }}
          >
            {t.tagline.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-6 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-[16px]"
          >
            {t.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            {t.steps.map(([num, text], i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 + i * 0.07 }}
                className="rounded-2xl border border-slate-200 bg-white/72 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur"
              >
                <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-sky-600">
                  <span>{num}</span>
                  <span className="text-slate-400">Telemetry</span>
                </div>
                <div className="text-[13px] leading-6 text-slate-700">
                  {text}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["LAT", "41.0151"],
              ["LNG", "28.9795"],
              ["ALT", "S2 REF"],
              ["SIG", "LOCKED"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white/72 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur"
              >
                <div className="text-[9px] font-mono uppercase tracking-[0.32em] text-slate-400">
                  {label}
                </div>
                <div className="mt-2 text-sm font-mono text-slate-900">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.14 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_58%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-[0_26px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-sky-400/10" />
            <div className="pointer-events-none absolute left-4 top-4 h-5 w-5 border-l border-t border-sky-500/28" />
            <div className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r border-t border-sky-500/28" />
            <div className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b border-l border-sky-500/28" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 border-b border-r border-sky-500/28" />

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  Control panel
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Adjust the mission before launch.
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-sky-700">
                Live feed
              </div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              {[
                ["scan", "13.2 ms"],
                ["grid", "L1 / N41"],
                ["lock", "AUTO"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400">
                    {label}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-700">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-slate-100">
              <Activity className="h-4 w-4 text-sky-400" strokeWidth={2} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-300">
                    Telemetry stream
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-sky-400">
                    stable
                  </span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-300 animate-data-pulse" />
                </div>
              </div>
            </div>

            {!apiKey ? (
              <motion.form
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-inner shadow-black/5 focus-within:border-sky-500">
                  <label className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
                    <Radar
                      className="h-3.5 w-3.5 text-sky-600"
                      strokeWidth={2}
                    />
                    {t.apiLabel}
                  </label>
                  <div className="relative flex items-center">
                    <Key
                      className="absolute left-0 h-4 w-4 text-sky-600/70"
                      strokeWidth={1.5}
                    />
                    <input
                      type="text"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="AIza..."
                      className="w-full bg-transparent pl-7 text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-2xl bg-slate-950 py-4 text-[11px] font-mono uppercase tracking-[0.32em] text-white shadow-[0_20px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  {t.apiBtn}
                </button>
                <p className="text-center text-[10px] leading-5 text-slate-500">
                  {t.apiSub}
                </p>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-sky-700">
                      {t.connected}
                    </span>
                  </div>
                  <span className="text-[10px] text-sky-700/70">
                    Satellite link ready
                  </span>
                </div>

                <div>
                  <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500">
                    {t.region}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {REGIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => onSetRegion(r)}
                        className={`rounded-xl border px-3 py-3 text-center text-[10px] font-mono uppercase tracking-[0.22em] transition-all ${
                          region === r
                            ? "border-sky-500 bg-sky-50 text-sky-700 shadow-[0_10px_20px_rgba(14,165,233,0.08)]"
                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                        }`}
                      >
                        {t.regionOpts[r][lang].split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500">
                    {t.difficulty}
                  </p>
                  <div className="grid gap-2">
                    {t.diffs.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDifficulty(d.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                          difficulty === d.id
                            ? "border-sky-500 bg-sky-50 shadow-[0_12px_24px_rgba(14,165,233,0.08)]"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`mb-1 text-[11px] font-mono uppercase tracking-[0.28em] ${difficulty === d.id ? "text-sky-700" : "text-slate-600"}`}
                        >
                          {d.label}
                        </div>
                        <div className="text-[12px] leading-5 text-slate-500">
                          {d.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 py-4 text-[11px] font-mono uppercase tracking-[0.34em] text-white shadow-[0_20px_40px_rgba(14,165,233,0.18)] transition hover:-translate-y-0.5 hover:bg-sky-700"
                >
                  <Crosshair
                    className="h-3.5 w-3.5 opacity-90"
                    strokeWidth={2}
                  />
                  <span>{t.start}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500">
                      <MapPin
                        className="h-3.5 w-3.5 text-sky-600"
                        strokeWidth={2}
                      />
                      Ground track
                    </div>
                    <div className="mt-2 font-mono text-[11px] text-slate-700">
                      N 41.0151 / E 28.9795
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500">
                      <Satellite
                        className="h-3.5 w-3.5 text-sky-600"
                        strokeWidth={2}
                      />
                      Orbit
                    </div>
                    <div className="mt-2 font-mono text-[11px] text-slate-700">
                      LOCKED / GEO-REF
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-5 pt-2 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 sm:px-8 lg:px-10">
        <span>© 2025 Peek &amp; Seek</span>
        <span>Powered by Google Maps</span>
      </footer>
    </main>
  );
}
