# Opening Gate / Cover Screen

## Priority: 1 — High

## Overview
A full-screen splash/cover that appears before the main invitation content. Guests tap "Buka Undangan" to reveal the page with a smooth animation. The guest's name is personalized via a `?to=` query parameter in the URL.

## Requirements

### Query Parameter Personalization
- Read `?to=NamaTamu` from the URL
- Display the guest name on the cover: "Kepada Yth. **Nama Tamu**"
- Fallback to "Tamu Undangan" if no param is provided

### Cover UI
- Full-screen overlay (`100vh`, `z-index: 999`)
- Clay-styled card centered on screen
- Baby name "Emir Ayden Mateen" displayed prominently
- Event label: "Undangan Akikah"
- Decorative elements (stars, confetti, or floating emojis)
- "🎉 Buka Undangan" clay button

### Open Animation
- On button tap:
  - Cover slides up / fades out
  - Main content fades in
  - Background music starts (if music feature is implemented)
  - Body scroll is unlocked (`overflow: hidden` → `auto`)

### Accessibility
- Cover button is focusable and keyboard-accessible
- `aria-label` on the open button
- Respect `prefers-reduced-motion`

## Technical Notes
- Read query param with `new URLSearchParams(window.location.search).get('to')`
- Use CSS transitions for the reveal animation
- Prevent body scroll while cover is visible
- No framework needed — vanilla JS in a `<script>` tag

## Example URL
```
https://emir-invitation.vercel.app/?to=Bapak%20Budi
```
