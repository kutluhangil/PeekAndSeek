// Mercator projection helpers — viewBox 0 0 1000 500
const X = (lng: number) => ((lng + 180) / 360) * 1000;
const Y = (lat: number) => ((90 - lat) / 180) * 500;

type Coord = [number, number]; // [lat, lng]

function path(coords: Coord[], close = true) {
  return (
    coords
      .map(([lat, lng], i) => `${i === 0 ? "M" : "L"}${X(lng).toFixed(1)},${Y(lat).toFixed(1)}`)
      .join("") + (close ? "Z" : "")
  );
}

// ─── CONTINENTS ─────────────────────────────────────────────────────────────

// North America — full outer coastline
const NA: Coord[] = [
  [71,-157],[71,-148],[70,-142],[68,-137],[58,-137],[55,-131],[51,-127],
  [49,-124],[47,-124],[40,-124],[37,-122],[34,-120],[32,-117],[28,-115],
  [23,-110],[22,-106],[19,-104],[17,-100],[16,-96],[15,-92],[14,-90],
  [13,-88],[12,-86],[10,-84],[9,-80],
  // Caribbean / Gulf of Mexico coast
  [10,-83],[12,-83],[14,-88],[16,-88],[18,-88],[21,-87],[21,-90],
  [19,-96],[22,-98],[25,-97],[29,-95],[29,-89],[30,-88],[30,-85],
  [25,-80],
  // East coast N
  [31,-81],[33,-79],[35,-76],[37,-76],[39,-74],[41,-72],[42,-70],
  [44,-64],[46,-63],[47,-54],
  // Labrador / NE Canada
  [52,-56],[55,-60],[57,-61],[60,-65],[63,-67],[67,-73],[70,-85],
  [72,-96],[73,-120],[72,-132],[71,-142],
];

// South America
const SA: Coord[] = [
  [11,-73],[12,-72],[12,-62],[10,-62],[8,-60],[6,-58],[6,-52],
  [4,-52],[3,-50],[4,-44],[5,-35],[4,-37],[-5,-35],[-10,-37],
  [-13,-39],[-15,-39],[-20,-40],[-23,-43],[-26,-49],[-29,-50],
  [-30,-51],[-34,-54],[-34,-57],[-38,-58],[-40,-62],[-42,-63],
  [-46,-65],[-50,-68],[-52,-68],[-55,-66],[-56,-67],[-54,-72],
  [-50,-75],[-46,-74],[-41,-73],[-35,-72],[-30,-71],[-23,-70],
  [-18,-70],[-14,-76],[-8,-79],[-5,-81],[-2,-80],[0,-80],
  [2,-77],[5,-77],[9,-76],[11,-73],
];

// Eurasia — one connected landmass (Europe + Asia)
const EURASIA: Coord[] = [
  // Iberia → France → NW Europe
  [37,-9],[40,-9],[43,-9],[43,-2],[44,-1],[48,-5],[51,2],[52,4],
  [54,8],[55,9],
  // Scandinavia
  [58,5],[62,6],[65,14],[68,17],[70,22],[71,25],
  // Russia: Kola → Arctic coast going E
  [70,29],[69,34],[70,42],[70,60],[71,78],[72,100],[72,130],
  // NE Russia → Kamchatka
  [70,150],[67,163],[64,173],[57,163],[52,163],
  // Korea/China E coast
  [40,130],[40,122],[35,122],[30,122],[22,114],[20,110],
  // Indochina coast
  [16,108],[12,109],[10,108],[5,103],[1,104],
  // Malay → Indian Ocean → India W
  [8,77],[8,77],[20,73],[23,68],
  // Arabian Peninsula S + E coasts
  [22,60],[12,44],[11,43],
  // Red Sea W → Sinai → Egypt → Libya → Med
  [28,34],[30,33],[31,32],[32,25],[33,12],[37,10],
  // Morocco → Gibraltar → Portugal
  [36,-5],[37,-9],
];

