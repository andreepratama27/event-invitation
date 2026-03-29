# Share Button (WhatsApp / Copy Link)

## Priority: 5 — Medium

## Overview
A floating or inline share button that lets guests easily forward the invitation link to others via WhatsApp or copy it to clipboard. Essential for mobile distribution since invitations are typically shared via chat.

## Requirements

### Share Options
1. **WhatsApp Share** — opens WhatsApp with a pre-filled message containing the invitation link
2. **Copy Link** — copies the current URL to clipboard with a toast confirmation
3. **Native Share** (optional) — use `navigator.share()` on supported devices

### UI Options

#### Option A: Floating Action Button (FAB)
- Fixed position (bottom-left corner, opposite the music toggle)
- Clay-styled circular button with 📤 icon
- Tap to expand a small menu with WhatsApp + Copy options

#### Option B: Inline in Footer
- Place share buttons after the guestbook section, before the closing blessing
- Two clay pill buttons side by side

### WhatsApp Message Template
```
Assalamu'alaikum 🌙

Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara Akikah putra kami:

✨ *Emir Ayden Mateen* ✨

📅 Sabtu, 4 April 2026
📍 Mateen's House, Batang Kuis

Buka undangan: {URL}

Terima kasih 🤲
```

### Copy Link Behavior
- Copy current URL (including `?to=` param if present)
- Show a clay-styled toast: "✅ Link berhasil disalin!"
- Toast auto-dismisses after 2 seconds

### Accessibility
- Buttons have descriptive `aria-label`
- Toast is announced via `aria-live="polite"`

## Technical Notes
- WhatsApp deep link: `https://wa.me/?text={encodedMessage}`
- Copy: `navigator.clipboard.writeText(url)`
- Native share: `navigator.share({ title, text, url })`
- Check `navigator.share` support and show native share on mobile, fallback to manual options on desktop
