import React, { useState, useEffect } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, Target, ChevronLeft, Navigation, X, Camera, Eye, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MapSectionProps {
  onBack: () => void;
  apiKey: string;
}

const MAP_ID = 'DEMO_MAP_ID'; 

const lightMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#fcfcfc" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#666666" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#fcfcfc" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#999999" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f0f0f0" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#cccccc" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e8ecef" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#999999" }] },
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
    if (latDiff > 0) direction += 'north';
    else if (latDiff < 0) direction += 'south';
    
    if (lonDiff > 0) direction += direction ? '-east' : 'east';
    else if (lonDiff < 0) direction += direction ? '-west' : 'west';

    return direction;
}

function MapContent({ onBack, apiKey }: MapSectionProps) {
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // libs
  const geocodingLib = useMapsLibrary('geocoding');
  const streetViewLib = useMapsLibrary('streetView');

  // Game state
  const [hiddenLocation] = useState({ 
    lat: 48.8584 + (Math.random() - 0.5) * 0.04, 
    lng: 2.2945 + (Math.random() - 0.5) * 0.04 
  });
  const [guessesCount, setGuessesCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [streetviewImage, setStreetviewImage] = useState<string | null>(null);
  const [svLocation, setSvLocation] = useState<{lat: number, lng: number} | null>(null);
  const [landmark, setLandmark] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [revealed, setRevealed] = useState(false);

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
      fetch(`/api/streetview?lat=${center.lat}&lng=${center.lng}&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.base64) {
                setStreetviewImage(`data:image/jpeg;base64,${data.base64}`);
            }
        })
        .catch(console.error);
    }, 1000);
    return () => clearTimeout(timer);
  }, [center.lat, center.lng, apiKey]);

  const distance = getDistance(center.lat, center.lng, hiddenLocation.lat, hiddenLocation.lng);
  const direction = getDirection(center.lat, center.lng, hiddenLocation.lat, hiddenLocation.lng);
  
  let clue = `Head ${direction}`;
  if (landmark) {
      clue += ` towards ${landmark}`;
  }
  clue += `. It's about ${distance.toFixed(1)} km away.`;

  if (distance < 0.1) {
      clue = "You're extremely close! Target is right here.";
  }

  const handleGuess = () => {
      if (gameOver) return;

      const newCount = guessesCount + 1;
      setGuessesCount(newCount);
      
      if (distance < 0.1) {
          setFeedback("You found Gemini!");
          setGameOver(true);
          setRevealed(true);
      } else if (newCount >= 10) {
          setFeedback("Game Over! You ran out of guesses.");
          setGameOver(true);
          setRevealed(true);
      } else if (distance < 0.5) {
          setFeedback("You are getting warmer.");
          setTimeout(() => setFeedback(null), 3000);
      } else {
          setFeedback("You are too far away. Try again.");
          setTimeout(() => setFeedback(null), 3000);
      }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-background overflow-hidden flex flex-col md:flex-row">
      
      <motion.div 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`${sidebarOpen ? 'w-full md:w-[320px] h-1/2 md:h-full top-auto bottom-0 md:bottom-auto relative' : 'w-0 hidden md:block'} bg-card border-t md:border-t-0 md:border-r border-border flex flex-col shrink-0 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] md:shadow-none`}
      >
        {sidebarOpen && (
          <>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <button onClick={onBack} className="text-muted hover:text-foreground flex items-center gap-2 text-[13px] font-medium transition-colors">
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> back
              </button>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              <div>
                <h2 className="text-[11px] uppercase tracking-widest text-muted mb-3 font-medium">analysis</h2>
                <div className="p-3 bg-muted-bg border border-border flex items-center gap-2 text-[13px] text-foreground font-medium mb-3">
                  <Eye className="w-4 h-4 text-foreground" strokeWidth={1.5}/> 
                  Gemini has hidden!
                </div>
                <p className="text-[13px] leading-relaxed text-foreground font-light italic">
                  "{clue}"
                </p>
              </div>

              <div>
                <h2 className="text-[11px] uppercase tracking-widest text-muted mb-3 font-medium flex justify-between items-center">
                  <span>coordinates</span>
                  <span className="text-foreground">guesses: {guessesCount} / 10</span>
                </h2>
                <div className="bg-muted-bg p-4 flex gap-3 items-start border border-border">
                  <MapPin className="w-4 h-4 text-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <div className="text-[13px] text-foreground font-medium mb-0.5">current view</div>
                    <div className="text-[11px] text-muted font-mono">{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[11px] uppercase tracking-widest text-muted mb-3 font-medium">streetview scanner</h2>
                <div className="aspect-[4/3] bg-muted-bg border border-border relative overflow-hidden flex items-center justify-center">
                  {streetviewImage ? (
                    <img src={streetviewImage} className="w-full h-full object-cover" alt="Streetview panorama limit" />
                  ) : (
                    <Camera className="w-6 h-6 text-muted animate-pulse" strokeWidth={1.5}/>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-border mt-auto flex flex-col gap-3 relative">
               <AnimatePresence>
                 {feedback && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className={`absolute -top-14 left-5 right-5 p-2 text-center text-[12px] font-medium border shadow-sm ${
                        feedback.toLowerCase().includes('found') ? 'bg-green-50 border-green-200 text-green-800' : 
                        (feedback.toLowerCase().includes('game over') || feedback.toLowerCase().includes('too far')) ? 'bg-red-50 border-red-200 text-red-800' :
                        feedback.toLowerCase().includes('warmer') ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-muted-bg border-border text-foreground'
                     }`}
                   >
                     {feedback}
                   </motion.div>
                 )}
               </AnimatePresence>
               <button 
                onClick={handleGuess}
                disabled={gameOver}
                className="w-full bg-foreground text-card text-[13px] font-medium py-2.5 hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Target className="w-4 h-4" strokeWidth={1.5} /> make a guess
               </button>
               <button 
                 onClick={() => { setRevealed(true); setGameOver(true); setFeedback("Location revealed."); }}
                 disabled={revealed}
                 className="w-full bg-muted-bg text-foreground border border-border text-[13px] font-medium py-2.5 hover:bg-black/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Map className="w-4 h-4" strokeWidth={1.5} /> reveal location
               </button>
            </div>
          </>
        )}
      </motion.div>

      <div className="flex-1 relative h-full bg-muted-bg">
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute bottom-6 left-6 md:top-6 md:bottom-auto z-10 w-10 h-10 bg-card border border-border flex items-center justify-center shadow-sm text-foreground hover:bg-muted-bg transition-colors"
          >
            <Navigation className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}

        <GoogleMap
          defaultZoom={14}
          defaultCenter={center}
          mapId={MAP_ID}
          disableDefaultUI={true}
          styles={lightMapStyles}
          onCenterChanged={(e) => setCenter(e.detail.center)}
        >
          <AdvancedMarker position={center} zIndex={50}>
            <Pin background="#111111" borderColor="#111111" glyphColor="#ffffff" scale={0.8} />
          </AdvancedMarker>

          {svLocation && (
            <AdvancedMarker position={svLocation} zIndex={40}>
              <Pin background="#888888" borderColor="#888888" glyphColor="transparent" scale={0.4} />
            </AdvancedMarker>
          )}

          {revealed && (
            <AdvancedMarker position={hiddenLocation} zIndex={60}>
              <Pin background="#ef4444" borderColor="#b91c1c" glyphColor="#ffffff" scale={1.2} />
            </AdvancedMarker>
          )}
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

