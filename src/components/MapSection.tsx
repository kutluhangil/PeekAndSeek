import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  Target,
  ChevronLeft,
  Navigation,
  X,
  Camera,
  Eye,
  Map as MapIcon,
  Share2,
  RotateCcw,
  Compass,
  Plus,
  Minus,
  Flag,
  Clock,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredItem, setStoredItem } from "../lib/storage";
import type { Lang } from "../App";

const STORAGE_KEY = "geoseeker_game_state";

interface MapSectionProps {
  onBack: () => void;
  apiKey: string;
  lang: Lang;
}

const MAP_ID = "DEMO_MAP_ID";

const T = {
  en: {
    abort: "Abort",
    intelReport: "Intel Report",
    fix: "Fix",
    visualFeed: "Visual Feed",
    feedDisabled: "Feed Disabled",
    feedDisabledDesc: "Cartographic mode active. No remote visuals.",
    feedLost: "Feed Lost",
    plotCoordinates: "Plot Coordinates",
    placeWaypoint: "Place Waypoint",
    cancelWaypoint: "Cancel Waypoint",
    reset: "Reset",
    trace: "Trace",
    dispatchLink: "Dispatch Link",
    clickToEnlarge: "Click image to enlarge",
    attempts: "/ 10 attempts",
    gameRestoredMsg: "Game session restored.",
    gameResetMsg: "Game reset. New coordinates established.",
    signalTracedMsg: "Signal Traced. Game Over.",
    linkCopiedMsg: "Intel Link Copied",
    copyFromPromptMsg: "Copy the link from the prompt",
    acknowledgeTutorial: "Acknowledge",
    tutorialTitle: "Cartographer's Manual",
    tutorialBody:
      "A street-level photo of the hidden target is shown in the Visual Feed. Study it carefully, then pan the map to where you think it was taken and hit Plot Coordinates. You have exactly 10 guesses.",
    initialClue:
      "Study the visual feed. Pan the map to your best guess and plot coordinates.",
    veryClose: "You're extremely close! Target is right here.",
    directionalDisabled: (dist: string) =>
      `Directional sensors disabled. Radius anomaly: ${dist} km.`,
    headDir: (dir: string, dist: string, landmark: string | null) =>
      landmark
        ? `Head ${dir} towards area of ${landmark}. Approximately ${dist} km away.`
        : `Head ${dir}. Approximately ${dist} km away.`,
    firstGuessMsg: "First guess plotted. Scan again.",
    significantProgressMsg: "Excellent! You made significant progress.",
    gettingWarmerMsg: "You are getting warmer.",
    circlingMsg: "You are circling the target.",
    movingAwayMsg: "You are moving away. Turn back.",
    wrongDirectionMsg: "You are heading in the wrong direction!",
    foundTargetMsg: "You found the target!",
    gameOverMsg: "Game Over! You ran out of guesses.",
    remove: "Remove",
    north: "North",
    south: "South",
    east: "East",
    west: "West",
  },
  tr: {
    abort: "Geri",
    intelReport: "İstihbarat",
    fix: "Konum",
    visualFeed: "Görsel Akış",
    feedDisabled: "Akış Kapalı",
    feedDisabledDesc: "Kartografik mod aktif. Uzak görsel yok.",
    feedLost: "Akış Kesildi",
    plotCoordinates: "Koordinat Gönder",
    placeWaypoint: "Ara Nokta Ekle",
    cancelWaypoint: "İptal",
    reset: "Sıfırla",
    trace: "Keşfet",
    dispatchLink: "Link Kopyala",
    clickToEnlarge: "Büyütmek için tıkla",
    attempts: "/ 10 hamle",
    gameRestoredMsg: "Oyun oturumu geri yüklendi.",
    gameResetMsg: "Oyun sıfırlandı. Yeni koordinatlar belirlendi.",
    signalTracedMsg: "Sinyal İzlendi. Oyun Bitti.",
    linkCopiedMsg: "Bağlantı Kopyalandı",
    copyFromPromptMsg: "Bağlantıyı iletişim kutusundan kopyalayın",
    acknowledgeTutorial: "Anladım",
    tutorialTitle: "Kartograf Rehberi",
    tutorialBody:
      "Görsel Akış'ta gizli hedefin sokak seviyesinden fotoğrafı gösterilir. Dikkatlice incele, ardından haritayı fotoğrafın çekildiğini düşündüğün yere kaydır ve Koordinat Gönder'e bas. Tam 10 hamlen var.",
    initialClue:
      "Görsel akışı incele. Haritayı tahmin ettiğin yere kaydır ve koordinat gönder.",
    veryClose: "Çok yakındasın! Hedef tam burada.",
    directionalDisabled: (dist: string) =>
      `Yönsel sensörler devre dışı. Yarıçap anomalisi: ${dist} km.`,
    headDir: (dir: string, dist: string, landmark: string | null) =>
      landmark
        ? `${dir}, ${landmark} bölgesine doğru. Yaklaşık ${dist} km uzaklıkta.`
        : `${dir} yönünde. Yaklaşık ${dist} km uzaklıkta.`,
    firstGuessMsg: "İlk tahmin gönderildi. Tekrar tara.",
    significantProgressMsg: "Mükemmel! Önemli ilerleme kaydettiniz.",
    gettingWarmerMsg: "Isınıyorsunuz.",
    circlingMsg: "Hedefi çevreliyorsunuz.",
    movingAwayMsg: "Uzaklaşıyorsunuz. Geri dönün.",
    wrongDirectionMsg: "Yanlış yönde gidiyorsunuz!",
    foundTargetMsg: "Hedefi buldunuz!",
    gameOverMsg: "Oyun Bitti! Tüm hamleleriniz doldu.",
    remove: "Kaldır",
    north: "Kuzey",
    south: "Güney",
    east: "Doğu",
    west: "Batı",
  },
};

const cartographyMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f7f6f2" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#57534e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f7f6f2" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d6d3d1" }, { weight: 1 }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#f0efe9" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e7e5e4" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#a8a29e" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e7e5e4" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#d6d3d1" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e5e9ea" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#a8a29e" }] },
];

const cartographyNightMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1c1917" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a8a29e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1c1917" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#44403c" }, { weight: 1 }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#292524" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#292524" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#78716c" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#292524" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#44403c" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#44403c" }] },
];

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDirectionLabel(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  t: (typeof T)["en"],
) {
  const latDiff = lat2 - lat1;
  const lonDiff = lon2 - lon1;
  let dir = "";
  if (latDiff > 0) dir += t.north;
  else if (latDiff < 0) dir += t.south;
  if (lonDiff > 0) dir += dir ? `-${t.east}` : t.east;
  else if (lonDiff < 0) dir += dir ? `-${t.west}` : t.west;
  return dir;
}

function MapContent({ onBack, apiKey, lang }: MapSectionProps) {
  const map = useMap();
  const t = T[lang];
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const streetviewRequestId = useRef(0);

  const [gameState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLat = params.get("targetLat");
    const urlLng = params.get("targetLng");

    let hl = null;
    if (urlLat && urlLng && !isNaN(parseFloat(urlLat)) && !isNaN(parseFloat(urlLng))) {
      hl = { lat: parseFloat(urlLat), lng: parseFloat(urlLng) };
    }

    const savedStr = getStoredItem(STORAGE_KEY);
    let savedState = null;
    if (savedStr) {
      try { savedState = JSON.parse(savedStr); } catch (e) {}
    }

    if (hl) {
      if (savedState && savedState.hiddenLocation.lat === hl.lat && savedState.hiddenLocation.lng === hl.lng) {
        return { ...savedState, isRestored: true };
      }
      return { hiddenLocation: hl, guessesCount: 0, gameOver: false, revealed: false, previousDistance: null, waypoints: [], startTime: Date.now(), isRestored: false };
    } else if (savedState) {
      return { ...savedState, isRestored: true };
    } else {
      return {
        hiddenLocation: { lat: 48.8584 + (Math.random() - 0.5) * 0.04, lng: 2.2945 + (Math.random() - 0.5) * 0.04 },
        guessesCount: 0, gameOver: false, revealed: false, previousDistance: null, waypoints: [], startTime: Date.now(), isRestored: false,
      };
    }
  });

  const [hiddenLocation, setHiddenLocation] = useState(gameState.hiddenLocation);
  const [guessesCount, setGuessesCount] = useState(gameState.guessesCount);
  const [previousDistance, setPreviousDistance] = useState<number | null>(gameState.previousDistance);
  const [gameOver, setGameOver] = useState(gameState.gameOver);
  const [revealed, setRevealed] = useState(gameState.revealed);
  const [waypoints, setWaypoints] = useState<Array<{ lat: number; lng: number; id: string }>>(gameState.waypoints || []);
  const [startTime, setStartTime] = useState(gameState.startTime || Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRestored, setIsRestored] = useState(gameState.isRestored);

  const difficulty = new URLSearchParams(window.location.search).get("difficulty") || "medium";
  const winThreshold = difficulty === "hard" ? 0.05 : difficulty === "easy" ? 0.5 : 0.1;
  const hideStreetView = difficulty === "hard";
  const hideDirection = difficulty === "hard";

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    setIsDarkTheme(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() =>
      setIsDarkTheme(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime, gameOver]);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [streetviewImage, setStreetviewImage] = useState<string | null>(null);
  const [streetviewError, setStreetviewError] = useState<string | null>(null);
  const [landmark, setLandmark] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [heading, setHeading] = useState(0);
  const [isWaypointMode, setIsWaypointMode] = useState(false);

  const [showTutorial, setShowTutorial] = useState(() => getStoredItem("geoseeker_tutorial_seen") !== "true");

  useEffect(() => {
    if (isRestored) {
      setFeedback(t.gameRestoredMsg);
      setTimeout(() => { setFeedback(null); setIsRestored(false); }, 3000);
    }
  }, [isRestored]);

  useEffect(() => {
    setStoredItem(STORAGE_KEY, JSON.stringify({ hiddenLocation, guessesCount, gameOver, revealed, previousDistance, waypoints, startTime }));
  }, [hiddenLocation, guessesCount, gameOver, revealed, previousDistance, waypoints, startTime]);

  // Reverse-geocode hidden location for landmark hint
  useEffect(() => {
    if (!window.google?.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: hiddenLocation }, (results: any, status: any) => {
      if (status === "OK" && results && results.length > 0) {
        const poi = results.find((r: any) =>
          r.types.includes("point_of_interest") ||
          r.types.includes("establishment") ||
          r.types.includes("route")
        );
        const best = poi || results[0];
        setLandmark(best.address_components[0].long_name);
      }
    });
  }, [hiddenLocation]);

  // Fetch street view of the HIDDEN location (GeoGuessr style)
  useEffect(() => {
    const requestId = ++streetviewRequestId.current;
    const timer = setTimeout(() => {
      setStreetviewImage(null);
      setStreetviewError(null);
      fetch(`/api/streetview?lat=${hiddenLocation.lat}&lng=${hiddenLocation.lng}&key=${apiKey}`)
        .then(async (res) => {
          if (requestId !== streetviewRequestId.current) return;
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to fetch streetview");
          if (data.base64) setStreetviewImage(`data:image/jpeg;base64,${data.base64}`);
        })
        .catch((err) => {
          if (requestId !== streetviewRequestId.current) return;
          setStreetviewError(err.message);
        });
    }, 400);
    return () => { clearTimeout(timer); streetviewRequestId.current += 1; };
  }, [hiddenLocation.lat, hiddenLocation.lng, apiKey]);

  const distance = getDistance(center.lat, center.lng, hiddenLocation.lat, hiddenLocation.lng);
  const direction = getDirectionLabel(center.lat, center.lng, hiddenLocation.lat, hiddenLocation.lng, t);

  let clue: string;
  if (distance < winThreshold) {
    clue = t.veryClose;
  } else if (guessesCount === 0) {
    clue = t.initialClue;
  } else if (hideDirection) {
    clue = t.directionalDisabled(distance.toFixed(1));
  } else {
    // Show landmark only after first guess and not on hard
    const shownLandmark = guessesCount >= 1 && !hideDirection ? landmark : null;
    clue = t.headDir(direction, distance.toFixed(1), shownLandmark);
  }

  const handleGuess = () => {
    if (gameOver) return;
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 500);

    const newCount = guessesCount + 1;
    setGuessesCount(newCount);
    let newFeedback = "";

    if (distance < winThreshold) {
      newFeedback = t.foundTargetMsg;
      setGameOver(true);
      setRevealed(true);
    } else if (newCount >= 10) {
      newFeedback = t.gameOverMsg;
      setGameOver(true);
      setRevealed(true);
    } else if (previousDistance === null) {
      newFeedback = t.firstGuessMsg;
    } else {
      const diff = previousDistance - distance;
      if (diff > 0.5) newFeedback = t.significantProgressMsg;
      else if (diff > 0.05) newFeedback = t.gettingWarmerMsg;
      else if (diff > -0.05) newFeedback = t.circlingMsg;
      else if (diff > -0.4) newFeedback = t.movingAwayMsg;
      else newFeedback = t.wrongDirectionMsg;
    }

    setPreviousDistance(distance);
    setFeedback(newFeedback);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReset = () => {
    setHiddenLocation({ lat: 48.8584 + (Math.random() - 0.5) * 0.04, lng: 2.2945 + (Math.random() - 0.5) * 0.04 });
    setGuessesCount(0);
    setPreviousDistance(null);
    setWaypoints([]);
    setStartTime(Date.now());
    setElapsedTime(0);
    setLandmark(null);
    setStreetviewImage(null);
    setStreetviewError(null);
    setFeedback(t.gameResetMsg);
    setTimeout(() => setFeedback(null), 3000);
    setGameOver(false);
    setRevealed(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("targetLat");
    url.searchParams.delete("targetLng");
    window.history.replaceState({}, "", url);
  };

  const dismissTutorial = () => {
    setStoredItem("geoseeker_tutorial_seen", "true");
    setShowTutorial(false);
  };

  const feedbackColor = feedback
    ? feedback === t.linkCopiedMsg
      ? "bg-blue-50 border-blue-200 text-blue-800"
      : feedback === t.foundTargetMsg
      ? "bg-green-50 border-green-200 text-green-800"
      : feedback === t.gameOverMsg || feedback === t.signalTracedMsg
      ? "bg-[#f7f6f2] border-accent text-accent"
      : feedback === t.gettingWarmerMsg
      ? "bg-orange-50 border-orange-200 text-orange-800"
      : "bg-card border-border text-foreground"
    : "";

  return (
    <div className="relative w-full h-[100dvh] bg-background overflow-hidden flex flex-col md:flex-row font-sans">
      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && streetviewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="w-7 h-7" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={streetviewImage}
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              alt="Street view"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-6"
          >
            <div className="bg-card w-full max-w-md p-8 shadow-2xl border border-border">
              <div className="flex items-center justify-center mb-6">
                <Compass className="w-12 h-12 text-foreground/40" strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-serif italic text-foreground text-center mb-4">
                {t.tutorialTitle}
              </h3>
              <p className="text-[13px] text-foreground/80 font-light leading-relaxed mb-8 text-center px-4">
                {t.tutorialBody}
              </p>
              <button
                onClick={dismissTutorial}
                className="w-full border border-foreground bg-foreground text-card py-3 text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-transparent hover:text-foreground transition-all duration-300"
              >
                {t.acknowledgeTutorial}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`${sidebarOpen ? "w-full md:w-[340px] h-[55%] md:h-full top-auto bottom-0 md:bottom-auto relative" : "w-0 hidden md:block"} bg-card border-t md:border-t-0 md:border-r border-border flex flex-col shrink-0 z-20 shadow-2xl md:shadow-none`}
      >
        {sidebarOpen && (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted-bg/50">
              <button
                onClick={onBack}
                className="text-muted hover:text-foreground flex items-center gap-2 text-[11px] uppercase tracking-widest font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> {t.abort}
              </button>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Intel Report */}
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted mb-4 border-b border-border pb-2 flex items-center gap-2">
                  <Eye className="w-3 h-3" /> {t.intelReport}
                </h2>
                <p className="text-[14px] font-serif italic leading-relaxed text-foreground/90">
                  "{clue}"
                </p>
              </div>

              {/* Fix / Coordinates */}
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted mb-4 border-b border-border pb-2 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {t.fix}
                  </span>
                  <div className="flex gap-4">
                    <span className="font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />{" "}
                      {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")}
                    </span>
                    <span className="font-mono">{guessesCount} {t.attempts}</span>
                  </div>
                </h2>
                <div className="bg-muted-bg/50 p-4 border border-border border-dashed font-mono text-sm tracking-tight text-foreground/80 flex flex-col gap-1">
                  <span>LAT: {center.lat.toFixed(5)}</span>
                  <span>LNG: {center.lng.toFixed(5)}</span>
                </div>
              </div>

              {/* Visual Feed */}
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted mb-4 border-b border-border pb-2 flex items-center gap-2">
                  <Camera className="w-3 h-3" /> {t.visualFeed}
                </h2>
                <div
                  className={`aspect-[4/3] bg-muted-bg border border-border p-1 relative ${streetviewImage && !hideStreetView ? "cursor-zoom-in group" : ""}`}
                  onClick={() => streetviewImage && !hideStreetView && setIsImageModalOpen(true)}
                >
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground/50 m-1 z-10" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground/50 m-1 z-10" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-foreground/50 m-1 z-10" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-foreground/50 m-1 z-10" />

                  <div className="w-full h-full relative overflow-hidden bg-background">
                    {hideStreetView ? (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-accent font-medium mb-2">
                          {t.feedDisabled}
                        </span>
                        <p className="text-[10px] text-muted font-mono">{t.feedDisabledDesc}</p>
                      </div>
                    ) : streetviewError ? (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-accent font-medium mb-2">
                          {t.feedLost}
                        </span>
                        <p className="text-[10px] text-muted font-mono">{streetviewError}</p>
                      </div>
                    ) : streetviewImage ? (
                      <>
                        <img
                          src={streetviewImage}
                          className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                          alt="Street view of target"
                        />
                        {/* Enlarge hint */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-black/60 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5">
                            <Maximize2 className="w-3 h-3" />
                            {t.clickToEnlarge}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex object-center justify-center h-full items-center">
                        <Target className="w-6 h-6 text-muted animate-spin-slow opacity-50" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="p-6 border-t border-border mt-auto bg-muted-bg/30 relative">
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute -top-14 left-6 right-6 p-3 text-center text-[11px] uppercase tracking-wider font-bold border shadow-lg ${feedbackColor}`}
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleGuess}
                disabled={gameOver}
                className="w-full border-2 border-accent bg-accent text-white py-3 text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-accent-hover hover:border-accent-hover transition-all flex items-center justify-center gap-2 shadow-lg disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed group mb-3"
              >
                <Target className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
                {t.plotCoordinates}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsWaypointMode(!isWaypointMode)}
                  className={`w-full bg-transparent border border-border font-mono text-[10px] uppercase py-2.5 transition-colors flex items-center justify-center gap-1.5 ${isWaypointMode ? "bg-muted-bg text-accent" : "text-foreground hover:bg-muted-bg"}`}
                >
                  <Flag className="w-3 h-3" />
                  {isWaypointMode ? t.cancelWaypoint : t.placeWaypoint}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-transparent border border-border text-foreground font-mono text-[10px] uppercase py-2.5 hover:bg-muted-bg transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" /> {t.reset}
                </button>
                <button
                  onClick={() => {
                    setRevealed(true);
                    setGameOver(true);
                    setFeedback(t.signalTracedMsg);
                  }}
                  disabled={revealed}
                  className="w-full bg-transparent border border-border text-foreground font-mono text-[10px] uppercase py-2.5 hover:bg-muted-bg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MapIcon className="w-3 h-3" /> {t.trace}
                </button>
                <button
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("targetLat", hiddenLocation.lat.toFixed(5));
                    url.searchParams.set("targetLng", hiddenLocation.lng.toFixed(5));
                    const shareUrl = url.toString();
                    if (navigator.clipboard?.writeText) {
                      navigator.clipboard.writeText(shareUrl)
                        .then(() => { setFeedback(t.linkCopiedMsg); setTimeout(() => setFeedback(null), 3000); })
                        .catch(() => { window.prompt("Copy this link:", shareUrl); });
                    } else {
                      window.prompt("Copy this link:", shareUrl);
                    }
                  }}
                  className="w-full bg-transparent border border-border text-foreground font-mono text-[10px] uppercase py-2.5 hover:bg-muted-bg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3 h-3" /> {t.dispatchLink}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Map area */}
      <div className="flex-1 relative h-full bg-background cartography-grid">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute bottom-6 left-6 md:top-6 md:bottom-auto z-10 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-xl text-foreground hover:bg-muted-bg transition-colors"
          >
            <Navigation className="w-5 h-5" strokeWidth={1} />
          </button>
        )}

        {/* Compass + zoom */}
        <div className="absolute top-6 right-6 z-10 flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 bg-card border border-border rounded-full flex flex-col items-center justify-center shadow-xl text-foreground relative cursor-pointer hover:bg-muted-bg transition-colors"
            onClick={() => map && map.setHeading(0)}
            title="Reset North"
          >
            <motion.div
              animate={{ rotate: -heading }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full h-full relative"
            >
              <div className="absolute text-accent text-[11px] font-bold top-1 left-1/2 -translate-x-1/2">N</div>
              <div className="w-[1.5px] h-[50%] bg-accent absolute bottom-1/2 left-1/2 -translate-x-1/2" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
              <div className="w-[1.5px] h-[50%] bg-muted absolute top-1/2 left-1/2 -translate-x-1/2" style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }} />
            </motion.div>
          </div>

          <div className="flex flex-col bg-card border border-border shadow-xl overflow-hidden rounded-md mt-2">
            <button onClick={() => map && map.setZoom((map.getZoom() || 14) + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-muted-bg text-foreground border-b border-border transition-colors">
              <Plus className="w-4 h-4" strokeWidth={1} />
            </button>
            <button onClick={() => map && map.setZoom((map.getZoom() || 14) - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-muted-bg text-foreground transition-colors">
              <Minus className="w-4 h-4" strokeWidth={1} />
            </button>
          </div>
        </div>

        <GoogleMap
          defaultZoom={14}
          defaultCenter={center}
          mapId={MAP_ID}
          disableDefaultUI={true}
          styles={isDarkTheme ? cartographyNightMapStyles : cartographyMapStyles}
          options={{ draggableCursor: isWaypointMode ? "crosshair" : undefined }}
          onClick={(e) => {
            if (isWaypointMode && e.detail.latLng) {
              setWaypoints([...waypoints, { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng, id: Date.now().toString() }]);
              setIsWaypointMode(false);
            }
          }}
          onCameraChanged={(e) => {
            setCenter(e.detail.center);
            setHeading(e.detail.heading || 0);
          }}
        >
          {/* Current position marker */}
          <AdvancedMarker position={center} zIndex={50}>
            <motion.div animate={{ scale: isPulsing ? 1.4 : 1 }} transition={{ duration: 0.2 }}>
              <Pin background="#111111" borderColor="#111111" glyphColor="#ffffff" scale={0.8} />
            </motion.div>
          </AdvancedMarker>

          {/* Revealed hidden location */}
          {revealed && (
            <AdvancedMarker position={hiddenLocation} zIndex={60}>
              <Pin background="#b91c1c" borderColor="#7f1d1d" glyphColor="#ffffff" scale={1.2} />
            </AdvancedMarker>
          )}

          {/* Waypoints */}
          {waypoints.map((wp) => (
            <AdvancedMarker
              key={wp.id}
              position={{ lat: wp.lat, lng: wp.lng }}
              zIndex={45}
              onClick={() => setWaypoints(waypoints.filter((w) => w.id !== wp.id))}
            >
              <div className="cursor-pointer group relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card text-foreground text-[10px] whitespace-nowrap px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 border border-border pointer-events-none transition-opacity text-center leading-tight z-50">
                  {t.remove}
                  <br />
                  {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                </div>
                <Pin background="#fcd34d" borderColor="#b45309" glyphColor="#b45309" scale={0.7}>
                  <div className="w-1.5 h-1.5 bg-amber-900 rounded-full" style={{ margin: "auto" }} />
                </Pin>
              </div>
            </AdvancedMarker>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default function MapSection(props: MapSectionProps) {
  if (!props.apiKey) {
    const t = T[props.lang];
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border border-border shadow-2xl p-8 text-center space-y-5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted">Missing API Key</p>
          <h1 className="text-3xl font-serif italic text-foreground">Map session unavailable</h1>
          <p className="text-sm text-muted leading-relaxed">
            A Google Maps API key is required. Return to the landing screen and add a valid key.
          </p>
          <button
            onClick={props.onBack}
            className="w-full border-2 border-accent bg-accent text-white py-3 text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-accent-hover transition-colors"
          >
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