// Africa
const AFRICA: Coord[] = [
  // Mediterranean coast E to W
  [36,-5],[36,-1],[37,10],[33,12],[33,24],[32,25],[31,32],
  // Red Sea W (Egypt → Djibouti)
  [30,33],[28,34],[22,38],[15,42],[12,43],[11,43],
  // Horn of Africa
  [11,51],[10,51],[2,42],[-5,40],
  // E coast S
  [-10,40],[-15,40],[-22,35],[-26,33],[-30,31],
  // Cape of Good Hope
  [-33,26],[-34,18],[-34,17],
  // W coast N
  [-30,17],[-23,14],[-17,12],[-5,12],
  // Gulf of Guinea
  [0,9],[3,10],[5,2],[5,-2],[5,-8],
  // W African coast N
  [7,-12],[10,-16],[12,-16],[14,-17],[15,-17],
  [22,-17],[28,-13],[34,-7],[36,-5],
];

// Australia
const AUS: Coord[] = [
  [-14,127],[-12,131],[-11,142],[-16,146],[-24,152],
  [-27,153],[-34,151],[-38,146],[-38,145],[-35,138],
  [-32,134],[-32,116],[-22,114],[-17,122],[-14,127],
];

// Greenland
const GREENLAND: Coord[] = [
  [76,-73],[73,-55],[68,-54],[65,-44],[60,-46],[64,-52],
  [63,-66],[66,-65],[68,-72],[70,-80],[76,-73],
];

// British Isles
const UK: Coord[] = [
  [50,-5],[51,0],[52,2],[53,0],[56,0],[57,-2],[58,-5],[58,-4],
  [57,-6],[55,-6],[54,-3],[52,-5],[50,-5],
];

// Ireland
const IRELAND: Coord[] = [
  [51,-10],[53,-10],[54,-8],[55,-7],[54,-6],[52,-6],[51,-10],
];

// Iceland
const ICELAND: Coord[] = [
  [64,-24],[64,-18],[65,-14],[66,-13],[66,-18],[64,-22],[64,-24],
];

// Japan (Honshu + Kyushu simplified)
const JAPAN: Coord[] = [
  [45,141],[40,141],[37,141],[35,136],[33,131],[33,130],
  [34,131],[35,134],[37,137],[39,140],[40,141],[41,141],[45,141],
];

// New Zealand (North Island)
const NZ_N: Coord[] = [
  [-34,172],[-35,174],[-37,176],[-39,177],[-41,175],[-41,173],
  [-38,175],[-36,174],[-34,172],
];

// Cuba
const CUBA: Coord[] = [
  [20,-75],[22,-79],[22,-83],[20,-82],[20,-79],[20,-75],
];

// Madagascar
const MADA: Coord[] = [
  [-13,49],[-16,50],[-18,50],[-22,48],[-25,44],[-25,43],
  [-22,44],[-18,44],[-13,47],[-13,49],
];

// Sri Lanka
const SRI_LANKA: Coord[] = [
  [9,81],[7,80],[6,82],[8,81],[9,81],
];

// Philippines (simplified Luzon)
const LUZON: Coord[] = [
  [18,122],[16,120],[14,122],[15,120],[16,122],[18,122],
];

// ─── COUNTRY BORDERS (simplified straight lines) ─────────────────────────

interface Border { a: Coord; b: Coord; dash?: string; }

const BORDERS: Border[] = [
  // USA / Canada (49th parallel ≈ rough line)
  { a: [49, -125], b: [49, -90] },
  { a: [49, -90], b: [49, -67] },
  // USA / Mexico (Rio Grande simplified)
  { a: [32, -117], b: [32, -106] },
  { a: [30, -106], b: [26, -97] },
  // Brazil / Argentina/Bolivia (rough)
  { a: [-15, -73], b: [-15, -35] },
  { a: [-25, -69], b: [-25, -35] },
  // Russia / Kazakhstan / China N (rough 50th parallel segment)
  { a: [50, 60], b: [50, 80] },
  { a: [50, 80], b: [50, 120] },
  // China / India / Pakistan (simplified)
  { a: [35, 80], b: [35, 97] },
  // Sahara (informal boundary Algeria/Sudan zone, dashed)
  { a: [22, -15], b: [22, 40], dash: "3,4" },
  // Tropic of Cancer (dashed)
  { a: [23.5, -180], b: [23.5, 180], dash: "2,6" },
  // Tropic of Capricorn
  { a: [-23.5, -180], b: [-23.5, 180], dash: "2,6" },
];

// ─── CITIES ──────────────────────────────────────────────────────────────────

interface CityDef { lat: number; lng: number; name: string; anchor?: "start" | "end" | "middle"; dx?: number; dy?: number; }

