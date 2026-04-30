/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import MapSection from "./components/MapSection";
import Footer from "./components/Footer";
import { getStoredItem, setStoredItem } from "./lib/storage";

export default function App() {
  const [view, setView] = useState<"landing" | "map">("landing");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const storedKey = getStoredItem("google_maps_api_key");
    const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (storedKey) setApiKey(storedKey);
    else if (envKey) setApiKey(envKey);
  }, []);

  const handleSaveKey = (key: string) => {
    const trimmed = key.trim();
    setStoredItem("google_maps_api_key", trimmed);
    setApiKey(trimmed);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {view === "landing" ? (
        <>
          <LandingPage
            onStartGame={() => setView("map")}
            apiKey={apiKey}
            onSaveKey={handleSaveKey}
          />
          <Footer />
        </>
      ) : (
        <MapSection onBack={() => setView("landing")} apiKey={apiKey} />
      )}
    </div>
  );
}
