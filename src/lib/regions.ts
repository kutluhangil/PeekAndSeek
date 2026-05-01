export type Region = "world" | "europe" | "turkey" | "americas" | "asia";

type LatLng = { lat: number; lng: number };

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function jitter(c: LatLng, d = 0.05): LatLng {
  return { lat: c.lat + (Math.random() - 0.5) * d, lng: c.lng + (Math.random() - 0.5) * d };
}

const CITIES: Record<Region, LatLng[]> = {
  world: [
    { lat: 48.8566, lng: 2.3522 },    // Paris
    { lat: 51.5074, lng: -0.1278 },   // London
    { lat: 40.7128, lng: -74.006 },   // New York
    { lat: 35.6762, lng: 139.6503 },  // Tokyo
    { lat: 41.0082, lng: 28.9784 },   // Istanbul
    { lat: -33.8688, lng: 151.2093 }, // Sydney
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: 52.52, lng: 13.405 },      // Berlin
    { lat: 40.4168, lng: -3.7038 },   // Madrid
    { lat: 55.7558, lng: 37.6173 },   // Moscow
    { lat: 39.9042, lng: 116.4074 },  // Beijing
    { lat: 19.4326, lng: -99.1332 },  // Mexico City
    { lat: -23.5505, lng: -46.6333 }, // São Paulo
    { lat: 28.6139, lng: 77.209 },    // New Delhi
    { lat: 1.3521, lng: 103.8198 },   // Singapore
    { lat: 25.2048, lng: 55.2708 },   // Dubai
    { lat: 30.0444, lng: 31.2357 },   // Cairo
    { lat: 13.7563, lng: 100.5018 },  // Bangkok
    { lat: 43.6532, lng: -79.3832 },  // Toronto
    { lat: 41.3851, lng: 2.1734 },    // Barcelona
    { lat: 48.2082, lng: 16.3738 },   // Vienna
    { lat: 50.0755, lng: 14.4378 },   // Prague
    { lat: 59.9139, lng: 10.7522 },   // Oslo
    { lat: 55.6761, lng: 12.5683 },   // Copenhagen
    { lat: 59.3293, lng: 18.0686 },   // Stockholm
    { lat: 41.9028, lng: 12.4964 },   // Rome
    { lat: 37.9838, lng: 23.7275 },   // Athens
    { lat: 47.4979, lng: 19.0402 },   // Budapest
    { lat: 52.2297, lng: 21.0122 },   // Warsaw
    { lat: 50.45, lng: 30.5234 },     // Kyiv
    { lat: 37.5665, lng: 126.978 },   // Seoul
    { lat: 31.2304, lng: 121.4737 },  // Shanghai
    { lat: 22.3193, lng: 114.1694 },  // Hong Kong
    { lat: -26.2041, lng: 28.0473 },  // Johannesburg
    { lat: -1.2921, lng: 36.8219 },   // Nairobi
    { lat: 33.8869, lng: 35.5131 },   // Beirut
    { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
    { lat: 4.711, lng: -74.0721 },    // Bogotá
    { lat: 23.1136, lng: -82.3666 },  // Havana
    { lat: 3.139, lng: 101.6869 },    // Kuala Lumpur
  ],
  europe: [
    { lat: 48.8566, lng: 2.3522 },   // Paris
    { lat: 51.5074, lng: -0.1278 },  // London
    { lat: 52.52, lng: 13.405 },     // Berlin
    { lat: 40.4168, lng: -3.7038 },  // Madrid
    { lat: 41.3851, lng: 2.1734 },   // Barcelona
    { lat: 41.9028, lng: 12.4964 },  // Rome
    { lat: 45.4654, lng: 9.1859 },   // Milan
    { lat: 48.2082, lng: 16.3738 },  // Vienna
    { lat: 50.0755, lng: 14.4378 },  // Prague
    { lat: 47.3769, lng: 8.5417 },   // Zurich
    { lat: 59.9139, lng: 10.7522 },  // Oslo
    { lat: 55.6761, lng: 12.5683 },  // Copenhagen
    { lat: 60.1699, lng: 24.9384 },  // Helsinki
    { lat: 59.3293, lng: 18.0686 },  // Stockholm
    { lat: 53.3498, lng: -6.2603 },  // Dublin
    { lat: 37.9838, lng: 23.7275 },  // Athens
    { lat: 47.4979, lng: 19.0402 },  // Budapest
    { lat: 52.2297, lng: 21.0122 },  // Warsaw
    { lat: 50.8503, lng: 4.3517 },   // Brussels
    { lat: 48.1351, lng: 11.582 },   // Munich
    { lat: 52.3676, lng: 4.9041 },   // Amsterdam
    { lat: 50.45, lng: 30.5234 },    // Kyiv
    { lat: 38.7223, lng: -9.1393 },  // Lisbon
    { lat: 45.764, lng: 4.8357 },    // Lyon
    { lat: 43.2965, lng: 5.3698 },   // Marseille
    { lat: 51.0543, lng: 3.7174 },   // Ghent
    { lat: 50.9333, lng: 6.95 },     // Cologne
    { lat: 47.8095, lng: 13.055 },   // Salzburg
    { lat: 43.8503, lng: 18.3564 },  // Sarajevo
    { lat: 42.6977, lng: 23.3219 },  // Sofia
    { lat: 44.4268, lng: 26.1025 },  // Bucharest
    { lat: 56.9496, lng: 24.1052 },  // Riga
    { lat: 59.437, lng: 24.7536 },   // Tallinn
    { lat: 54.6872, lng: 25.2797 },  // Vilnius
    { lat: 43.7696, lng: 11.2558 },  // Florence
    { lat: 40.8518, lng: 14.2681 },  // Naples
    { lat: 44.8176, lng: 20.4569 },  // Belgrade
    { lat: 41.1579, lng: -8.6291 },  // Porto
  ],
  turkey: [
    { lat: 41.0082, lng: 28.9784 },  // Istanbul European
    { lat: 41.02, lng: 29.05 },      // Istanbul Asian
    { lat: 39.9334, lng: 32.8597 },  // Ankara
    { lat: 38.4192, lng: 27.1287 },  // Izmir
    { lat: 36.8969, lng: 30.7133 },  // Antalya
    { lat: 37.0, lng: 35.3213 },     // Adana
    { lat: 40.1885, lng: 29.061 },   // Bursa
    { lat: 37.8746, lng: 32.4932 },  // Konya
    { lat: 41.2867, lng: 36.33 },    // Samsun
    { lat: 40.9128, lng: 38.3895 },  // Trabzon
    { lat: 36.5617, lng: 36.1735 },  // Hatay
    { lat: 37.7648, lng: 29.0864 },  // Denizli
    { lat: 38.3552, lng: 38.3095 },  // Malatya
    { lat: 36.9903, lng: 35.3219 },  // Mersin
    { lat: 37.2153, lng: 28.3636 },  // Muğla
    { lat: 41.6889, lng: 26.5563 },  // Edirne
    { lat: 38.7312, lng: 35.4787 },  // Kayseri
    { lat: 38.6489, lng: 34.8474 },  // Nevşehir (Cappadocia)
    { lat: 37.3824, lng: 27.2725 },  // Bodrum
    { lat: 36.7987, lng: 29.1369 },  // Fethiye
    { lat: 37.6634, lng: 30.5519 },  // Isparta
    { lat: 39.7477, lng: 37.0179 },  // Sivas
    { lat: 37.9716, lng: 40.7197 },  // Diyarbakır
    { lat: 40.6500, lng: 35.85 },    // Çorum
    { lat: 37.8813, lng: 41.1351 },  // Batman
  ],
  americas: [
    { lat: 40.7128, lng: -74.006 },   // New York
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 41.8781, lng: -87.6298 },  // Chicago
    { lat: 29.7604, lng: -95.3698 },  // Houston
    { lat: 47.6062, lng: -122.3321 }, // Seattle
    { lat: 25.7617, lng: -80.1918 },  // Miami
    { lat: 39.9526, lng: -75.1652 },  // Philadelphia
    { lat: 32.7767, lng: -96.797 },   // Dallas
    { lat: 30.2672, lng: -97.7431 },  // Austin
    { lat: 43.6532, lng: -79.3832 },  // Toronto
    { lat: 45.5017, lng: -73.5673 },  // Montreal
    { lat: 49.2827, lng: -123.1207 }, // Vancouver
    { lat: -23.5505, lng: -46.6333 }, // São Paulo
    { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
    { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
    { lat: -33.4489, lng: -70.6693 }, // Santiago
    { lat: 4.711, lng: -74.0721 },    // Bogotá
    { lat: -12.0464, lng: -77.0428 }, // Lima
    { lat: 19.4326, lng: -99.1332 },  // Mexico City
    { lat: 20.9674, lng: -89.5926 },  // Mérida
    { lat: 25.6866, lng: -100.3161 }, // Monterrey
    { lat: 10.4806, lng: -66.9036 },  // Caracas
    { lat: 18.4655, lng: -66.1057 },  // San Juan
    { lat: 23.1136, lng: -82.3666 },  // Havana
    { lat: -0.1807, lng: -78.4678 },  // Quito
    { lat: 38.9072, lng: -77.0369 },  // Washington DC
    { lat: 42.3601, lng: -71.0589 },  // Boston
    { lat: 32.7555, lng: -117.1523 }, // San Diego
    { lat: 36.1699, lng: -115.1398 }, // Las Vegas
  ],
  asia: [
    { lat: 35.6762, lng: 139.6503 }, // Tokyo
    { lat: 37.5665, lng: 126.978 },  // Seoul
    { lat: 39.9042, lng: 116.4074 }, // Beijing
    { lat: 31.2304, lng: 121.4737 }, // Shanghai
    { lat: 22.3193, lng: 114.1694 }, // Hong Kong
    { lat: 22.5431, lng: 114.0579 }, // Shenzhen
    { lat: 28.6139, lng: 77.209 },   // New Delhi
    { lat: 19.076, lng: 72.8777 },   // Mumbai
    { lat: 12.9716, lng: 77.5946 },  // Bangalore
    { lat: 1.3521, lng: 103.8198 },  // Singapore
    { lat: 3.139, lng: 101.6869 },   // Kuala Lumpur
    { lat: 13.7563, lng: 100.5018 }, // Bangkok
    { lat: 10.8231, lng: 106.6297 }, // Ho Chi Minh
    { lat: 21.0285, lng: 105.8542 }, // Hanoi
    { lat: 14.5995, lng: 120.9842 }, // Manila
    { lat: -8.65, lng: 115.2167 },   // Bali
    { lat: -6.2088, lng: 106.8456 }, // Jakarta
    { lat: 25.2048, lng: 55.2708 },  // Dubai
    { lat: 24.4539, lng: 54.3773 },  // Abu Dhabi
    { lat: 25.2854, lng: 51.531 },   // Doha
    { lat: 33.8869, lng: 35.5131 },  // Beirut
    { lat: 31.7683, lng: 35.2137 },  // Jerusalem
    { lat: 35.6892, lng: 51.389 },   // Tehran
    { lat: 27.7172, lng: 85.324 },   // Kathmandu
    { lat: 6.9271, lng: 79.8612 },   // Colombo
    { lat: 23.7104, lng: 90.4074 },  // Dhaka
    { lat: 34.5553, lng: 69.2075 },  // Kabul
    { lat: 41.2995, lng: 69.2401 },  // Tashkent
    { lat: 47.8864, lng: 106.9057 }, // Ulaanbaatar
    { lat: 33.3152, lng: 44.3661 },  // Baghdad
  ],
};

export const REGION_LABELS: Record<Region, { en: string; tr: string }> = {
  world:    { en: "World",            tr: "Dünya"         },
  europe:   { en: "Europe",           tr: "Avrupa"        },
  turkey:   { en: "Turkey",           tr: "Türkiye"       },
  americas: { en: "Americas",         tr: "Amerika"       },
  asia:     { en: "Asia & Mid-East",  tr: "Asya & Orta Doğu" },
};

export function generateLocation(region: Region): LatLng {
  return jitter(pick(CITIES[region]), 0.06);
}