const CITIES: CityDef[] = [
  // North America
  { lat: 40.7, lng: -74.0, name: "New York", anchor: "start", dx: 4, dy: -3 },
  { lat: 34.0, lng: -118.2, name: "Los Angeles", anchor: "start", dx: 4, dy: -3 },
  { lat: 41.9, lng: -87.6, name: "Chicago", anchor: "start", dx: 4, dy: -3 },
  { lat: 43.7, lng: -79.4, name: "Toronto", anchor: "start", dx: 4, dy: -3 },
  { lat: 19.4, lng: -99.1, name: "Mexico City", anchor: "end", dx: -4, dy: -3 },
  // South America
  { lat: -23.5, lng: -46.6, name: "São Paulo", anchor: "start", dx: 4, dy: -3 },
  { lat: -34.6, lng: -58.4, name: "Buenos Aires", anchor: "start", dx: 4, dy: -3 },
  { lat: -33.5, lng: -70.6, name: "Santiago", anchor: "end", dx: -4, dy: -3 },
  { lat: -3.0, lng: -60.0, name: "Manaus", anchor: "start", dx: 4, dy: -3 },
  // Europe
  { lat: 51.5, lng: 0.1, name: "London", anchor: "start", dx: 4, dy: -3 },
  { lat: 48.9, lng: 2.3, name: "Paris", anchor: "start", dx: 4, dy: -3 },
  { lat: 52.5, lng: 13.4, name: "Berlin", anchor: "start", dx: 4, dy: -3 },
  { lat: 55.8, lng: 37.6, name: "Moscow", anchor: "start", dx: 4, dy: -3 },
  { lat: 41.0, lng: 29.0, name: "Istanbul", anchor: "start", dx: 4, dy: -3 },
  { lat: 40.4, lng: -3.7, name: "Madrid", anchor: "end", dx: -4, dy: -3 },
  { lat: 41.4, lng: 2.2, name: "Barcelona", anchor: "end", dx: -4, dy: 8 },
  { lat: 45.5, lng: 9.2, name: "Milan", anchor: "start", dx: 4, dy: -3 },
  { lat: 41.9, lng: 12.5, name: "Rome", anchor: "start", dx: 4, dy: -3 },
  { lat: 59.9, lng: 30.3, name: "St. Petersburg", anchor: "start", dx: 4, dy: -3 },
  // Africa
  { lat: 30.1, lng: 31.2, name: "Cairo", anchor: "start", dx: 4, dy: -3 },
  { lat: 6.5, lng: 3.4, name: "Lagos", anchor: "start", dx: 4, dy: -3 },
  { lat: -1.3, lng: 36.8, name: "Nairobi", anchor: "start", dx: 4, dy: -3 },
  { lat: -33.9, lng: 18.4, name: "Cape Town", anchor: "start", dx: 4, dy: -3 },
  { lat: 15.6, lng: 32.5, name: "Khartoum", anchor: "start", dx: 4, dy: -3 },
  // Middle East / Asia
  { lat: 25.2, lng: 55.3, name: "Dubai", anchor: "start", dx: 4, dy: -3 },
  { lat: 24.7, lng: 46.7, name: "Riyadh", anchor: "start", dx: 4, dy: -3 },
  { lat: 19.1, lng: 72.9, name: "Mumbai", anchor: "end", dx: -4, dy: -3 },
  { lat: 28.6, lng: 77.2, name: "Delhi", anchor: "end", dx: -4, dy: -3 },
  { lat: 39.9, lng: 116.4, name: "Beijing", anchor: "start", dx: 4, dy: -3 },
  { lat: 31.2, lng: 121.5, name: "Shanghai", anchor: "start", dx: 4, dy: -3 },
  { lat: 35.7, lng: 139.7, name: "Tokyo", anchor: "start", dx: 4, dy: -3 },
  { lat: 37.6, lng: 127.0, name: "Seoul", anchor: "start", dx: 4, dy: -3 },
  { lat: 1.4, lng: 103.8, name: "Singapore", anchor: "start", dx: 4, dy: -3 },
  { lat: 21.0, lng: 105.8, name: "Hanoi", anchor: "start", dx: 4, dy: -3 },
  { lat: 13.8, lng: 100.5, name: "Bangkok", anchor: "start", dx: 4, dy: -3 },
  // Australia / Oceania
  { lat: -33.9, lng: 151.2, name: "Sydney", anchor: "start", dx: 4, dy: -3 },
  { lat: -37.8, lng: 145.0, name: "Melbourne", anchor: "start", dx: 4, dy: 8 },
  { lat: -31.9, lng: 115.9, name: "Perth", anchor: "end", dx: -4, dy: -3 },
];

