<div align="center">

<br />

<img src="https://img.shields.io/badge/PeekAndSeek-v1.0-000000?style=for-the-badge&logoColor=white" alt="version" />
<img src="https://img.shields.io/badge/Built_with-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
<img src="https://img.shields.io/badge/React-19-000000?style=for-the-badge&logo=react&logoColor=white" alt="react" />
<img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="vite" />
<img src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwind" />
<img src="https://img.shields.io/badge/Google_Maps-API-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white" alt="googlemaps" />

<br /><br />

```text
 ██████╗ ███████╗███████╗██╗  ██╗    ██╗      ███████╗███████╗███████╗██╗  ██╗
 ██╔══██╗██╔════╝██╔════╝██║ ██╔╝    ╚██╗     ██╔════╝██╔════╝██╔════╝██║ ██╔╝
 ██████╔╝█████╗  █████╗  █████╔╝      ╚██╗    ███████╗█████╗  █████╗  █████╔╝ 
 ██╔═══╝ ██╔══╝  ██╔══╝  ██╔═██╗      ██╔╝    ╚════██║██╔══╝  ██╔══╝  ██╔═██╗ 
 ██║     ███████╗███████╗██║  ██╗    ██╔╝     ███████║███████╗███████╗██║  ██╗
 ╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝    ╚═╝      ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝
```

### **Can you find it on the map?** — A geo-guessing game powered by Google Street View.

