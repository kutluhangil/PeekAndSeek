import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  MapPin, Target, ChevronLeft, Navigation, X, Camera, Eye,
  Map as MapIcon, Share2, RotateCcw, Compass, Plus, Minus,
  Flag, Clock, Maximize2, Lightbulb, Trophy, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredItem, setStoredItem } from "../lib/storage";
import { generateLocation } from "../lib/regions";
import { calculateScore, scoreColorClass, scoreGrade } from "../lib/scoring";
import { getLeaderboard, saveToLeaderboard } from "../lib/leaderboard";
import { WorldMap } from "./WorldMap";
import type { Lang } from "../App";
import type { Region } from "../lib/regions";

const STORAGE_KEY = "geoseeker_game_state_v3";
const TOTAL_ROUNDS = 5;
const MAP_ID = "DEMO_MAP_ID";

interface MapSectionProps {
  onBack: () => void;
  apiKey: string;
  lang: Lang;
  region: Region;
}

interface RoundResult { round: number; score: number; distanceKm: number; guessesUsed: number; }

// ─── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    abort: "Abort", intelReport: "Intel Report", fix: "Fix",
    visualFeed: "Visual Feed", feedDisabled: "Feed Disabled",
    feedDisabledDesc: "Cartographic mode active. No remote visuals.",
    feedLost: "Feed Lost — no coverage here.",
    plotCoordinates: "Plot Coordinates", placeWaypoint: "Place Waypoint",
    cancelWaypoint: "Cancel Waypoint", reset: "Reset", trace: "Trace",
    dispatchLink: "Share", clickToEnlarge: "Click to enlarge",
    attempts: "/ 10 tries", gameRestoredMsg: "Session restored.",
    gameResetMsg: "Game reset.", signalTracedMsg: "Signal Traced. Round Over.",
    linkCopiedMsg: "Link Copied!", acknowledgeTutorial: "Let's go",
    tutorialTitle: "Cartographer's Manual",
    tutorialBody: "A street-level photo of the hidden target appears in the Visual Feed. Study it, pan the map to where you think it was taken, and hit Plot Coordinates. 5 rounds — up to 5,000 pts each.",
    initialClue: "Study the visual feed. Pan to your best guess and plot coordinates.",
    veryClose: "You're on top of it! Target confirmed.",
    directionalDisabled: (d: string) => `Sensors disabled. Radius: ${d} km.`,
    headDir: (dir: string, d: string, lm: string | null) =>
      lm ? `Head ${dir} towards ${lm}. ~${d} km.` : `Head ${dir}. ~${d} km.`,
    firstGuessMsg: "First guess logged. Refine your position.",
    significantProgressMsg: "Excellent — major progress!",
    gettingWarmerMsg: "Getting warmer.",
    circlingMsg: "Circling the target.",
    movingAwayMsg: "Moving away. Reverse course.",
    wrongDirectionMsg: "Wrong direction!",
    foundTargetMsg: "Target found!",
    gameOverMsg: "Out of guesses.",
    remove: "Remove",
    north: "North", south: "South", east: "East", west: "West",
    hintBtn: "Country Hint (−1 guess)",
    hintUsed: "Hint used",
    countryPrefix: "Country:",
    roundLabel: (r: number) => `Round ${r} of ${TOTAL_ROUNDS}`,
    roundResult: "Round Complete",
    nextRound: "Next Round →",
    finalResult: "Mission Debrief",
    totalScore: "Total Score",
    maxScore: `${TOTAL_ROUNDS * 5000} pts max`,
    playAgain: "Play Again",
    backToMenu: "Main Menu",
    distance: "Distance",
    guesses: "Guesses",
    pts: "pts",
    leaderboard: "Top Scores",
    noScores: "No scores yet.",
    grade: "Grade",
  },
  tr: {
    abort: "Geri", intelReport: "İstihbarat", fix: "Konum",
    visualFeed: "Görsel Akış", feedDisabled: "Akış Kapalı",
    feedDisabledDesc: "Kartografik mod aktif. Uzak görsel yok.",
    feedLost: "Akış Kesildi — burada kapsama yok.",
    plotCoordinates: "Koordinat Gönder", placeWaypoint: "Ara Nokta Ekle",
    cancelWaypoint: "İptal", reset: "Sıfırla", trace: "Keşfet",
    dispatchLink: "Paylaş", clickToEnlarge: "Büyütmek için tıkla",
    attempts: "/ 10 hamle", gameRestoredMsg: "Oturum geri yüklendi.",
    gameResetMsg: "Oyun sıfırlandı.", signalTracedMsg: "Sinyal İzlendi. Tur Bitti.",
    linkCopiedMsg: "Link Kopyalandı!", acknowledgeTutorial: "Hadi başlayalım",
    tutorialTitle: "Kartograf Rehberi",
    tutorialBody: "Görsel Akış'ta gizli hedefin sokak fotoğrafı görünür. İncele, haritayı fotoğrafın çekildiğini düşündüğün yere kaydır ve Koordinat Gönder'e bas. 5 tur — her tur için en fazla 5.000 puan.",
    initialClue: "Görsel akışı incele. Haritayı tahmin ettiğin yere kaydır ve koordinat gönder.",
    veryClose: "Tam üzerindesin! Hedef doğrulandı.",
    directionalDisabled: (d: string) => `Sensörler devre dışı. Yarıçap: ${d} km.`,
    headDir: (dir: string, d: string, lm: string | null) =>
      lm ? `${dir} yönünde, ${lm} bölgesine. ~${d} km.` : `${dir} yönünde. ~${d} km.`,
    firstGuessMsg: "İlk tahmin kaydedildi. Konumunu geliştir.",
    significantProgressMsg: "Mükemmel — büyük ilerleme!",
    gettingWarmerMsg: "Isınıyorsun.",
    circlingMsg: "Hedefi çevreliyorsun.",
    movingAwayMsg: "Uzaklaşıyorsun. Geri dön.",
    wrongDirectionMsg: "Yanlış yön!",
    foundTargetMsg: "Hedef bulundu!",
    gameOverMsg: "Hamleler doldu.",
    remove: "Kaldır",
    north: "Kuzey", south: "Güney", east: "Doğu", west: "Batı",
    hintBtn: "Ülke İpucu (−1 hamle)",
    hintUsed: "İpucu kullanıldı",
    countryPrefix: "Ülke:",
    roundLabel: (r: number) => `Tur ${r} / ${TOTAL_ROUNDS}`,
    roundResult: "Tur Tamamlandı",
    nextRound: "Sonraki Tur →",
    finalResult: "Görev Özeti",
    totalScore: "Toplam Puan",
    maxScore: `${TOTAL_ROUNDS * 5000} puan max`,
    playAgain: "Tekrar Oyna",
    backToMenu: "Ana Menü",
    distance: "Mesafe",
    guesses: "Hamle",
    pts: "puan",
    leaderboard: "En Yüksek Puanlar",
    noScores: "Henüz puan yok.",
    grade: "Not",
  },
};