// ─── REGION LABELS ───────────────────────────────────────────────────────────

interface LabelDef { lat: number; lng: number; text: string; size: number; opacity: number; spacing?: string; }

const REGION_LABELS: LabelDef[] = [
  // Continents / countries
  { lat: 56, lng: -100, text: "C A N A D A", size: 9, opacity: 0.5, spacing: "2px" },
  { lat: 38, lng: -100, text: "U N I T E D   S T A T E S", size: 8.5, opacity: 0.5, spacing: "1.5px" },
  { lat: -12, lng: -52, text: "B R A Z I L", size: 8.5, opacity: 0.5, spacing: "2px" },
  { lat: -36, lng: -65, text: "A R G E N T I N A", size: 7.5, opacity: 0.45, spacing: "1.5px" },
  { lat: 62, lng: 95, text: "R U S S I A", size: 9, opacity: 0.5, spacing: "2px" },
  { lat: 55, lng: 15, text: "E U R O P E", size: 8, opacity: 0.4, spacing: "2px" },
  { lat: 35, lng: 103, text: "C H I N A", size: 9, opacity: 0.5, spacing: "2px" },
  { lat: 22, lng: 78, text: "I N D I A", size: 8.5, opacity: 0.5, spacing: "2px" },
  { lat: -24, lng: 132, text: "A U S T R A L I A", size: 8.5, opacity: 0.5, spacing: "2px" },
  { lat: 5, lng: 17, text: "A F R I C A", size: 8.5, opacity: 0.4, spacing: "2px" },
  { lat: 25, lng: 44, text: "A R A B I A", size: 7.5, opacity: 0.45, spacing: "1.5px" },
  { lat: 50, lng: -35, text: "G R E E N L A N D", size: 7, opacity: 0.4, spacing: "1.5px" },
  { lat: 64, lng: -19, text: "I C E L A N D", size: 6.5, opacity: 0.4, spacing: "1px" },
  // Oceans
  { lat: 25, lng: -38, text: "A T L A N T I C", size: 8, opacity: 0.28, spacing: "2px" },
  { lat: 5, lng: -28, text: "O C E A N", size: 7, opacity: 0.22, spacing: "2px" },
  { lat: 20, lng: -155, text: "P A C I F I C", size: 9, opacity: 0.28, spacing: "2px" },
  { lat: 0, lng: -150, text: "O C E A N", size: 7, opacity: 0.22, spacing: "2px" },
  { lat: -15, lng: 75, text: "I N D I A N", size: 8, opacity: 0.28, spacing: "2px" },
  { lat: -25, lng: 75, text: "O C E A N", size: 7, opacity: 0.22, spacing: "2px" },
  { lat: -55, lng: 0, text: "S O U T H E R N   O C E A N", size: 6.5, opacity: 0.22, spacing: "1.5px" },
  // Arctic
  { lat: 82, lng: 0, text: "A R C T I C   O C E A N", size: 6.5, opacity: 0.25, spacing: "1.5px" },
];

// ─── LAT/LNG GRID ────────────────────────────────────────────────────────────

const LAT_LINES = [-60, -30, 0, 30, 60];
const LNG_LINES = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];

// ─── PRE-COMPUTED PATHS (at module load, not per render) ──────────────────────

