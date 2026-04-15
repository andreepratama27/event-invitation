# WYSIWYG Content Management Editor

> Replace the plain `<textarea>` in `/manage-template` with a WYSIWYG editor for editing WhatsApp message templates.

## Context

The current `/manage-template` page uses a raw `<textarea>` to edit WhatsApp message templates stored in Supabase (`message_template` table). The template supports two placeholders: `{GUEST}` and `{GUEST_URI}`. Since WhatsApp messages are ultimately **plain text with bold markers (`*...*`)**, the editor must output WhatsApp-compatible formatting — not HTML.

### Tech Stack

- **Astro 6** (SSR via Vercel adapter, `prerender = false`)
- **Tailwind CSS v4**
- **Vanilla JS** (no React/Vue — Astro islands not currently used)
- **Supabase** for persistence via `POST /api/save-message-template`

---

## Chosen Editor: Quill.js

**Why Quill:**

- Framework-agnostic — works with vanilla `<script>` in `.astro` files
- Lightweight (~43KB gzipped)
- Clean toolbar API — easy to restrict to WhatsApp-relevant formatting only
- Large ecosystem & community
- Simple `getText()` / `getContents()` API for extracting plain text output

---

## Implementation Plan

### Phase 1 — Install & Basic Setup

1. **Install Quill**
   ```bash
   npm install quill
   ```
2. **Replace `<textarea>` with Quill container**
   - Remove `<textarea id="template-input">` from `manage-template.astro`
   - Add `<div id="editor"></div>` in its place
   - Import Quill CSS (`quill/dist/quill.snow.css`) via `<link>` or inline import

3. **Initialize Quill in `<script>`**
   ```js
   import Quill from 'quill';
   const quill = new Quill('#editor', {
     theme: 'snow',
     modules: { toolbar: [['bold'], [{ list: 'ordered' }, { list: 'bullet' }]] },
     placeholder: 'Tulis template pesan WhatsApp...',
   });
   ```

### Phase 2 — WhatsApp-Compatible Output

4. **Convert Quill delta → WhatsApp plain text on save**
   - Extract content via `quill.getContents()` (Delta format)
   - Write a `deltaToWhatsApp(delta)` converter:
     - **Bold** (`**text**` in Delta) → `*text*` (WhatsApp bold)
     - **Ordered/bullet list** → numbered lines / `• ` prefixed lines
     - **Line breaks** → `\n`
     - Strip all other formatting (italic, underline, etc.)
   - Send the converted plain text string to `POST /api/save-message-template`

5. **Load existing template into Quill on page load**
   - Parse the existing WhatsApp-formatted string (from `currentTemplate`) back into Quill Delta
   - Write a `whatsAppToDelta(text)` parser:
     - `*text*` → bold ops
     - Line breaks → newline ops
   - Call `quill.setContents(delta)` on init

### Phase 3 — Placeholder Token Support

6. **Render `{GUEST}` and `{GUEST_URI}` as styled inline tokens**
   - Option A: Use Quill's `Embed` blot to create a custom `PlaceholderBlot`
   - Option B: Keep them as plain text but style via CSS (simpler, less fragile)
   - **Recommended: Option B** — placeholders remain editable plain text; use regex-based highlighting via a Quill module or post-render DOM manipulation

7. **Add "Insert Placeholder" buttons** above the toolbar
   - `{GUEST}` button → inserts `{GUEST}` at cursor position
   - `{GUEST_URI}` button → inserts `{GUEST_URI}` at cursor position
   - Use `quill.insertText(index, '{GUEST}')` API

### Phase 4 — UI Integration

8. **Style the editor to match existing clay design**
   - Override Quill's `.ql-toolbar` and `.ql-editor` to match `.clay-white`, border colors, font, and border-radius from current styles
   - Set min-height on `.ql-editor` to `280px` (matching current textarea)
   - Ensure mobile responsiveness (editor already in `max-width: 640px` container)

9. **Wire up existing buttons**
   - **"↺ Pakai Default"** → `quill.setContents(whatsAppToDelta(defaultTemplate))`
   - **"💾 Simpan Template"** → `deltaToWhatsApp(quill.getContents())` → POST to API
   - **Status messages** — keep existing `showStatus()` logic unchanged

10. **Update the preview section**
    - Live preview: update `<pre>` inside `<details>` on every `quill.on('text-change', ...)` event
    - Show the WhatsApp-formatted plain text output (result of `deltaToWhatsApp`)

### Phase 5 — Edge Cases & Polish

11. **Restrict toolbar to WhatsApp-supported formatting only**
    - Allow: **bold** only (WhatsApp also supports italic/strikethrough, but keep it minimal for now)
    - Disable: headings, links, images, colors, alignment
    - Remove paste formatting via `clipboard` module matcher to strip unsupported styles

12. **Handle empty editor**
    - Disable save button when editor is empty
    - Show validation message if user tries to save empty content

13. **Accessibility**
    - Add `aria-label` to the editor container
    - Ensure keyboard navigation works for toolbar buttons and placeholder insert buttons

---

## Files to Modify

| File | Changes |
|---|---|
| `package.json` | Add `quill` dependency |
| `src/pages/manage-template.astro` | Replace textarea with Quill editor, update `<script>` and `<style>` |

## New Files (if needed)

| File | Purpose |
|---|---|
| `src/utils/whatsapp-delta.ts` | `deltaToWhatsApp()` and `whatsAppToDelta()` converters |

## Out of Scope

- Rich media (images, videos) in templates
- Multi-template management (tabs, versioning)
- Collaborative editing
- Markdown output — we specifically target WhatsApp plain text format

---

## Acceptance Criteria

- [ ] Editor loads with current template from Supabase, rendered with bold formatting
- [ ] Toolbar shows only **bold** and **list** buttons
- [ ] `{GUEST}` / `{GUEST_URI}` can be inserted via dedicated buttons
- [ ] Save outputs WhatsApp-compatible plain text (`*bold*` syntax) to the API
- [ ] "Pakai Default" resets editor to default template
- [ ] Live preview shows WhatsApp-formatted output
- [ ] Mobile-friendly and matches existing clay design
- [ ] No regressions to existing save/load flow