[Live App](https://peek-and-seek.vercel.app) · [Report Bug](https://github.com/kutluhangil/PeekAndSeek/issues) · [Request Feature](https://github.com/kutluhangil/PeekAndSeek/issues)

</div>

---

## ✦ What is Peek & Seek?

**Peek & Seek** is a geography-guessing game that drops you anywhere in the world through Google Street View and challenges you to pin your exact location on a world map.

Each round gives you up to **10 guesses**. After every pin, you get a warm/cold hint telling you whether you're getting closer or farther. Rack up points across **5 rounds** by finding each location in as few guesses as possible — the fewer the guesses, the higher the score.

Built with a minimal **bone-white** aesthetic, an animated sketch-style world map background, and a scoring system that rewards both precision and instinct.

---

<details>
<summary><strong>🇹🇷 Türkçe Açıklama</strong></summary>

<br />

**Peek & Seek**, sizi Google Street View üzerinden dünyanın herhangi bir yerine bırakarak harita üzerinde konumunuzu pin atarak bulmaya çalıştığınız bir coğrafya tahmin oyunudur.

Her tur size **10 hak** verir. Her pin attığınızda, doğru konuma yaklaşıp yaklaşmadığınızı söyleyen bir sıcak/soğuk ipucu alırsınız. **5 turda** mümkün olduğunca az hamlede konumları bularak puan kazanın — az hamle, yüksek puan demektir.

Minimal **kemik beyazı** estetik, hareketli çizim tarzı dünya haritası arka planı ve hassasiyeti ödüllendiren bir puanlama sistemiyle inşa edildi.

</details>

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| 🌍 **Street View Drops** | Each round places you at a random street-level location via Google Street View |
| 📍 **Pin & Guess** | Click the world map to drop a pin — up to 10 guesses per round |
| 🌡️ **Warmer / Colder** | Every guess tells you whether you're getting closer or farther from the target |
| 🏆 **5-Round Scoring** | Exponential scoring rewards precision — fewer guesses = exponentially more points |
| 🗺️ **Region Selection** | Focus your game on a specific region: World, Europe, Turkey, Americas, or Asia |
| 🎯 **3 Difficulty Levels** | Novice (wide radius + hints), Explorer (country hint only), Cartographer (no hints) |
| 🔊 **Sound Effects** | Ambient audio feedback for guesses, correct answers, and round transitions |
| 🏅 **Leaderboard** | Persistent leaderboard tracking top scores across all sessions |
| 🌐 **Bilingual UI** | Full English and Turkish language support, switchable at any time |
| ✏️ **Sketch Map Background** | Animated hand-drawn world map with country names, city labels, and borders |

---

## 🖼️ Screenshots

> *(Coming soon — mockups of the landing page and game interface)*

---

## 🛠️ Tech Stack

```text
Frontend        →  React 19 · TypeScript (strict) · Tailwind CSS v4
Build Tool      →  Vite (Fast HMR & Optimized Bundling)
Maps & Geo      →  @vis.gl/react-google-maps (Maps JS API · Street View · Geocoding)
UI Elements     →  Lucide React Icons · SVG sketch world map (pure CSS animation)
Scoring         →  Haversine distance formula · Exponential decay scoring
Audio Engine    →  Web Audio API (synthesized sound effects)
Backend         →  Express.js (Street View proxy · leaderboard API)
Database        →  better-sqlite3 (local leaderboard persistence)
Deployment      →  Vercel (SPA rewrites · immutable asset caching)
```

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                        PEEK & SEEK APP                           │
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐ │
│  │  React 19     │  │  Vite Build   │  │   Google Maps API     │ │
│  │  Client SPA   │  │  Optimized    │  │  Street View + Geo    │ │
│  └───────────────┘  └───────────────┘  └───────────────────────┘ │
└───────────────────────────┬──────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
┌────────────────┐  ┌───────────────┐  ┌───────────────────┐
│ Street View    │  │ Express Node  │  │  Scoring Engine   │
│ (Random coord  │  │ (Proxy API +  │  │ (Haversine dist + │
│  generation)   │  │  Leaderboard) │  │  Exponential pts) │
└────────────────┘  └───────────────┘  └───────────────────┘
                            │
                   ┌────────────────┐
                   │  SQLite DB     │
                   │ (Leaderboard   │
                   │  persistence)  │
                   └────────────────┘
```

---

## 📐 Project Structure

```text
PeekAndSeek/
├── public/                 # Static assets
├── api/                    # Vercel serverless functions
│   ├── health.ts           # Health check endpoint
│   └── streetview.ts       # Street View location proxy
├── src/
│   ├── components/         # React components
│   │   ├── Footer.tsx      # Application footer
│   │   ├── LandingPage.tsx # Game config & animated intro screen
│   │   ├── MapSection.tsx  # Core game: Street View + guess map
│   │   └── WorldMap.tsx    # Animated SVG sketch world map background
│   ├── lib/                # Utilities and core logic
│   │   ├── leaderboard.ts  # Score submission & retrieval
│   │   ├── regions.ts      # Region bounds & coordinate generation
│   │   ├── scoring.ts      # Haversine + exponential scoring
│   │   ├── sounds.ts       # Web Audio API sound synthesis
│   │   ├── storage.ts      # SQLite leaderboard persistence
│   │   └── utils.ts        # Tailwind cn helper
│   ├── App.tsx             # Root state & view orchestration
│   ├── index.css           # Tailwind v4 + global animations
│   └── main.tsx            # React entry point
├── server.ts               # Express server (dev + production)
├── vercel.json             # SPA rewrites + cache headers
├── package.json            # Scripts & dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler settings
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- npm or yarn
- A [Google Maps API key](https://developers.google.com/maps) with **Maps JS API**, **Street View API**, and **Geocoding API** enabled

### Local Development

```bash
# Clone the repository
git clone https://github.com/kutluhangil/PeekAndSeek.git
cd PeekAndSeek

# Install dependencies
npm install

# Start the dev server
npm run dev
```

App runs at `http://localhost:3000`. Enter your Google Maps API key on the landing page to start playing.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server via `tsx` (Express + Vite middleware) |
| `npm run build` | Production build into `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm run clean` | Remove the `dist` folder |

---

## 🎮 How to Play

1. **Enter your Google Maps API key** on the landing page (stored locally in your browser)
2. **Choose a difficulty** — Novice, Explorer, or Cartographer
3. **Choose a region** — World, Europe, Turkey, Americas, or Asia
4. **Click "Start Playing"** — a Street View panorama loads from a random location
5. **Drop a pin** on the world map where you think the photo was taken
6. **Get feedback** — warmer means closer, colder means farther
7. **Repeat** until you find the spot or exhaust your 10 guesses
8. **5 rounds total** — your score accumulates across all rounds

### Scoring

```
Points per round = max(0, 5000 × e^(−k × guesses))
```

Finding the location on your **first guess** scores the full **5,000 points**. Each additional guess exponentially reduces your score. Maximum possible score across 5 rounds: **25,000 points**.

### Difficulty Levels

| Level | Hints | Street View | Target Radius |
|-------|-------|-------------|---------------|
| **Novice** | Warm/cold feedback | Enabled | Wide |
| **Explorer** | Country name only | Enabled | Tight |
| **Cartographer** | No hints | Disabled | Tight |

---

## 🔒 Configuration & Storage

| Layer | Implementation |
|-------|----------------|
| **API Key** | Stored in `localStorage` — never sent to any server |
| **Leaderboard** | Persisted in SQLite via `better-sqlite3` on the Express server |
| **Street View Proxy** | `/api/streetview` handles coordinate generation server-side |
| **Region Bounds** | Coordinate bounding boxes defined in `src/lib/regions.ts` |

---

## ☁️ Deployment to Vercel

### Quick Deploy

1. Push to GitHub and import the repository into Vercel
2. Set environment variables in **Settings → Environment Variables**:
   - `VITE_GOOGLE_MAPS_API_KEY` — your Google Maps API key
3. Deploy — the `vercel-build` script handles the rest

### Google Cloud Setup

Enable the following APIs in your Google Cloud project:

- **Maps JavaScript API**
- **Street View Static API**
- **Geocoding API**

Make sure billing is active, and add your Vercel domain to the API key's HTTP referrer restrictions:

```
https://your-project.vercel.app/*
http://localhost:3000/*
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

Built with precision by [kutluhangil](https://github.com/kutluhangil)

<br />

*If you find this useful, consider giving it a ⭐*

</div>
