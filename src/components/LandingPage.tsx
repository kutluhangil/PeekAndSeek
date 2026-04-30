import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Key } from 'lucide-react';

interface LandingPageProps {
  onStartGame: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export default function LandingPage({ onStartGame, apiKey, onSaveKey }: LandingPageProps) {
  const [keyInput, setKeyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) {
      onSaveKey(keyInput.trim());
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-2xl mx-auto space-y-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl text-foreground font-light">
            discover the world.
          </h1>
          <p className="text-[14px] text-muted max-w-md leading-relaxed font-light">
            a premium, minimalist spatial experience. play hide and seek against ai, navigate cities, explore boundaries. less noise, more focus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {!apiKey ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6 max-w-sm">
               <div className="w-full relative flex items-center">
                 <Key className="w-4 h-4 text-muted absolute left-0" strokeWidth={1.5} />
                 <input 
                   type="text" 
                   value={keyInput}
                   onChange={(e) => setKeyInput(e.target.value)}
                   placeholder="enter your google maps api key" 
                   className="minimal-input w-full pl-8 py-2 text-[13px] text-foreground font-light"
                   required
                 />
               </div>
               <button
                 type="submit"
                 className="text-[13px] font-medium bg-foreground text-card px-5 py-2.5 hover:bg-accent-hover transition-colors"
               >
                 save & continue
               </button>
               <div className="text-[11px] text-muted font-light mt-2 max-w-sm space-y-1">
                 <p>required to render the map interface.</p>
                 <p className="text-red-900/80 dark:text-red-400"><strong>Note:</strong> If you see an <em>ApiNotActivatedMapError</em>, you must go to Google Cloud Console, select your project, and explicitly enable the <strong>Maps JavaScript API</strong>.</p>
               </div>
            </form>
          ) : (
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-2 text-[13px] text-muted font-light">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                api key ready
              </div>
              <button
                onClick={onStartGame}
                className="group flex items-center gap-3 text-[13px] font-medium bg-foreground text-card px-6 py-3 hover:bg-accent-hover transition-all duration-300"
              >
                launch map 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
