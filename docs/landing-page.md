# Landing Page — Emir Ayden Mateen

## Overview
Halaman undangan akikah untuk Emir Ayden Mateen. Dibangun dengan Astro 6.0.8.

**Style:** Game Mode UI + Claymorphism — cheerful, tactile, 3D-inflated, playground-like.

---

## Event Details
- **Nama Bayi:** Emir Ayden Mateen
- **Acara:** Akikah
- **Tanggal:** Sabtu, 4 April 2026
- **Lokasi:** Mateen's House, Gg. Sentosa Dusun III Desa Sidodadi, Batang Kuis
- **Orang Tua:** Andre Pratama & Syaras Saryang Putri
- **Google Maps:** https://maps.app.goo.gl/d8CPAtcpJnVjhvtFA

## Makna Nama
| Kata | Arab | Makna |
|------|------|-------|
| Emir | أمير | Pangeran / Pemimpin |
| Ayden | آيدن | Api Kecil |
| Mateen | متين | Kuat / Kokoh |

---

## Design System

### Font
- **Fredoka** (Google Fonts) — rounded, bubbly

### Palette (Clay)
| Token | Hex | Dark Variant | Light Variant |
|-------|-----|-------------|---------------|
| Green | `#5BBF3E` | `#3E8A28` | `#7FD460` |
| Yellow | `#FFD447` | `#CCA000` | `#FFE580` |
| Coral | `#FF6B6B` | `#CC4A4A` | `#FF9494` |
| Blue | `#4BBEF5` | `#2A8FCC` | `#7AD4FF` |
| Purple | `#C97BFF` | `#9A50D4` | `#DFA8FF` |
| Background | `#F0EBE3` | — | — |

### Clay Shadow Formula
```css
box-shadow:
  0 10px 0 <color-dark>,
  0 16px 28px rgba(0, 0, 0, 0.18),
  inset 0 -5px 10px rgba(0,0,0,0.10),
  inset 0 5px 12px rgba(255,255,255,0.55);
```

### Clay Button Press (`:active`)
```css
transform: translateY(6px);
box-shadow:
  0 4px 0 <color-dark>,
  0 6px 12px rgba(0,0,0,0.15),
  inset 0 -3px 6px rgba(0,0,0,0.10),
  inset 0 3px 8px rgba(255,255,255,0.45);
```

---

## File Structure
```
src/
├── pages/index.astro
├── styles/global.css
└── components/
    ├── HeroSection.astro
    ├── InvitationSection.astro
    ├── NameMeanings.astro
    ├── GallerySection.astro
    ├── DirectionSection.astro
    └── GuestbookSection.astro
```

---

## Sections

### 1. HeroSection
- Background: radial gradient green clay
- 20 confetti particles (hardcoded in frontmatter)
- Level tag: "LEVEL 1 · SELAMAT DATANG"
- Big `<h1>`: "Emir Ayden Mateen"
- Decorative XP bar (animates 0→75% on load)
- Parents line
- Countdown timer to 2026-04-04T00:00:00+07:00
- Bouncing scroll arrow

### 2. InvitationSection
- Label: "QUEST · UNDANGAN AKIKAH"
- Yellow clay card with detail rows (📅 📍 🏠)
- CTA button to maps URL

### 3. NameMeanings
- Label: "ACHIEVEMENT · MAKNA NAMA"
- 3 clay achievement cards (blue/coral/green)
- Arabic text with `lang="ar" dir="rtl"`
- Hover: wiggle animation

### 4. GallerySection
- Label: "ALBUM · FOTO EMIR"
- Polaroid-style placeholder grid (CSS Grid)
- Shimmer animation on placeholders
- Mixed aspect ratios via grid-span

### 5. DirectionSection
- Label: "MAP QUEST · LOKASI"
- Blue clay card with embedded Google Maps iframe (responsive 16:9)
- Address block
- "🗺️ Buka Google Maps" CTA

### 6. GuestbookSection
- Label: "LEADERBOARD · UCAPAN"
- Purple clay card with form (name + message)
- Client-side submit → show thank-you state

---

## Scripts
- **Countdown:** `setInterval` every 1s, target date `2026-04-04T00:00:00+07:00`
- **Scroll Reveal:** `IntersectionObserver` adds `.visible` class on elements with `.animate-on-scroll`
- **Guestbook:** `e.preventDefault()` → toggle form/success visibility

## To Update Gallery
Replace placeholder `<div>` elements in `GallerySection.astro` with real `<img>` tags pointing to `/images/baby*.jpg` files placed in the `public/images/` folder.
