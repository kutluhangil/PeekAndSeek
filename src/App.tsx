/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MapSection from './components/MapSection';
import Footer from './components/Footer';

export default function App() {
  const [view, setView] = useState<'landing' | 'map'>('landing');
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem('google_maps_api_key');
    const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (storedKey) setApiKey(storedKey);
    else if (envKey) setApiKey(envKey);
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('google_maps_api_key', key.trim());
    setApiKey(key.trim());
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {view === 'landing' ? (
        <>
          <LandingPage onStartGame={() => setView('map')} apiKey={apiKey} onSaveKey={handleSaveKey} />
          <Footer />
        </>
      ) : (
        <MapSection onBack={() => setView('landing')} apiKey={apiKey} />
      )}
    </div>
  );
}

