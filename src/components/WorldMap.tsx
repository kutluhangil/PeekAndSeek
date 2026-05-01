import React from "react";

// Simplified continent outlines in Mercator projection
// Coordinate system: viewBox 0 0 1000 500
// x = (lng + 180) / 360 * 1000
// y = (90 - lat) / 180 * 500
const CONTINENTS = [
  // North America
  "M 33,69 L 83,53 L 108,56 L 222,50 L 319,47 L 353,119 L 322,128 L 306,133 L 294,136 L 289,153 L 278,181 L 258,192 L 264,222 L 281,225 L 233,208 L 194,186 L 175,161 L 156,122 L 156,114 L 92,86 Z",
  // South America
  "M 286,244 L 294,217 L 325,217 L 342,233 L 403,236 L 403,264 L 397,278 L 381,314 L 358,333 L 344,344 L 319,367 L 317,403 L 314,406 L 300,400 L 292,378 L 306,300 L 275,264 L 278,253 Z",
  // Eurasia (Europe + Asia as one landmass)
  "M 483,150 L 475,133 L 475,128 L 494,128 L 486,117 L 506,108 L 511,106 L 528,97 L 525,92 L 514,83 L 567,56 L 583,56 L 667,56 L 750,50 L 875,50 L 953,64 L 953,106 L 839,139 L 839,167 L 806,194 L 800,222 L 789,247 L 714,228 L 703,194 L 672,183 L 625,217 L 619,219 L 594,172 L 589,164 L 533,158 L 528,147 Z",
  // Africa
  "M 483,150 L 464,172 L 453,211 L 464,228 L 494,236 L 519,239 L 528,242 L 525,256 L 533,297 L 542,319 L 550,344 L 572,344 L 592,322 L 611,292 L 611,278 L 617,253 L 642,222 L 619,219 L 603,189 L 589,164 L 567,161 L 533,158 L 528,147 Z",
  // Australia
  "M 864,284 L 894,281 L 906,297 L 925,322 L 919,344 L 903,356 L 883,347 L 825,347 L 822,339 L 817,311 L 858,292 Z",
  // Greenland
  "M 297,39 L 347,56 L 361,78 L 378,83 L 467,25 L 403,19 Z",
  // UK / Ireland
  "M 486,111 L 486,89 L 492,86 L 503,97 L 506,108 L 497,111 Z",
  // Japan (Honshu)
  "M 889,136 L 895,140 L 889,150 L 875,156 L 862,158 L 868,153 Z",
];

const LAT_LINES = [60, 30, 0, -30, -60];
const LNG_LINES = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];

function WorldSVG() {
  return (
    <svg
      viewBox="0 0 1000 500"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "200vh", height: "100vh", flexShrink: 0, display: "block" }}
      aria-hidden="true"
    >
      {LAT_LINES.map((lat) => {
        const y = ((90 - lat) / 180) * 500;
        return (
          <line
            key={`lat${lat}`}
            x1="0" y1={y} x2="1000" y2={y}
            stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.45"
          />
        );
      })}
      {LNG_LINES.map((lng) => {
        const x = ((lng + 180) / 360) * 1000;
        return (
          <line
            key={`lng${lng}`}
            x1={x} y1="0" x2={x} y2="500"
            stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.45"
          />
        );
      })}
      {CONTINENTS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function WorldMap({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        color: "#1C1917",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          animation: "worldMapScroll 110s linear infinite",
        }}
      >
        <WorldSVG />
        <WorldSVG />
      </div>
    </div>
  );
}
