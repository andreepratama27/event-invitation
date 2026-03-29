# RSVP / Attendance Confirmation

## Priority: 3 — Medium

## Overview
Add attendance confirmation (Hadir / Tidak Hadir) to the existing guestbook form so the hosts can estimate headcount. Optionally submit data to an external service (Google Sheets, Google Forms, or a serverless endpoint).

## Requirements

### Form Enhancement
- Add a radio group to the existing guestbook form:
  - ✅ Hadir (Will Attend)
  - ❌ Tidak Hadir (Won't Attend)
  - 🤔 Masih Ragu (Maybe)
- Add an optional "Jumlah Tamu" (number of guests) field, shown only when "Hadir" is selected
- Keep the existing name + message fields

### UI
- Radio buttons styled as clay pill toggles (not default browser radios)
- Selected state uses the green clay style
- Number input with +/- stepper buttons (clay style)
- Integrate seamlessly into the existing purple GuestbookSection card

### Data Submission (Optional)
- **Option A:** Google Forms — submit via hidden `<iframe>` POST
- **Option B:** Google Sheets API — submit via `fetch()` to a Google Apps Script web app
- **Option C:** Keep client-side only (current behavior) as MVP

### Accessibility
- Proper `<fieldset>` + `<legend>` for the radio group
- Labels associated with inputs
- Keyboard navigable radio options

## Technical Notes
- Enhance `GuestbookSection.astro` — don't create a separate component
- If using Google Sheets, create a Google Apps Script `doPost()` endpoint
- Consider adding a loading spinner on submit if using a remote endpoint