const CONTINENT_PATHS = [
  { d: path(NA), id: "na" },
  { d: path(SA), id: "sa" },
  { d: path(EURASIA), id: "eu" },
  { d: path(AFRICA), id: "af" },
  { d: path(AUS), id: "au" },
  { d: path(GREENLAND), id: "gl" },
  { d: path(UK), id: "uk" },
  { d: path(IRELAND), id: "ie" },
  { d: path(ICELAND), id: "is" },
  { d: path(JAPAN), id: "jp" },
  { d: path(NZ_N), id: "nz" },
  { d: path(CUBA), id: "cu" },
  { d: path(MADA), id: "mg" },
  { d: path(SRI_LANKA), id: "lk" },
  { d: path(LUZON), id: "ph" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

function WorldSVG() {
  return (
    <svg
      viewBox="0 0 1000 500"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "200vh", height: "100vh", flexShrink: 0, display: "block" }}
      aria-hidden="true"
    >
      {/* Grid lines */}
      <g opacity="0.35">
        {LAT_LINES.map((lat) => (
          <line
            key={`lat${lat}`}
            x1="0" y1={Y(lat).toFixed(1)} x2="1000" y2={Y(lat).toFixed(1)}
            stroke="currentColor" strokeWidth="0.5"
          />
        ))}
        {LNG_LINES.map((lng) => (
          <line
            key={`lng${lng}`}
            x1={X(lng).toFixed(1)} y1="0" x2={X(lng).toFixed(1)} y2="500"
            stroke="currentColor" strokeWidth="0.5"
          />
        ))}
        {/* Equator slightly heavier */}
        <line x1="0" y1={Y(0).toFixed(1)} x2="1000" y2={Y(0).toFixed(1)}
          stroke="currentColor" strokeWidth="1" />
        {/* Prime meridian */}
        <line x1={X(0).toFixed(1)} y1="0" x2={X(0).toFixed(1)} y2="500"
          stroke="currentColor" strokeWidth="1" />
        {/* Grid degree labels */}
        {LAT_LINES.filter((l) => l !== 0).map((lat) => (
          <text key={`latl${lat}`} x="3" y={Y(lat) + 4} fontSize="5" fill="currentColor" opacity="0.5" fontFamily="monospace">
            {lat > 0 ? `${lat}°N` : `${Math.abs(lat)}°S`}
          </text>
        ))}
        {LNG_LINES.filter((l) => l !== 0).map((lng) => (
          <text key={`lngl${lng}`} x={X(lng) + 2} y={Y(-70)} fontSize="5" fill="currentColor" opacity="0.5" fontFamily="monospace">
            {lng > 0 ? `${lng}°E` : `${Math.abs(lng)}°W`}
          </text>
        ))}
      </g>

      {/* Tropics and other special lines */}
      {BORDERS.filter((b) => b.dash).map((b, i) => (
        <line
          key={`dashed${i}`}
          x1={X(b.a[1]).toFixed(1)} y1={Y(b.a[0]).toFixed(1)}
          x2={X(b.b[1]).toFixed(1)} y2={Y(b.b[0]).toFixed(1)}
          stroke="currentColor" strokeWidth="0.5" strokeDasharray={b.dash}
          opacity="0.25"
        />
      ))}

      {/* Country borders */}
      {BORDERS.filter((b) => !b.dash).map((b, i) => (
        <line
          key={`border${i}`}
          x1={X(b.a[1]).toFixed(1)} y1={Y(b.a[0]).toFixed(1)}
          x2={X(b.b[1]).toFixed(1)} y2={Y(b.b[0]).toFixed(1)}
          stroke="currentColor" strokeWidth="0.6" strokeDasharray="3,3"
          opacity="0.4"
        />
      ))}

      {/* Continent outlines */}
      {CONTINENT_PATHS.map(({ d, id }) => (
        <path
          key={id}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}

      {/* City dots */}
      {CITIES.map((c) => (
        <circle
          key={`dot-${c.name}`}
          cx={X(c.lng).toFixed(1)}
          cy={Y(c.lat).toFixed(1)}
          r="1.8"
          fill="currentColor"
          opacity="0.7"
        />
      ))}

      {/* City labels */}
      {CITIES.map((c) => (
        <text
          key={`label-${c.name}`}
          x={(X(c.lng) + (c.dx ?? 0)).toFixed(1)}
          y={(Y(c.lat) + (c.dy ?? 0)).toFixed(1)}
          fontSize="6.5"
          fill="currentColor"
          opacity="0.8"
          fontFamily="monospace"
          textAnchor={c.anchor ?? "start"}
        >
          {c.name}
        </text>
      ))}

      {/* Region / country / ocean labels */}
      {REGION_LABELS.map((l, i) => (
        <text
          key={`region${i}`}
          x={X(l.lng).toFixed(1)}
          y={Y(l.lat).toFixed(1)}
          fontSize={l.size}
          fill="currentColor"
          opacity={l.opacity}
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing={l.spacing ?? "0"}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}

export function WorldMap({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        color: "#1c1917",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          animation: "worldMapScroll 120s linear infinite",
        }}
      >
        <WorldSVG />
        <WorldSVG />
      </div>
    </div>
  );
}
