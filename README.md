# GeoSeeker

A next-generation interactive map experience built with modern web technologies. GeoSeeker provides a premium, responsive, and immersive interface for exploring global locations. 

The application has been completely reimagined to deliver desktop-class aesthetics, fluid animations, and a polished user experience.

## Features

- **Apple-grade Design:** Carefully crafted components with a focus on dark mode, typography (Inter & JetBrains Mono), and glassmorphic overlays.
- **Fluid Animations:** Powered by Motion for seamless transitions, micro-interactions, and a dynamic hero section.
- **Advanced Map Integration:** Custom dark/light map rendering using the latest visual styles with `@vis.gl/react-google-maps`.
- **Responsive Architecture:** Native-feeling experience across mobile, tablet, and desktop viewports.
- **Adaptive UI:** A contextual sidebar designed to house geospatial data, AI integration points, and high-fidelity mock interfaces.

## Technology Stack

- React 19
- Vite
- Tailwind CSS 4
- Motion (Framer Motion)
- Lucide Icons
- @vis.gl/react-google-maps

## Development

Clone the repository, install dependencies, configure your environment variables, and start the development server:

```bash
npm install
npm run dev
```

Ensure your `.env` contains the required map credentials:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Structure

- `src/components/LandingPage.tsx`: The immersive entry point for the application.
- `src/components/MapSection.tsx`: The core spatial interaction interface.
- `src/components/ThemeProvider.tsx`: A robust context for managing application-wide themes.
- `src/index.css`: Tailwind configuration and custom utility classes enforcing the overarching design system.
