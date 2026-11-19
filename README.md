# Ammu & Ajith — Wedding Invitation Website

A high-performance, handcrafted Angular wedding invitation featuring an unrolling royal parchment scroll with authentic Malayalam and English handwriting calligraphy on a deep dark maroon and golden glow backdrop.

Built from scratch with **Angular 19**, standalone components, signals, and pure SCSS/TypeScript. Zero UI libraries, zero Three.js, zero animation libraries.

---

## Features

- **Parchment Scroll Unroll Animation (~8s Sequence)**:
  - **Step 0 (Loader)**: Centered loader, preloading `rolled.webp`, background-loading `rod.webp` and `paper.webp`.
  - **Step 1 (0 to 1.5s)**: Rolled scroll appears, gentle floating bob and subtle scale entrance.
  - **Step 2 (~1.5s)**: Seamless cross-fade from rolled scroll into stacked rod copies.
  - **Step 3 (2s to 5s)**: The scroll unrolls with `cubic-bezier(0.65, 0, 0.35, 1)` easing, rods separating upward and downward while parchment reveals with `clip-path` inset and realistic curl gradients.
  - **Step 4 (5s to 7s)**: Handwritten text reveals line-by-line from left to right using `clip-path` for an authentic ink calligraphy feel.
  - **Step 5 (7s to 8s)**: Smooth camera movement zooming into the scroll, followed by unlocking vertical scrolling.
  - **Skip Button**: Accessible button to jump immediately to the final state.
- **Precision Sizing & Container Queries**:
  - The wooden rod shaft between collars is 55% of rod width. Parchment width strictly equals shaft width (`paper = 0.55 × rod`).
  - Container queries (`container-type: inline-size` and `cqw`) ensure text scales smoothly across all viewports from 320px mobile to 4K desktop with zero overflow.
- **3D-Feel Extras**:
  - **3D Falling Petals**: Marigold orange, jasmine white, and soft rose petals fluttering in 3D (`translate3d`, `rotateX/Y/Z`) layered both behind and in front of the scroll (10 on desktop, 5 on mobile).
  - **Desktop Parallax Tilt**: Interactive subtle tilt (up to ±3°) following mouse movements with CSS 3D perspective.
  - **Mobile Subtle Sway**: Gentle ambient idle swaying on mobile devices.
- **Self-Hosted Handwriting Fonts**:
  - English: `@fontsource/caveat` (Latin 500 & 700)
  - Malayalam: `@fontsource/chilanka` (Malayalam & Latin 400)
  - Zero Google CDN network requests at runtime; bundled as `.woff2` with `font-display: swap`.
- **Event Details & Interactive Countdown**:
  - Real-time countdown updating every second to the wedding date.
  - "View location" Google Maps button (auto-hidden if URL is empty).
  - "WhatsApp RSVP" button (auto-hidden if URL is empty).
  - Viewport entry animation powered by `IntersectionObserver`.
- **Network & Accessibility Adaptations**:
  - Auto-skips animations for slow connections (2G, 3G, Data Saver) and `prefers-reduced-motion`.
  - Safe fallbacks for browsers without `navigator.connection` (Safari).

---

## Configuration

All custom URLs, date, and settings are managed in a single file: `src/app/invite.config.ts`.

```typescript
export const INVITE_CONFIG = {
  // Google Maps URL (set to '' to hide the button)
  mapsUrl: 'https://maps.google.com/?q=St+Pauls+Auditorium+Puthoor+Kottarakkara',

  // WhatsApp RSVP link (set to '' to hide the button)
  whatsappRsvpUrl: 'https://wa.me/?text=Congratulations%20Ammu%20and%20Ajith!%20Delighted%20to%20attend.',

  // Audio flag (keep false to avoid any audio code)
  musicEnabled: false,

  // Wedding Date & Time in ISO format
  weddingDateISO: '2027-04-04T10:15:00+05:30',
};
```

### Changing the Invitation Text
To modify the wording or Malayalam text on the parchment, edit `src/app/components/invitation-paper/invitation-paper.component.ts`.

---

## How to Run

### Development Server
```bash
npm start
# or: ng serve --port 4200
```
Open your browser and navigate to: `http://localhost:4200`

### Production Build
```bash
npm run build
```
The optimized production files will be built to `dist/wedding-app/browser/`.

### Bundle Size Report
- **Initial Total**: ~185.02 kB (Raw) / **~54.13 kB (Compressed transfer size)**
- **Polyfills**: ~34.59 kB (Raw) / ~11.33 kB (Compressed)
- **Styles**: ~1.28 kB (Raw) / ~386 bytes (Compressed)
- **Images**:
  - `paper.webp`: 26.1 kB
  - `rod.webp`: 14.1 kB
  - `rolled.webp`: 16.3 kB
