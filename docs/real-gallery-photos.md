# Real Gallery Photos & Lightbox

## Priority: 4 — Medium

## Overview
Replace the current placeholder gallery with real baby photos. Add a lightbox modal so guests can tap a photo to view it full-screen with swipe navigation.

## Requirements

### Photo Integration
- Place photos in `public/images/` directory
- Replace placeholder `<div>` elements in `GallerySection.astro` with `<img>` tags
- Use descriptive `alt` text for each photo
- Add `loading="lazy"` for performance
- Maintain the existing polaroid frame + masonry grid layout

### Image Optimization
- Use WebP format with JPEG fallback (or use Astro's `<Image>` component if available)
- Provide multiple sizes for responsive loading
- Keep images under 200KB each for mobile performance
- Suggested dimensions: 600×800 (portrait), 800×600 (landscape)

### Lightbox Modal
- Tap a photo to open full-screen overlay
- Swipe left/right to navigate between photos (touch support)
- Arrow keys for desktop navigation
- Close button (×) and tap-outside-to-close
- Photo counter: "2 / 6"
- Clay-styled close button and navigation arrows
- Smooth scale-up animation on open

### Accessibility
- Lightbox traps focus when open
- `Escape` key closes the modal
- `aria-modal="true"` on the overlay
- Screen reader announces photo caption

## Technical Notes
- Build lightbox with vanilla JS — no external library needed
- Use CSS `object-fit: cover` for consistent photo sizing in the grid
- Prevent body scroll when lightbox is open
- Consider using `<picture>` element for format fallback

## Photo Checklist
- [ ] Momen Pertama (first moment)
- [ ] Senyum Bayi (baby smile)
- [ ] Tidur Nyenyak (sleeping)
- [ ] Bersama Ayah (with dad)
- [ ] Bersama Ibu (with mom)
- [ ] Keluarga Kecil (family)
