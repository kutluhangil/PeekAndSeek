import React, { useState, useEffect } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Target, ChevronLeft, Navigation, X, Camera, Eye, Map as MapIcon, Share2, RotateCcw, Info, Compass, Plus, Minus, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'geoseeker_game_state';

interface MapSectionProps {
  onBack: () => void;
  apiKey: string;
}

const MAP_ID = 'DEMO_MAP_ID'; 

// Cartographer/Parchment style map
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

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
}

function getDirection(lat1: number, lon1: number, lat2: number, lon2: number) {
    const latDiff = lat2 - lat1;
    const lonDiff = lon2 - lon1;
    
    let direction = '';
    if (latDiff > 0) direction += 'North';
    else if (latDiff < 0) direction += 'South';
    
    if (lonDiff > 0) direction += direction ? '-East' : 'East';
    else if (lonDiff < 0) direction += direction ? '-West' : 'West';

    return direction;
}

function MapContent({ onBack, apiKey }: MapSectionProps) {
  const map = useMap();
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // libs
  const geocodingLib = useMapsLibrary('geocoding');
  const streetViewLib = useMapsLibrary('streetView');

  // Game state
  const [gameState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLat = params.get('targetLat');
    const urlLng = params.get('targetLng');
    
    let hl = null;
    if (urlLat && urlLng && !isNaN(parseFloat(urlLat)) && !isNaN(parseFloat(urlLng))) {
      hl = { lat: parseFloat(urlLat), lng: parseFloat(urlLng) };
    }

    const savedStr = localStorage.getItem(STORAGE_KEY);
    let savedState = null;
    if (savedStr) {
      try { savedState = JSON.parse(savedStr); } catch (e) {}
    }

    if (hl) {
      if (savedState && savedState.hiddenLocation.lat === hl.lat && savedState.hiddenLocation.lng === hl.lng) {
        return { ...savedState, isRestored: true };
      }
      return { hiddenLocation: hl, guessesCount: 0, gameOver: false, revealed: false, previousDistance: null, waypoints: [], isRestored: false };
    } else if (savedState) {
      return { ...savedState, isRestored: true };
    } else {
      return {
        hiddenLocation: { lat: 48.8584 + (Math.random() - 0.5) * 0.04, lng: 2.2945 + (Math.random() - 0.5) * 0.04 },
        guessesCount: 0, gameOver: false, revealed: false, previousDistance: null, waypoints: [], isRestored: false
      };
    }
  });

  const [hiddenLocation, setHiddenLocation] = useState(gameState.hiddenLocation);
  const [guessesCount, setGuessesCount] = useState(gameState.guessesCount);
  const [previousDistance, setPreviousDistance] = useState<number | null>(gameState.previousDistance);
  const [gameOver, setGameOver] = useState(gameState.gameOver);
  const [revealed, setRevealed] = useState(gameState.revealed);
  const [waypoints, setWaypoints] = useState<Array<{lat: number, lng: number, id: string}>>(gameState.waypoints || []);
  const [isRestored, setIsRestored] = useState(gameState.isRestored);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [streetviewImage, setStreetviewImage] = useState<string | null>(null);
  const [streetviewError, setStreetviewError] = useState<string | null>(null);
  const [svLocation, setSvLocation] = useState<{lat: number, lng: number} | null>(null);
  const [landmark, setLandmark] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [heading, setHeading] = useState(0);
  const [isWaypointMode, setIsWaypointMode] = useState(false);

  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem('geoseeker_tutorial_seen') !== 'true';
  });

  useEffect(() => {
    if (isRestored) {
        setFeedback("Game session restored.");
        setTimeout(() => setFeedback(null), 3000);
        setTimeout(() => setIsRestored(false), 3000);
    }
  }, [isRestored]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        hiddenLocation, guessesCount, gameOver, revealed, previousDistance, waypoints
    }));
  }, [hiddenLocation, guessesCount, gameOver, revealed, previousDistance, waypoints]);

  const dismissTutorial = () => {
    localStorage.setItem('geoseeker_tutorial_seen', 'true');
    setShowTutorial(false);
  };

  const handleReset = () => {
    setHiddenLocation({
      lat: 48.8584 + (Math.random() - 0.5) * 0.04, 
      lng: 2.2945 + (Math.random() - 0.5) * 0.04 
    });
    setGuessesCount(0);
    setPreviousDistance(null);
    setWaypoints([]);
    setFeedback("Game reset. New coordinates established.");
    setTimeout(() => setFeedback(null), 3000);
    setGameOver(false);
    setRevealed(false);
    
    const url = new URL(window.location.href);
    url.searchParams.delete('targetLat');
    url.searchParams.delete('targetLng');
    window.history.replaceState({}, '', url);
  };

  // Landmark fetching
  useEffect(() => {
    if (!geocodingLib) return;
    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode({ location: hiddenLocation }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
         const poi = results.find(r => r.types.includes('point_of_interest') || r.types.includes('establishment') || r.types.includes('route'));
         if (poi) {
           setLandmark(poi.address_components[0].long_name);
         } else {
           setLandmark(results[0].address_components[0].long_name);
         }
      }
    });
  }, [geocodingLib, hiddenLocation]);

  // SV location marker fetching
  useEffect(() => {
    if (!streetViewLib) return;
    const svService = new streetViewLib.StreetViewService();
    svService.getPanorama({ location: center, radius: 100 }, (data, status) => {
       if (status === 'OK' && data?.location?.latLng) {
           setSvLocation({ lat: data.location.latLng.lat(), lng: data.location.latLng.lng() });
       } else {
           setSvLocation(null);
       }
    });
  }, [streetViewLib, center]);

  // Debounce streetview fetches
  useEffect(() => {
    const timer = setTimeout(() => {
      setStreetviewImage(null);
      setStreetviewError(null);
      fetch(`/api/streetview?lat=${center.lat}&lng=${center.lng}&key=${apiKey}`)
        .then(async res => {
           const data = await res.json();
           if (!res.ok) {
              throw new Error(data.error || 'Failed to fetch streetview');
           }
           if (data.base64) {
               setStreetviewImage(`data:image/jpeg;base64,${data.base64}`);
           }
        })
        .catch(err => {
           console.error(err);
           setStreetviewError(err.message);
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [center.lat, center.lng, apiKey]);

  const distance = getDistance(center.lat, center.lng, hiddenLocation.lat, hiddenLocation.lng);
  const direction = getDirection(center.lat, center.lng, hiddenLocation.lat, hiddenLocation.lng);
  
  let clue = `Head ${direction}`;
  if (landmark) {
      clue += ` towards ${landmark}`;
  }
  clue += `. Approximately ${distance.toFixed(1)} km away.`;

  if (distance < 0.1) {
      clue = "You're extremely close! Target is right here.";
  }

  const handleGuess = () => {
      if (gameOver) return;

      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);

      const newCount = guessesCount + 1;
      setGuessesCount(newCount);
      
      let newFeedback = "";

      if (distance < 0.1) {
          newFeedback = "You found Gemini!";
          setGameOver(true);
          setRevealed(true);
      } else if (newCount >= 10) {
          newFeedback = "Game Over! You ran out of guesses.";
          setGameOver(true);
          setRevealed(true);
      } else if (previousDistance === null) {
          newFeedback = "First guess plotted. Scan again.";
      } else {
          const diff = previousDistance - distance;
          if (diff > 0.5) {
              newFeedback = "Excellent! You made significant progress.";
          } else if (diff > 0.05) {
              newFeedback = "You are getting warmer.";
          } else if (diff > -0.05) {
              newFeedback = "You are circling the target.";
          } else if (diff > -0.4) {
              newFeedback = "You are moving away. Turn back.";
          } else {
              newFeedback = "You are heading in the wrong direction!";
          }
      }

      setPreviousDistance(distance);
      setFeedback(newFeedback);
      setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="relative w-full h-[100dvh] bg-background overflow-hidden flex flex-col md:flex-row font-sans">
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
              <h3 className="text-2xl font-serif italic text-foreground text-center mb-4">Cartographer's Manual</h3>
              <p className="text-[13px] text-foreground/80 font-light leading-relaxed mb-8 text-center px-4">
                Pan the map to search for the hidden coordinate. Use the directional clues and street view ocular to narrow the radius. You have exactly <strong className="text-foreground">10</strong> guesses to pinpoint the location.
              </p>
              <button 
                onClick={dismissTutorial}
                className="w-full border border-foreground bg-foreground text-card py-3 text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-transparent hover:text-foreground transition-all duration-300"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`${sidebarOpen ? 'w-full md:w-[340px] h-[55%] md:h-full top-auto bottom-0 md:bottom-auto relative' : 'w-0 hidden md:block'} bg-card border-t md:border-t-0 md:border-r border-border flex flex-col shrink-0 z-20 shadow-2xl md:shadow-none`}
      >
        {sidebarOpen && (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted-bg/50">
              <button onClick={onBack} className="text-muted hover:text-foreground flex items-center gap-2 text-[11px] uppercase tracking-widest font-medium transition-colors">
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Abort
              </button>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
              
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted mb-4 border-b border-border pb-2 flex items-center gap-2">
                  <Eye className="w-3 h-3" /> Intel Report
                </h2>
                <p className="text-[15px] font-serif italic leading-relaxed text-foreground/90">
                  "{clue}"
                </p>
              </div>

              <div>
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted mb-4 border-b border-border pb-2 flex justify-between items-center">
                  <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Fix</span>
                  <span className="font-mono">{guessesCount} / 10 Attempts</span>
                </h2>
                <div className="bg-muted-bg/50 p-4 border border-border border-dashed font-mono text-sm tracking-tight text-foreground/80 flex flex-col gap-1">
                  <span>LAT: {center.lat.toFixed(5)}</span>
                  <span>LNG: {center.lng.toFixed(5)}</span>
                </div>
              </div>

              <div>
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted mb-4 border-b border-border pb-2 flex items-center gap-2">
                  <Camera className="w-3 h-3" /> Visual Feed
                </h2>
                <div className="aspect-[4/3] bg-muted-bg border border-border p-1 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground/50 m-1 z-10" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground/50 m-1 z-10" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-foreground/50 m-1 z-10" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-foreground/50 m-1 z-10" />
                  
                  <div className="w-full h-full relative overflow-hidden bg-background">
                    {streetviewError ? (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-accent font-medium mb-2">Feed Lost</span>
                        <p className="text-[10px] text-muted font-mono">{streetviewError}</p>
                      </div>
                    ) : streetviewImage ? (
                      <img src={streetviewImage} className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply" alt="Streetview panorama limit" />
                    ) : (
                      <div className="flex object-center justify-center h-full items-center">
                         <Target className="w-6 h-6 text-muted animate-spin-slow opacity-50" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border mt-auto bg-muted-bg/30 relative">
               <AnimatePresence>
                 {feedback && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className={`absolute -top-14 left-6 right-6 p-3 text-center text-[11px] uppercase tracking-wider font-bold border shadow-lg ${
                        feedback.toLowerCase().includes('copy') ? 'bg-blue-50 border-blue-200 text-blue-800' :
                        feedback.toLowerCase().includes('found') ? 'bg-green-50 border-green-200 text-green-800' : 
                        (feedback.toLowerCase().includes('game over') || feedback.toLowerCase().includes('too far')) ? 'bg-[#f7f6f2] border-accent text-accent' :
                        feedback.toLowerCase().includes('warmer') ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-card border-border text-foreground'
                     }`}
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
                 <Target className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} /> Plot Coordinates
               </button>

               <div className="grid grid-cols-2 gap-2">
                 <button 
                   onClick={() => setIsWaypointMode(!isWaypointMode)}
                   className={`w-full bg-transparent border border-border font-mono text-[10px] uppercase py-2.5 transition-colors flex items-center justify-center gap-1.5 ${isWaypointMode ? 'bg-muted-bg text-accent' : 'text-foreground hover:bg-muted-bg'}`}
                 >
                   <Flag className="w-3 h-3" /> {isWaypointMode ? 'Cancel Waypoint' : 'Place Waypoint'}
                 </button>
                 <button 
                   onClick={handleReset}
                   className="w-full bg-transparent border border-border text-foreground font-mono text-[10px] uppercase py-2.5 hover:bg-muted-bg transition-colors flex items-center justify-center gap-1.5"
                 >
                   <RotateCcw className="w-3 h-3" /> Reset
                 </button>
                 <button 
                   onClick={() => { setRevealed(true); setGameOver(true); setFeedback("Signal Traced."); }}
                   disabled={revealed}
                   className="w-full bg-transparent border border-border text-foreground font-mono text-[10px] uppercase py-2.5 hover:bg-muted-bg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <MapIcon className="w-3 h-3" /> Trace
                 </button>
                 <button 
                   onClick={() => {
                     const url = new URL(window.location.href);
                     url.searchParams.set('targetLat', hiddenLocation.lat.toFixed(5));
                     url.searchParams.set('targetLng', hiddenLocation.lng.toFixed(5));
                     navigator.clipboard.writeText(url.toString());
                     setFeedback("Intel Link Copied");
                     setTimeout(() => setFeedback(null), 3000);
                   }}
                   className="w-full bg-transparent border border-border text-foreground font-mono text-[10px] uppercase py-2.5 hover:bg-muted-bg transition-colors flex items-center justify-center gap-1.5"
                 >
                   <Share2 className="w-3 h-3" /> Dispatch link
                 </button>
               </div>
            </div>
          </>
        )}
      </motion.div>

      <div className="flex-1 relative h-full bg-background cartography-grid">
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute bottom-6 left-6 md:top-6 md:bottom-auto z-10 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-xl text-foreground hover:bg-muted-bg transition-colors"
          >
            <Navigation className="w-5 h-5" strokeWidth={1} />
          </button>
        )}

        <div className="absolute top-6 right-6 z-10 flex flex-col items-center gap-2">
            <div 
               className="w-12 h-12 bg-card border border-border rounded-full flex flex-col items-center justify-center shadow-xl text-foreground font-serif tracking-widest text-xs relative cursor-pointer hover:bg-muted-bg transition-colors"
               onClick={() => map && map.setHeading(0)}
               title="Reset North"
            >
               <motion.div animate={{ rotate: -heading }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full h-full relative" >
                  <div className="absolute text-accent text-[11px] font-bold top-1 left-1/2 -translate-x-1/2">N</div>
                  <div className="w-[1.5px] h-[50%] bg-accent absolute bottom-1/2 left-1/2 -translate-x-1/2" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
                  <div className="w-[1.5px] h-[50%] bg-muted absolute top-1/2 left-1/2 -translate-x-1/2" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}></div>
               </motion.div>
            </div>
            
            <div className="flex flex-col bg-card border border-border shadow-xl overflow-hidden rounded-md mt-2">
                <button onClick={() => map && map.setZoom((map.getZoom() || 14) + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-muted-bg text-foreground border-b border-border transition-colors"><Plus className="w-4 h-4" strokeWidth={1} /></button>
                <button onClick={() => map && map.setZoom((map.getZoom() || 14) - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-muted-bg text-foreground transition-colors"><Minus className="w-4 h-4" strokeWidth={1} /></button>
            </div>
        </div>

        <GoogleMap
          defaultZoom={14}
          defaultCenter={center}
          mapId={MAP_ID}
          disableDefaultUI={true}
          styles={cartographyMapStyles}
          options={{ draggableCursor: isWaypointMode ? 'crosshair' : undefined }}
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
          <AdvancedMarker position={center} zIndex={50}>
            <motion.div animate={{ scale: isPulsing ? 1.4 : 1 }} transition={{ duration: 0.2 }} className="transition-transform duration-300 hover:scale-110 hover:drop-shadow-xl cursor-default">
              <Pin background="#111111" borderColor="#111111" glyphColor="#ffffff" scale={0.8} />
            </motion.div>
          </AdvancedMarker>

          {svLocation && (
            <AdvancedMarker position={svLocation} zIndex={40}>
              <div className="transition-transform duration-300 hover:scale-125 hover:drop-shadow-lg cursor-pointer">
                <Pin background="#d6d3d1" borderColor="#a8a29e" glyphColor="transparent" scale={0.4} />
              </div>
            </AdvancedMarker>
          )}

          {revealed && (
            <AdvancedMarker position={hiddenLocation} zIndex={60}>
              <div className="transition-transform duration-300 hover:scale-110 hover:drop-shadow-2xl cursor-pointer">
                <Pin background="#b91c1c" borderColor="#7f1d1d" glyphColor="#ffffff" scale={1.2} />
              </div>
            </AdvancedMarker>
          )}

          {waypoints.map((wp) => (
             <AdvancedMarker key={wp.id} position={{ lat: wp.lat, lng: wp.lng }} zIndex={45} onClick={() => {
                 setWaypoints(waypoints.filter(w => w.id !== wp.id));
             }}>
                <div className="transition-transform duration-300 hover:scale-110 hover:drop-shadow-lg cursor-pointer group relative">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card text-foreground text-[10px] whitespace-nowrap px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 border border-border pointer-events-none transition-opacity text-center leading-tight z-50">
                      Remove<br/>{wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                  </div>
                  <Pin background="#fcd34d" borderColor="#b45309" glyphColor="#b45309" scale={0.7}>
                     <div className="w-1.5 h-1.5 bg-amber-900 rounded-full" style={{ margin: 'auto' }} />
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
  return (
    <APIProvider apiKey={props.apiKey}>
       <MapContent {...props} />
    </APIProvider>
  )
}
