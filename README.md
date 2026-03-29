# 🎉 Emir Invitation — Child Birthday / Akikah Invitation

A mobile-first, accessible landing page invitation for a child's celebration event (Akikah, birthday, etc.), built with **Astro**, **Tailwind CSS v4**, and a playful **Clay UI** design system.

> Live demo: [emir-invitation.vercel.app](https://emir-invitation.vercel.app)

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **Opening Gate** | Full-screen overlay with guest name personalization via `?to=` query param |
| **Hero Section** | Event headline with countdown timer and XP progress bar |
| **Invitation Section** | Event date, time, venue, and dress code details |
| **Name Meanings** | Baby name meanings display |
| **Gallery** | Photo gallery section |
| **Directions** | Venue map with embedded Google Maps and navigation link |
| **Guestbook** | Guest message form with animated success state |
| **Background Music** | Auto-plays on gate open (respects browser autoplay policies) |
| **Scroll Reveal** | Intersection Observer–powered entrance animations |
| **A11y** | `prefers-reduced-motion` support, ARIA labels, semantic HTML |
| **SEO / OG Tags** | Full Open Graph + Twitter Card meta for rich link previews on WhatsApp, iMessage, etc. |

---

## 🚀 Quick Start

```sh
# 1. Clone the repo
git clone https://github.com/<your-username>/emir-invitation.git
cd emir-invitation

# 2. Install dependencies (Node ≥ 22.12)
npm install

# 3. Start dev server
npm run dev          # → http://localhost:4321
```

---

## ⚙️ Setting Up Event Details

All event content is configured in a **single file**:

```
src/config/event.ts
```

Edit this file to customise the invitation for your event. The config is split into these sections:

### 👶 Baby

```ts
baby: {
  firstName:  'Emir',
  middleName: 'Ayden',
  lastName:   'Mateen',
  birthDate:  '2026-03-15',   // ISO date (YYYY-MM-DD)
},
```

### 👨‍👩‍👦 Parents

```ts
parents: {
  father: 'Andre Pratama',
  mother: 'Syaras Saryang Putri',
},
```

### 📅 Event

```ts
type:      'Akikah',                // Event type: 'Akikah', 'Ulang Tahun', 'Syukuran', etc.
dateISO:   '2026-04-18',            // YYYY-MM-DD
timeLabel: '10.00 WIB – Selesai',
timezone:  '+07:00',
dateLabel: 'Sabtu, 18 April 2026',  // Human-readable date
```

### 📍 Venue

```ts
venue: {
  name:     "Mateen's House",
  address:  'Gg. Sentosa Dusun III Desa Sidodadi, Batang Kuis',
  mapsUrl:  'https://maps.app.goo.gl/...',       // Google Maps short link (for "Open in Maps" button)
  embedUrl: 'https://maps.google.com/maps?q=...', // Google Maps embed URL (for inline map)
},
```

### 📞 Contact / RSVP

```ts
contact: {
  whatsapp: '6285156847850',   // WhatsApp number with country code (leave empty to hide RSVP button)
  name:     'Andre Pratama',
},
```

### 👔 Dress Code

```ts
dresscode: 'Busana Muslim / Sopan',  // leave empty to hide
```

### 🌐 Site / SEO

```ts
site: {
  url:         'https://emir-invitation.vercel.app',
  ogImagePath: '/og-image.svg',
  locale:      'id_ID',
  lang:        'id',
},
```

OG title, description, and image URL are auto-generated from the config above.

---

## 🔐 Guest Name Authentication (Personalization)

Guest names are passed via the `?to=` query parameter in the invitation URL. When a guest opens the link, the **Opening Gate** overlay displays their name.

### How it works

1. Share a personalized link to each guest:
   ```
   https://emir-invitation.vercel.app/?to=Budi%20Santoso
   ```

2. The `OpeningGate` component reads the `to` param and displays it:
   ```
   Kepada Yth.
   Budi Santoso
   ```

3. If no `?to=` param is provided, the fallback text **"Tamu Undangan"** (Dear Guest) is shown.

### Generating invite links

Simply URL-encode the guest name and append it:

| Guest Name | Invitation URL |
| :--- | :--- |
| Budi Santoso | `https://your-domain.com/?to=Budi%20Santoso` |
| Ibu Sari | `https://your-domain.com/?to=Ibu%20Sari` |
| Keluarga Besar Pak RT | `https://your-domain.com/?to=Keluarga%20Besar%20Pak%20RT` |

> **Note:** There is no server-side authentication or login — the `?to=` param is purely for display personalisation on the opening gate.

---

## 🎨 Design System

- **Heading Font:** [Fredoka](https://fonts.google.com/specimen/Fredoka) — Playful, rounded terminals
- **Body Font:** [Lexend](https://fonts.google.com/specimen/Lexend) — Engineered for reading proficiency
- **UI Style:** Clay UI — 3D inflated buttons and cards with soft shadows
- **Color Palette:** Ocean-inspired (teal, cyan, amber, coral, navy)

---

## 🗂️ Project Structure

```
├── public/                  # Static assets (favicon, OG image, music)
├── src/
│   ├── components/
│   │   ├── OpeningGate.astro       # Full-screen gate with guest name
│   │   ├── HeroSection.astro       # Hero with countdown & XP bar
│   │   ├── InvitationSection.astro # Date, time, venue details
│   │   ├── NameMeanings.astro      # Baby name meanings
│   │   ├── GallerySection.astro    # Photo gallery
│   │   ├── DirectionSection.astro  # Map & directions
│   │   └── GuestbookSection.astro  # Guest message form
│   ├── config/
│   │   └── event.ts                # ⭐ All event configuration
│   ├── pages/
│   │   └── index.astro             # Single landing page
│   └── styles/
│       └── global.css              # CSS variables, clay utilities, animations
├── docs/                    # Design & feature documentation
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🧞 Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

---

## 🚢 Deployment

The project uses `@astrojs/node` adapter in standalone mode. Deploy to any Node.js hosting:

- **Vercel** — works out of the box
- **Railway / Render / Fly.io** — run `npm run build && node dist/server/entry.mjs`

---

## 📄 License

MIT
