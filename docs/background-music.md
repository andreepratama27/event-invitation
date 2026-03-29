# Background Music Toggle

## Priority: 2 — High

## Overview
Play a soft background nasheed or lullaby when the invitation is opened. A floating mute/unmute button stays visible at all times so guests can control audio.

## Requirements

### Audio Playback
- Audio starts playing when the guest taps "Buka Undangan" on the opening gate
- Audio loops continuously
- Volume set to a comfortable level (~0.3–0.5)
- File format: MP3 (placed in `public/audio/`)

### Floating Toggle Button
- Fixed position (bottom-right corner)
- Clay-styled circular button
- Shows 🔊 when playing, 🔇 when muted
- Subtle pulse animation when music is playing
- `z-index` above all content but below modals

### Behavior
- Default state: playing (triggered by user interaction on cover)
- Tap toggles between play/pause
- Remember state during the session (no persistence needed)

### Accessibility
- `aria-label="Toggle background music"`
- Button is keyboard-focusable
- Respect `prefers-reduced-motion` for the pulse animation

## Technical Notes
- Use `HTMLAudioElement` API
- Audio autoplay requires user gesture — tie to the opening gate button click
- Keep audio file small (<2MB) for mobile performance
- Place file at `public/audio/background.mp3`

## Suggested Audio
- Soft Islamic nasheed (instrumental)
- Baby lullaby
- Calming nature sounds
