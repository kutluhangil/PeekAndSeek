import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  Crosshair,
  Globe,
  MapPin,
  Radar,
  Satellite,
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
    eyebrow: "Global map interface",
    tagline: "Where in the world\nis this?",
    sub: "Premium, minimalist, and tied to the game UI: one shared world map, one clean objective, five rounds.",
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
    eyebrow: "Küresel harita arayüzü",
    tagline: "Dünyanın neresinde\nburaydı?",
    sub: "Premium, minimalist ve oyun arayüzüyle aynı dilde: tek bir dünya haritası, tek bir hedef, beş tur.",
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

function WorldBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(247,246,242,0.94)_40%,_rgba(238,233,224,0.88)_100%)]" />
      <div className="absolute inset-0 cartography-grid opacity-30 animate-world-grid" />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.34] animate-world-drift"
        viewBox="0 0 1440 900"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="worldRoute" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.0" />
            <stop offset="22%" stopColor="#b91c1c" stopOpacity="0.34" />
            <stop offset="50%" stopColor="#7f1d1d" stopOpacity="0.48" />
            <stop offset="78%" stopColor="#b91c1c" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.0" />
          </linearGradient>
          <radialGradient id="worldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#b91c1c" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g fill="#78716c" stroke="#78716c" strokeOpacity="0.18" strokeWidth="2">
          <path d="M118 268 C150 205, 232 168, 318 174 C382 179, 434 212, 450 255 C463 291, 434 323, 376 334 C305 347, 247 333, 193 319 C142 305, 93 307, 118 268 Z" fillOpacity="0.08" />
          <path d="M302 422 C337 400, 380 399, 406 421 C429 440, 425 479, 401 503 C376 528, 356 565, 343 610 C330 658, 295 675, 276 646 C255 615, 263 564, 278 517 C293 470, 286 447, 302 422 Z" fillOpacity="0.07" />
          <path d="M575 206 C647 168, 734 165, 809 190 C847 202, 875 228, 875 256 C874 296, 841 317, 786 320 C726 323, 684 307, 642 294 C597 280, 545 255, 575 206 Z" fillOpacity="0.06" />
          <path d="M684 307 C722 285, 770 284, 823 296 C872 307, 909 335, 923 371 C937 407, 925 450, 889 467 C844 489, 793 478, 756 462 C719 446, 671 424, 664 384 C659 356, 665 321, 684 307 Z" fillOpacity="0.08" />
          <path d="M953 184 C1042 153, 1140 163, 1221 198 C1271 219, 1300 255, 1281 285 C1258 323, 1190 328, 1130 313 C1068 297, 1026 294, 977 283 C923 270, 908 205, 953 184 Z" fillOpacity="0.06" />
          <path d="M1138 488 C1172 471, 1214 474, 1241 494 C1264 510, 1262 542, 1238 560 C1210 581, 1178 580, 1150 567 C1124 554, 1111 508, 1138 488 Z" fillOpacity="0.07" />
        </g>

        <g opacity="0.22">
          <line x1="0" y1="155" x2="1440" y2="155" stroke="#78716c" strokeOpacity="0.18" />
          <line x1="0" y1="290" x2="1440" y2="290" stroke="#78716c" strokeOpacity="0.14" />
          <line x1="0" y1="450" x2="1440" y2="450" stroke="#78716c" strokeOpacity="0.12" />
          <line x1="0" y1="610" x2="1440" y2="610" stroke="#78716c" strokeOpacity="0.12" />
          <line x1="180" y1="0" x2="180" y2="900" stroke="#78716c" strokeOpacity="0.10" />
          <line x1="420" y1="0" x2="420" y2="900" stroke="#78716c" strokeOpacity="0.10" />
          <line x1="720" y1="0" x2="720" y2="900" stroke="#78716c" strokeOpacity="0.10" />
          <line x1="1020" y1="0" x2="1020" y2="900" stroke="#78716c" strokeOpacity="0.10" />
          <line x1="1260" y1="0" x2="1260" y2="900" stroke="#78716c" strokeOpacity="0.10" />
        </g>

        <g fill="none" stroke="url(#worldRoute)" strokeWidth="2.25" strokeDasharray="16 12" className="animate-world-route">
          <path d="M164 262 C 322 204, 488 208, 660 256 S 968 322, 1282 218" />
          <path d="M380 470 C 500 410, 630 418, 752 470 S 1022 566, 1274 488" />
          <path d="M608 252 C 706 222, 805 221, 890 248 S 1048 322, 1196 288" />
        </g>

        <g fill="#b91c1c" opacity="0.62">
          <circle cx="318" cy="174" r="4.5" />
          <circle cx="786" cy="320" r="4" />
          <circle cx="1130" cy="313" r="4.5" />
          <circle cx="1238" cy="560" r="4" />
          <circle cx="343" cy="610" r="4" />
        </g>

        <ellipse cx="1000" cy="360" rx="380" ry="220" fill="url(#worldGlow)" opacity="0.5" />
      </svg>

      <div className="absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-[#b91c1c]/20 to-transparent animate-world-sweep" />
      <div className="absolute left-[46%] top-0 h-full w-24 bg-[linear-gradient(180deg,transparent_0%,rgba(185,28,28,0.02)_30%,rgba(185,28,28,0.12)_50%,rgba(185,28,28,0.02)_70%,transparent_100%)] mix-blend-multiply animate-scan-sweep" />
    </div>
  );
}

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
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <WorldBackdrop />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-[0_10px_30px_rgba(17,24,39,0.06)]">
              <Satellite className="h-4 w-4 text-accent" strokeWidth={2} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
                P&amp;S v2.1
              </p>
              <p className="text-[12px] text-muted">Minimal map interface</p>
            </div>
          </div>

          <button
            onClick={() => onSetLang(lang === "en" ? "tr" : "en")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted shadow-[0_10px_30px_rgba(17,24,39,0.04)] transition hover:-translate-y-0.5 hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            {t.langToggle}
          </button>
        </header>

        <section className="grid flex-1 gap-6 py-6 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="flex h-full flex-col justify-between rounded-[28px] border border-border bg-card/92 p-6 shadow-[0_24px_80px_rgba(17,24,39,0.08)] backdrop-blur sm:p-7"
          >
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                  {t.eyebrow}
                </span>
              </div>

              <h1 className="max-w-lg font-serif italic leading-[0.92] text-foreground" style={{ fontSize: "clamp(3rem, 6.8vw, 6rem)" }}>
                {t.tagline.split("\n").map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-7 text-muted sm:text-[16px]">
                {t.sub}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["05", "Rounds"],
                  ["10", "Guesses"],
                  ["24/7", "Global map"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-border bg-background px-4 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">{label}</div>
                    <div className="mt-2 text-lg font-medium text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-border bg-background/85 p-4">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Map feed</p>
                  <p className="mt-1 text-sm text-foreground">Shared world map, minimal overlays</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
                  <Activity className="h-3.5 w-3.5" strokeWidth={2} />
                  Live
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[
                  ["Layer", "World grid"],
                  ["Focus", "Location only"],
                  ["Theme", "Game matched"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-border bg-card px-3 py-3">
                    <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted">{label}</div>
                    <div className="mt-2 text-[12px] text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="flex h-full flex-col justify-between rounded-[28px] border border-border bg-card/92 p-6 shadow-[0_24px_80px_rgba(17,24,39,0.08)] backdrop-blur sm:p-7"
          >
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Control panel</p>
                  <p className="mt-1 text-sm text-muted">Same theme as the game screen</p>
                </div>
                <div className={`rounded-full border px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] ${apiKey ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-border bg-background text-muted"}`}>
                  {apiKey ? t.connected : "Stand by"}
                </div>
              </div>

              {!apiKey ? (
                <motion.form
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-border bg-background p-4 focus-within:border-accent transition-colors">
                    <label className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-muted">
                      <Radar className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                      {t.apiLabel}
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-0 h-4 w-4 text-muted" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="AIza..."
                        className="w-full bg-transparent pl-7 text-[14px] text-foreground outline-none placeholder:text-muted/70"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-[11px] font-mono uppercase tracking-[0.34em] text-white shadow-[0_18px_40px_rgba(185,28,28,0.18)] transition hover:-translate-y-0.5 hover:bg-accent-hover"
                  >
                    <Crosshair className="h-3.5 w-3.5" strokeWidth={2} />
                    {t.apiBtn}
                  </button>

                  <p className="text-center text-[10px] leading-5 text-muted">
                    {t.apiSub}
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-700">
                        {t.connected}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700/70">World map ready</span>
                  </div>

                  <div>
                    <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.28em] text-muted">
                      {t.region}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {REGIONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => onSetRegion(r)}
                          className={`rounded-xl border px-3 py-3 text-center text-[10px] font-mono uppercase tracking-[0.22em] transition-all ${
                            region === r
                              ? "border-accent bg-accent/5 text-accent"
                              : "border-border bg-background text-muted hover:border-muted hover:text-foreground"
                          }`}
                        >
                          {t.regionOpts[r][lang].split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.28em] text-muted">
                      {t.difficulty}
                    </p>
                    <div className="grid gap-2">
                      {t.diffs.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDifficulty(d.id)}
                          className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                            difficulty === d.id
                              ? "border-accent bg-accent/5"
                              : "border-border bg-background hover:border-muted"
                          }`}
                        >
                          <div className={`mb-1 text-[11px] font-mono uppercase tracking-[0.28em] ${difficulty === d.id ? "text-accent" : "text-muted"}`}>
                            {d.label}
                          </div>
                          <div className="text-[12px] leading-5 text-muted">{d.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleStart}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-[11px] font-mono uppercase tracking-[0.34em] text-white shadow-[0_18px_40px_rgba(185,28,28,0.18)] transition hover:-translate-y-0.5 hover:bg-accent-hover"
                  >
                    <Crosshair className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>{t.start}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-border bg-background px-4 py-3">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-muted">
                        <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                        Ground track
                      </div>
                      <div className="mt-2 font-mono text-[11px] text-foreground">N 41.0151 / E 28.9795</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background px-4 py-3">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-muted">
                        <Satellite className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                        Orbit
                      </div>
                      <div className="mt-2 font-mono text-[11px] text-foreground">LOCKED / GEO-REF</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.article>
        </section>

        <footer className="flex items-center justify-between border-t border-border/70 py-4 text-[10px] font-mono uppercase tracking-[0.25em] text-muted">
          <span>© 2025 Peek &amp; Seek</span>
          <span>Powered by Google Maps</span>
        </footer>
      </div>
    </main>
  );
}