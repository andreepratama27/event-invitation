# Add Lexend Font for Body Text

## Priority: 6 — Low (Quick Fix)

## Overview
The project spec requires **Lexend** as the body font (engineered for reading proficiency) and **Fredoka** as the heading font. Currently only Fredoka is imported and used for everything. This task adds Lexend and applies the proper font pairing.

## Requirements

### Font Import
- Add Lexend from Google Fonts in `global.css`:
  ```
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap');
  ```

### CSS Variables
- Add a new variable: `--font-body: 'Lexend', sans-serif`
- Keep existing: `--font-main: 'Fredoka', 'Nunito', sans-serif` (rename to `--font-heading` for clarity)

### Application Rules
- **Fredoka** (`--font-heading`): `h1`, `h2`, `h3`, `.baby-name`, `.name-word`, button text, labels, badges
- **Lexend** (`--font-body`): `body`, `p`, `span`, form inputs, detail values, descriptions

### Files to Update
- `src/styles/global.css` — import font, add variable, update `body` font-family
- Component files — update any hardcoded `font-family` references to use the correct variable

## Technical Notes
- Only import weights actually used (400, 500, 600) to minimize load
- Test readability on mobile — Lexend is designed for comfortable reading at small sizes
- Ensure form inputs inherit the body font
