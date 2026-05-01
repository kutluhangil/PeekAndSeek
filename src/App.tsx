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

export type Lang = "en" | "tr";

export default function App() {
  const [view, setView] = useState<"landing" | "map">("landing");
  const [apiKey, setApiKey] = useState<string>("");
  const [lang, setLang] = useState<Lang>(() => {
    return (getStoredItem("peek_lang") as Lang) || "tr";
  });

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

  const handleSetLang = (l: Lang) => {
    setStoredItem("peek_lang", l);
    setLang(l);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {view === "landing" ? (
        <>
          <LandingPage
            onStartGame={() => setView("map")}
            apiKey={apiKey}
            onSaveKey={handleSaveKey}
            lang={lang}
            onSetLang={handleSetLang}
          />
          <Footer />
        </>
      ) : (
        <MapSection onBack={() => setView("landing")} apiKey={apiKey} lang={lang} />
      )}
    </div>
  );
}