// ─── Map styles ────────────────────────────────────────────────────────────────
const lightStyles = [
  { elementType: "geometry", stylers: [{ color: "#f7f6f2" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#57534e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f7f6f2" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e7e5e4" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dde4e8" }] },
];

const darkStyles = [
  { elementType: "geometry", stylers: [{ color: "#1c1917" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a8a29e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1c1917" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#111" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000" }] },
];

// ─── Utilities ─────────────────────────────────────────────────────────────────
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371, dLat = ((lat2 - lat1) * Math.PI) / 180, dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDirLabel(lat1: number, lon1: number, lat2: number, lon2: number, t: typeof T["en"]) {
  const la = lat2 - lat1, lo = lon2 - lon1;
  let d = "";
  if (la > 0) d += t.north; else if (la < 0) d += t.south;
  if (lo > 0) d += d ? `-${t.east}` : t.east; else if (lo < 0) d += d ? `-${t.west}` : t.west;
  return d;
}

// ─── 360° Street View panorama component ───────────────────────────────────────
function StreetViewPane({
  location, onError, onLoaded,
}: { location: { lat: number; lng: number }; onError: () => void; onLoaded: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const streetViewLib = useMapsLibrary("streetView");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    if (!streetViewLib || !containerRef.current) return;
    const svc = new streetViewLib.StreetViewService();
    svc.getPanorama({ location, radius: 250 }, (data: any, status: any) => {
      if (status !== "OK" || !data?.location?.latLng || !containerRef.current) {
        onError();
        return;
      }
      new streetViewLib.StreetViewPanorama(containerRef.current, {
        position: data.location.latLng,
        disableDefaultUI: true,
        clickToGo: false,
        panControl: false,
        zoomControl: false,
        scrollwheel: false,
        linksControl: false,
        addressControl: false,
        fullscreenControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        showRoadLabels: false,
      });
      setReady(true);
      onLoaded();
    });
  }, [streetViewLib, location.lat, location.lng]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Target className="w-5 h-5 text-muted animate-spin-slow opacity-40" strokeWidth={1} />
        </div>
      )}
    </div>
  );
}

// ─── Round Result overlay ──────────────────────────────────────────────────────
function RoundResultOverlay({
  result, onNext, isLast, t,
}: { result: RoundResult; onNext: () => void; isLast: boolean; t: typeof T["en"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-6"
    >
      <div className="w-full max-w-sm bg-card border border-border p-8 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-mono">
            {t.roundResult}
          </p>
          <p className="text-[10px] text-muted font-mono">{t.roundLabel(result.round)}</p>
        </div>

        <div className="text-center">
          <div className={`text-5xl font-serif font-bold mb-1 ${scoreColorClass(result.score)}`}>
            {result.score.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted font-mono uppercase tracking-widest">{t.pts}</div>
        </div>

        {/* Grade */}
        <div className="flex justify-center">
          <div className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-serif font-bold ${scoreColorClass(result.score)} border-current`}>
            {scoreGrade(result.score)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono text-muted border-t border-border pt-4">
          <div>
            <div className="text-foreground font-medium">{result.distanceKm < 1 ? `${Math.round(result.distanceKm * 1000)} m` : `${result.distanceKm.toFixed(1)} km`}</div>
            <div className="text-[9px] uppercase tracking-wider mt-0.5">{t.distance}</div>
          </div>
          <div>
            <div className="text-foreground font-medium">{result.guessesUsed}</div>
            <div className="text-[9px] uppercase tracking-wider mt-0.5">{t.guesses}</div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full border-2 border-accent bg-accent text-white py-3 text-[11px] font-mono uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
        >
          {isLast ? t.finalResult : t.nextRound}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Final Result overlay ──────────────────────────────────────────────────────
function FinalResultOverlay({
  results, region, lang, onPlayAgain, onMenu, t,
}: { results: RoundResult[]; region: Region; lang: Lang; onPlayAgain: () => void; onMenu: () => void; t: typeof T["en"] }) {
  const total = results.reduce((s, r) => s + r.score, 0);
  const maxPossible = TOTAL_ROUNDS * 5000;
  const overall = scoreGrade(Math.round(total / TOTAL_ROUNDS));
  const board = getLeaderboard();

  useEffect(() => {
    saveToLeaderboard({ totalScore: total, maxScore: maxPossible, rounds: TOTAL_ROUNDS, region, date: new Date().toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US") });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div className="w-full max-w-sm bg-card border border-border p-6 space-y-5 my-auto">
        {/* Header */}
        <div className="text-center">
          <Trophy className="w-8 h-8 text-accent mx-auto mb-3" strokeWidth={1} />
          <h2 className="text-xl font-serif italic text-foreground">{t.finalResult}</h2>
        </div>

        {/* Round breakdown */}
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.round} className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted w-14 shrink-0">
                {t.roundLabel(r.round).split(" ").slice(0, 2).join(" ")}
              </span>
              <div className="flex-1 h-1.5 bg-muted-bg rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${scoreColorClass(r.score).replace("text-", "bg-")}`}
                  style={{ width: `${(r.score / 5000) * 100}%`, transition: "width 0.8s ease" }}
                />
              </div>
              <span className={`font-mono text-[11px] w-12 text-right ${scoreColorClass(r.score)}`}>
                {r.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted font-mono">{t.totalScore}</p>
            <p className="text-2xl font-serif font-bold text-foreground">{total.toLocaleString()}</p>
            <p className="text-[10px] text-muted font-mono">{t.maxScore}</p>
          </div>
          <div className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-serif font-bold ${scoreColorClass(Math.round(total / TOTAL_ROUNDS))} border-current`}>
            {overall}
          </div>
        </div>

        {/* Leaderboard */}
        {board.length > 0 && (
          <div className="border-t border-border pt-4">
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted font-mono mb-3 flex items-center gap-2">
              <Trophy className="w-3 h-3" /> {t.leaderboard}
            </p>
            <div className="space-y-1.5">
              {board.slice(0, 5).map((e, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted">{i + 1}.</span>
                  <span className="text-muted flex-1 mx-2 truncate">{e.date} · {e.region}</span>
                  <span className={scoreColorClass(Math.round(e.totalScore / e.rounds))}>{e.totalScore.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button onClick={onMenu} className="py-3 border border-border text-foreground font-mono text-[10px] uppercase tracking-wider hover:bg-muted-bg transition-colors flex items-center justify-center gap-1.5">
            <ChevronLeft className="w-3 h-3" /> {t.backToMenu}
          </button>
          <button onClick={onPlayAgain} className="py-3 border-2 border-accent bg-accent text-white font-mono text-[10px] uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5">
            <RotateCcw className="w-3 h-3" /> {t.playAgain}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MapContent ────────────────────────────────────────────────────────────────
function MapContent({ onBack, apiKey, lang, region }: MapSectionProps) {
  const map = useMap();
  const t = T[lang];

  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [heading, setHeading] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isWaypointMode, setIsWaypointMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => getStoredItem("geoseeker_tutorial_seen_v3") !== "true");

  // Round & game state
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [gamePhase, setGamePhase] = useState<"playing" | "round-result" | "final-result">("playing");
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);

  // Per-round state
  const [hiddenLocation, setHiddenLocation] = useState(() => generateLocation(region));
  const [guessesCount, setGuessesCount] = useState(0);
  const [previousDistance, setPreviousDistance] = useState<number | null>(null);
  const [waypoints, setWaypoints] = useState<Array<{ lat: number; lng: number; id: string }>>([]);
  const [revealed, setRevealed] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Feed state
  const [svOk, setSvOk] = useState<boolean | null>(null);
  const [landmark, setLandmark] = useState<string | null>(null);
  const [countryHint, setCountryHint] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);

  const difficulty = new URLSearchParams(window.location.search).get("difficulty") || "medium";
  const winThreshold = difficulty === "hard" ? 0.05 : difficulty === "easy" ? 0.5 : 0.1;
  const hideStreetView = difficulty === "hard";
  const hideDirection = difficulty === "hard";

  // Dark theme observer
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Timer
  useEffect(() => {
    if (roundOver) return;
    const id = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [roundOver, startTime]);

  // Geocode hidden location for landmark + country hints
  useEffect(() => {
    if (!window.google?.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: hiddenLocation }, (results: any, status: any) => {
      if (status !== "OK" || !results?.length) return;
      // Landmark
      const poi = results.find((r: any) => r.types.includes("point_of_interest") || r.types.includes("route"));
      setLandmark((poi || results[0]).address_components[0].long_name);
      // Country
      for (const r of results) {
        const c = r.address_components.find((a: any) => a.types.includes("country"));
        if (c) { setCountryHint(c.long_name); break; }
      }
    });
  }, [hiddenLocation]);

  const distance = getDistance(center.lat, center.lng, hiddenLocation.lat, hiddenLocation.lng);
  const direction = getDirLabel(center.lat, center.lng, hiddenLocation.lat, hiddenLocation.lng, t);

  let clue: string;
  if (distance < winThreshold) clue = t.veryClose;
  else if (guessesCount === 0) clue = t.initialClue;
  else if (hideDirection) clue = t.directionalDisabled(distance.toFixed(1));
  else clue = t.headDir(direction, distance.toFixed(1), guessesCount >= 2 ? landmark : null);

  const endRound = useCallback((finalDistance: number, finalGuesses: number) => {
    const score = calculateScore(finalDistance);
    const result: RoundResult = { round: currentRound, score, distanceKm: finalDistance, guessesUsed: finalGuesses };
    const newResults = [...roundResults, result];
    setRoundResults(newResults);
    setLastResult(result);
    setRevealed(true);
    setRoundOver(true);

    if (currentRound >= TOTAL_ROUNDS) {
      setGamePhase("final-result");
    } else {
      setGamePhase("round-result");
    }
  }, [currentRound, roundResults]);

  const handleGuess = () => {
    if (roundOver) return;
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 400);
    const newCount = guessesCount + 1;
    setGuessesCount(newCount);

    let fb = "";
    if (distance < winThreshold) {
      fb = t.foundTargetMsg;
      endRound(distance, newCount);
    } else if (newCount >= 10) {
      fb = t.gameOverMsg;
      endRound(distance, newCount);
    } else if (previousDistance === null) {
      fb = t.firstGuessMsg;
    } else {
      const diff = previousDistance - distance;
      if (diff > 0.5) fb = t.significantProgressMsg;
      else if (diff > 0.05) fb = t.gettingWarmerMsg;
      else if (diff > -0.05) fb = t.circlingMsg;
      else if (diff > -0.4) fb = t.movingAwayMsg;
      else fb = t.wrongDirectionMsg;
    }

    setPreviousDistance(distance);
    if (fb) { setFeedback(fb); setTimeout(() => setFeedback(null), 3000); }
  };

  const handleHint = () => {
    if (hintUsed || guessesCount >= 9) return;
    setHintUsed(true);
    setGuessesCount((c) => c + 1);
    if (countryHint) {
      setFeedback(`${t.countryPrefix} ${countryHint}`);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const startNextRound = () => {
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setHiddenLocation(generateLocation(region));
    setGuessesCount(0);
    setPreviousDistance(null);
    setWaypoints([]);
    setRevealed(false);
    setRoundOver(false);
    setLandmark(null);
    setCountryHint(null);
    setHintUsed(false);
    setSvOk(null);
    setFeedback(null);
    setGamePhase("playing");
  };

  const handlePlayAgain = () => {
    setCurrentRound(1);
    setRoundResults([]);
    setLastResult(null);
    setHiddenLocation(generateLocation(region));
    setGuessesCount(0);
    setPreviousDistance(null);
    setWaypoints([]);
    setRevealed(false);
    setRoundOver(false);
    setLandmark(null);
    setCountryHint(null);
    setHintUsed(false);
    setSvOk(null);
    setFeedback(null);
    setGamePhase("playing");
  };

  const handleTrace = () => {
    endRound(distance, guessesCount);
    setFeedback(t.signalTracedMsg);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("targetLat", hiddenLocation.lat.toFixed(5));
    url.searchParams.set("targetLng", hiddenLocation.lng.toFixed(5));
    const shareUrl = url.toString();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setFeedback(t.linkCopiedMsg);
        setTimeout(() => setFeedback(null), 2500);
      }).catch(() => window.prompt("Copy:", shareUrl));
    } else {
      window.prompt("Copy:", shareUrl);
    }
  };

  const totalSoFar = roundResults.reduce((s, r) => s + r.score, 0);

  return (
    <div className="relative w-full h-[100dvh] bg-[var(--background)] overflow-hidden flex flex-col md:flex-row">
      <WorldMap opacity={0.05} />
      {/* ─── 360° Modal ──────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && svOk && !hideStreetView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
            onClick={() => setIsModalOpen(false)}
          >
            <button className="absolute top-4 right-4 z-10 text-white/60 hover:text-white" onClick={() => setIsModalOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <StreetViewPane location={hiddenLocation} onError={() => setIsModalOpen(false)} onLoaded={() => {}} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Tutorial ────────────────────────────────── */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-6">
            <div className="bg-card w-full max-w-md p-8 border border-border shadow-2xl text-center space-y-5">
              <Compass className="w-10 h-10 text-foreground/30 mx-auto" strokeWidth={1} />
              <h3 className="text-2xl font-serif italic text-foreground">{t.tutorialTitle}</h3>
              <p className="text-[13px] text-foreground/70 font-light leading-relaxed">{t.tutorialBody}</p>
              <button onClick={() => { setStoredItem("geoseeker_tutorial_seen_v3", "true"); setShowTutorial(false); }} className="w-full border border-foreground bg-foreground text-card py-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-transparent hover:text-foreground transition-all">
                {t.acknowledgeTutorial}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Round & Final Result overlays ───────────── */}
      <AnimatePresence>
        {gamePhase === "round-result" && lastResult && (
          <RoundResultOverlay result={lastResult} onNext={startNextRound} isLast={false} t={t} />
        )}
        {gamePhase === "final-result" && (
          <FinalResultOverlay results={roundResults} region={region} lang={lang} onPlayAgain={handlePlayAgain} onMenu={onBack} t={t} />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─────────────────────────────────── */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`${sidebarOpen ? "w-full md:w-[340px] h-[55%] md:h-full" : "w-0 hidden md:block"} bg-[var(--card)] border-t md:border-t-0 md:border-r border-[var(--border)] flex flex-col shrink-0 z-20 shadow-xl md:shadow-none`}
      >
        {sidebarOpen && (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background)]">
              <button onClick={onBack} className="text-muted hover:text-foreground flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium transition-colors">
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> {t.abort}
              </button>
              <div className="flex items-center gap-3">
                {/* Round indicator */}
                <div className="flex gap-1">
                  {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < currentRound - 1 ? "bg-accent" : i === currentRound - 1 ? "bg-accent animate-pulse" : "bg-border"}`} />
                  ))}
                </div>
                {/* Score so far */}
                {roundResults.length > 0 && (
                  <span className="font-mono text-[10px] text-muted">{totalSoFar.toLocaleString()} {t.pts}</span>
                )}
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-muted hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Intel */}
              <div>
                <h2 className="text-[9px] uppercase tracking-[0.28em] text-muted mb-3 border-b border-border pb-1.5 flex items-center gap-2">
                  <Eye className="w-3 h-3" /> {t.intelReport}
                </h2>
                <p className="text-[13px] font-serif italic leading-relaxed text-foreground/85">"{clue}"</p>
                {hintUsed && countryHint && (
                  <p className="mt-2 text-[11px] font-mono text-accent/80">{t.countryPrefix} {countryHint}</p>
                )}
              </div>

              {/* Fix */}
              <div>
                <h2 className="text-[9px] uppercase tracking-[0.28em] text-muted mb-3 border-b border-border pb-1.5 flex justify-between items-center">
                  <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {t.fix}</span>
                  <div className="flex gap-3 font-mono text-[9px]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")}</span>
                    <span>{guessesCount} {t.attempts}</span>
                  </div>
                </h2>
                <div className="bg-muted-bg/40 p-3 border border-border border-dashed font-mono text-[12px] tracking-tight text-foreground/75 grid grid-cols-2 gap-1">
                  <span>LAT: {center.lat.toFixed(4)}</span>
                  <span>LNG: {center.lng.toFixed(4)}</span>
                </div>
              </div>

              {/* Visual Feed */}
              <div>
                <h2 className="text-[9px] uppercase tracking-[0.28em] text-muted mb-3 border-b border-border pb-1.5 flex items-center gap-2">
                  <Camera className="w-3 h-3" /> {t.visualFeed}
                </h2>
                <div
                  className={`aspect-video bg-muted-bg border border-border relative overflow-hidden ${svOk && !hideStreetView ? "cursor-zoom-in group" : ""}`}
                  onClick={() => svOk && !hideStreetView && setIsModalOpen(true)}
                >
                  {hideStreetView ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                      <span className="text-[10px] uppercase tracking-widest text-accent font-medium">{t.feedDisabled}</span>
                      <p className="text-[10px] text-muted font-mono">{t.feedDisabledDesc}</p>
                    </div>
                  ) : svOk === false ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                      <span className="text-[10px] uppercase tracking-widest text-accent font-medium">{t.feedLost.split("—")[0]}</span>
                      <p className="text-[10px] text-muted font-mono">{t.feedLost.split("—")[1]}</p>
                    </div>
                  ) : (
                    <>
                      <StreetViewPane
                        location={hiddenLocation}
                        onError={() => setSvOk(false)}
                        onLoaded={() => setSvOk(true)}
                      />
                      {svOk && (
                        <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-black/60 text-white text-[9px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5 font-mono">
                            <Maximize2 className="w-3 h-3" /> {t.clickToEnlarge}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t border-border bg-muted-bg/20 space-y-3 relative">
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-12 left-4 right-4 bg-card border border-border shadow-lg p-2.5 text-center text-[10px] uppercase tracking-wider font-bold text-foreground"
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleGuess}
                disabled={roundOver}
                className="w-full border-2 border-accent bg-accent text-white py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-accent-hover transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <Target className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
                {t.plotCoordinates}
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                {/* Hint */}
                <button
                  onClick={handleHint}
                  disabled={hintUsed || roundOver || guessesCount >= 9}
                  className="py-2 border border-border font-mono text-[9px] uppercase text-foreground hover:bg-muted-bg transition-colors flex items-center justify-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  <Lightbulb className="w-3 h-3" />
                  {hintUsed ? t.hintUsed : t.hintBtn.split("(")[0].trim()}
                </button>
                {/* Waypoint */}
                <button
                  onClick={() => setIsWaypointMode(!isWaypointMode)}
                  className={`py-2 border border-border font-mono text-[9px] uppercase transition-colors flex items-center justify-center gap-1 ${isWaypointMode ? "bg-muted-bg text-accent" : "text-foreground hover:bg-muted-bg"}`}
                >
                  <Flag className="w-3 h-3" /> {isWaypointMode ? t.cancelWaypoint : t.placeWaypoint}
                </button>
                {/* Trace */}
                <button
                  onClick={handleTrace}
                  disabled={roundOver}
                  className="py-2 border border-border text-foreground font-mono text-[9px] uppercase hover:bg-muted-bg transition-colors flex items-center justify-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  <MapIcon className="w-3 h-3" /> {t.trace}
                </button>
                {/* Share */}
                <button
                  onClick={handleShare}
                  className="py-2 border border-border text-foreground font-mono text-[9px] uppercase hover:bg-muted-bg transition-colors flex items-center justify-center gap-1"
                >
                  <Share2 className="w-3 h-3" /> {t.dispatchLink}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* ─── Map ─────────────────────────────────────── */}
      <div className="flex-1 relative h-full">
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="absolute bottom-6 left-6 md:top-6 md:bottom-auto z-10 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-xl hover:bg-muted-bg transition-colors">
            <Navigation className="w-5 h-5 text-foreground" strokeWidth={1} />
          </button>
        )}

        {/* Compass + zoom */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-center gap-2">
          <div
            className="w-11 h-11 bg-card border border-border rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-muted-bg transition-colors"
            onClick={() => map && map.setHeading(0)}
          >
            <motion.div animate={{ rotate: -heading }} transition={{ type: "spring", stiffness: 280, damping: 28 }} className="w-full h-full relative">
              <div className="absolute text-accent text-[10px] font-bold top-1 left-1/2 -translate-x-1/2">N</div>
              <div className="w-px h-1/2 bg-accent absolute bottom-1/2 left-1/2 -translate-x-1/2" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
              <div className="w-px h-1/2 bg-muted absolute top-1/2 left-1/2 -translate-x-1/2" style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }} />
            </motion.div>
          </div>
          <div className="flex flex-col bg-card border border-border shadow-lg overflow-hidden rounded mt-1">
            <button onClick={() => map && map.setZoom((map.getZoom() || 14) + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-muted-bg border-b border-border transition-colors text-foreground">
              <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <button onClick={() => map && map.setZoom((map.getZoom() || 14) - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-muted-bg transition-colors text-foreground">
              <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <GoogleMap
          defaultZoom={3}
          defaultCenter={{ lat: 20, lng: 0 }}
          mapId={MAP_ID}
          disableDefaultUI
          styles={isDark ? darkStyles : lightStyles}
          options={{ draggableCursor: isWaypointMode ? "crosshair" : undefined }}
          onClick={(e) => {
            if (isWaypointMode && e.detail.latLng) {
              setWaypoints((w) => [...w, { lat: e.detail.latLng!.lat, lng: e.detail.latLng!.lng, id: Date.now().toString() }]);
              setIsWaypointMode(false);
            }
          }}
          onCameraChanged={(e) => { setCenter(e.detail.center); setHeading(e.detail.heading || 0); }}
        >
          <AdvancedMarker position={center} zIndex={50}>
            <motion.div animate={{ scale: isPulsing ? 1.4 : 1 }} transition={{ duration: 0.2 }}>
              <Pin background="#111" borderColor="#111" glyphColor="#fff" scale={0.8} />
            </motion.div>
          </AdvancedMarker>

          {revealed && (
            <AdvancedMarker position={hiddenLocation} zIndex={60}>
              <Pin background="#b91c1c" borderColor="#7f1d1d" glyphColor="#fff" scale={1.2} />
            </AdvancedMarker>
          )}

          {waypoints.map((wp) => (
            <AdvancedMarker key={wp.id} position={{ lat: wp.lat, lng: wp.lng }} zIndex={45} onClick={() => setWaypoints((w) => w.filter((x) => x.id !== wp.id))}>
              <div className="cursor-pointer group relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-card text-foreground text-[9px] whitespace-nowrap px-2 py-1 shadow border border-border opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.remove}
                </div>
                <Pin background="#fcd34d" borderColor="#b45309" glyphColor="#b45309" scale={0.7} />
              </div>
            </AdvancedMarker>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

// ─── Public export ─────────────────────────────────────────────────────────────
export default function MapSection(props: MapSectionProps) {
  if (!props.apiKey) {
    const t = T[props.lang];
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border border-border shadow-2xl p-8 text-center space-y-5">
          <h1 className="text-2xl font-serif italic text-foreground">Map session unavailable</h1>
          <p className="text-sm text-muted">A Google Maps API key is required.</p>
          <button onClick={props.onBack} className="w-full border-2 border-accent bg-accent text-white py-3 text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-accent-hover transition-colors">
            {t.abort}
          </button>
        </div>
      </div>
    );
  }
  return (
    <APIProvider apiKey={props.apiKey}>
      <MapContent {...props} />
    </APIProvider>
  );
}
