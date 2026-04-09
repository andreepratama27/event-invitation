import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const prerender = false;

function escapeStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function generateEventTS(d: Record<string, string>): string {
  return `// ============================================================
// Event Configuration
// All content, dates, and URLs for the invitation site live here.
// ============================================================

export const event = {
  // ── Baby ────────────────────────────────────────────────
  baby: {
    firstName:  '${escapeStr(d['baby.firstName'] ?? '')}',
    middleName: '${escapeStr(d['baby.middleName'] ?? '')}',
    lastName:   '${escapeStr(d['baby.lastName'] ?? '')}',
    /** Full name shorthand */
    get fullName() {
      return \`\${this.firstName} \${this.middleName} \${this.lastName}\`;
    },
    birthDate: '${escapeStr(d['baby.birthDate'] ?? '')}', // ISO date (YYYY-MM-DD)
  },

  // ── Parents ─────────────────────────────────────────────
  parents: {
    father: '${escapeStr(d['parents.father'] ?? '')}',
    mother: '${escapeStr(d['parents.mother'] ?? '')}',
    get names() {
      return \`\${this.father} & \${this.mother}\`;
    },
  },

  // ── Event ───────────────────────────────────────────────
  type:        '${escapeStr(d['type'] ?? '')}',           // e.g. Aqiqah, Ulang Tahun, Syukuran
  dateISO:     '${escapeStr(d['dateISO'] ?? '')}',       // YYYY-MM-DD
  timeLabel:   '${escapeStr(d['timeLabel'] ?? '')}',
  timezone:    '${escapeStr(d['timezone'] ?? '')}',
  /** Full ISO datetime string for countdown / XP bar scripts */
  get datetimeISO() {
    return \`\${this.dateISO}T00:00:00\${this.timezone}\`;
  },
  /** Human-readable date label */
  dateLabel:   '${escapeStr(d['dateLabel'] ?? '')}',

  // ── Venue ───────────────────────────────────────────────
  venue: {
    name:     '${escapeStr(d['venue.name'] ?? '')}',
    address:  '${escapeStr(d['venue.address'] ?? '')}',
    mapsUrl:  '${escapeStr(d['venue.mapsUrl'] ?? '')}',
    embedUrl: '${escapeStr(d['venue.embedUrl'] ?? '')}',
  },

// ── RSVP / Contact ──────────────────────────────────────
  contact: {
    whatsapp: '${escapeStr(d['contact.whatsapp'] ?? '')}', // e.g. '628123456789' — leave empty to hide RSVP button
    name:     '${escapeStr(d['contact.name'] ?? '')}', // contact person name
  },

  // ── Dress Code ──────────────────────────────────────────
  dresscode: '${escapeStr(d['dresscode'] ?? '')}', // leave empty to hide

  // ── Site / SEO ──────────────────────────────────────────
  site: {
    url:         '${escapeStr(d['site.url'] ?? '')}',
    ogImagePath: '${escapeStr(d['site.ogImagePath'] ?? '')}',
    locale:      '${escapeStr(d['site.locale'] ?? '')}',
    lang:        '${escapeStr(d['site.lang'] ?? '')}',
    get ogTitle() {
      return \`Undangan \${event.type} · \${event.baby.fullName}\`;
    },
    get ogDescription() {
      return \`Bismillah, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam syukuran \${event.type} putra kami. \${event.dateLabel} · \${event.timeLabel} di \${event.venue.address.split(',')[1]?.trim() ?? event.venue.address}.\`;
    },
    get ogImage() {
      return \`\${this.url}\${this.ogImagePath}\`;
    },
  },
};
`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json() as Record<string, string>;
    const content = generateEventTS(data);

    // Resolve path to src/config/event.ts
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const eventFilePath = path.resolve(currentDir, '../../config/event.ts');

    await writeFile(eventFilePath, content, 'utf-8');

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
