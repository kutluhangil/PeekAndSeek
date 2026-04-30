import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Key, Compass, MapPin } from 'lucide-react';

interface LandingPageProps {
  onStartGame: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

const TopoContour = () => (
  <svg className="absolute w-[180%] h-[180%] md:w-full md:h-full opacity-5 pointer-events-none text-foreground top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 800 600" fill="none" stroke="currentColor">
    <path d="M-100,300 C150,150 400,450 900,200" strokeWidth="0.5" />
    <path d="M-100,330 C160,180 410,480 900,230" strokeWidth="0.5" />
    <path d="M-100,360 C170,210 420,510 900,260" strokeWidth="0.5" />
    <path d="M-100,390 C180,240 430,540 900,290" strokeWidth="0.5" />
    
    <path d="M50,100 Q 200,50 350,150 T 600,100" strokeWidth="1" strokeDasharray="4 4" />
    <path d="M150,400 Q 300,500 450,400 T 750,550" strokeWidth="1" strokeDasharray="4 4" />
    
    {/* Concentric rings like elevation */}
    <ellipse cx="600" cy="400" rx="30" ry="20" strokeWidth="0.5" />
    <ellipse cx="600" cy="400" rx="60" ry="40" strokeWidth="0.5" />
    <ellipse cx="600" cy="400" rx="90" ry="60" strokeWidth="0.5" />
    <ellipse cx="600" cy="400" rx="120" ry="80" strokeWidth="0.5" />
    <circle cx="600" cy="400" r="2" fill="currentColor" />
  </svg>
);

const CornerBracket = ({ className }: { className?: string }) => (
  <svg className={`absolute w-6 h-6 text-foreground/40 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M 24 0 L 0 0 L 0 24" />
  </svg>
);

export default function LandingPage({ onStartGame, apiKey, onSaveKey }: LandingPageProps) {
  const [keyInput, setKeyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) {
      onSaveKey(keyInput.trim());
    }
  };

  return (
    <main className="relative flex-1 flex items-center justify-center min-h-[100dvh] bg-background overflow-hidden cartography-grid">
      
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
        alt="World Map Silhouette" 
        className="absolute w-[300%] md:w-[150%] max-w-none lg:w-[120%] lg:max-w-none h-auto opacity-[0.06] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
      />
      
      <TopoContour />

      {/* Compass Rose Decoration */}
      <div className="absolute top-12 left-12 lg:top-24 lg:left-24 opacity-10 pointer-events-none animate-pulse">
        <Compass className="w-48 h-48 lg:w-96 lg:h-96" strokeWidth={0.2} />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-card/90 backdrop-blur-xl p-10 lg:p-14 border border-border shadow-2xl"
        >
          {/* Cartographer Brackets */}
          <CornerBracket className="-top-1 -left-1" />
          <CornerBracket className="-top-1 -right-1 rotate-90" />
          <CornerBracket className="-bottom-1 -left-1 -rotate-90" />
          <CornerBracket className="-bottom-1 -right-1 rotate-180" />

          {/* Mini header info */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted mb-12 border-b border-border/50 pb-4">
            <span className="flex items-center gap-2"><MapPin className="w-3 h-3"/> System Boot</span>
            <span>v 2.0 / Cartographer</span>
          </div>

          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl lg:text-7xl font-serif italic text-foreground tracking-tight">
              Peek & Seek
            </h1>
            <p className="text-[14px] text-muted leading-relaxed font-light mx-auto max-w-sm">
              An intricate game of global hide and seek. Enter coordinates, decipher clues, and track the rogue AI across the globe.
            </p>
          </div>

          <div className="pt-8 border-t border-border/50">
            {!apiKey ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-accent absolute left-0" strokeWidth={1.5} />
                  <input 
                    type="text" 
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Enter your Google Maps API key" 
                    className="minimal-input w-full pl-8 py-3 text-[15px] font-medium text-foreground placeholder:font-normal placeholder:text-muted"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="group relative w-full border-2 border-foreground bg-card text-foreground py-3.5 text-[13px] uppercase tracking-[0.15em] font-bold hover:bg-foreground hover:text-card transition-all duration-300"
                >
                  <span className="relative z-10">Initialize Tracker</span>
                </button>
                <div className="text-[11px] text-muted font-light mt-2 space-y-2 text-center">
                  <p>A personal key is required for map and street view streaming.</p>
                  <p className="text-accent/80 text-[10px] uppercase tracking-wider font-semibold">
                    Enable: Maps JS API, Street View Static API, Geocoding API
                  </p>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-8 text-center space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse border border-green-800"></div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-foreground font-bold">Uplink Established</span>
                </div>
                <button
                  onClick={onStartGame}
                  className="w-full border-2 border-accent bg-accent text-white py-4 text-[14px] uppercase tracking-[0.2em] font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                >
                  Commence Search
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </main>
  );
}
