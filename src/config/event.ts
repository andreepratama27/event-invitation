// ============================================================
// Event Configuration
// All content, dates, and URLs for the invitation site live here.
// ============================================================

export const event = {
  // ── Baby ────────────────────────────────────────────────
  baby: {
    firstName: 'Emir',
    middleName: 'Ayden',
    lastName: 'Mateen',
    /** Full name shorthand */
    get fullName() {
      return `${this.firstName} ${this.middleName} ${this.lastName}`;
    },
    birthDate: '2026-03-15', // ISO date (YYYY-MM-DD)
  },

  // ── Parents ─────────────────────────────────────────────
  parents: {
    father: 'Andre Pratama',
    mother: 'Syaras Saryang Putri',
    get names() {
      return `${this.father} & ${this.mother}`;
    },
  },

  // ── Event ───────────────────────────────────────────────
  type: 'Aqiqah',           // e.g. Aqiqah, Ulang Tahun, Syukuran
  dateISO: '2026-04-18',       // YYYY-MM-DD
  timeLabel: '11.00 WIB – Selesai',
  timezone: '+07:00',
  /** Full ISO datetime string for countdown / XP bar scripts */
  get datetimeISO() {
    return `${this.dateISO}T00:00:00${this.timezone}`;
  },
  /** Human-readable date label */
  dateLabel: 'Sabtu, 18 April 2026',

  // ── Venue ───────────────────────────────────────────────
  venue: {
    name: "Mateen's House",
    address: 'Gg. Sentosa Dusun III Desa Sidodadi, Batang Kuis',
    mapsUrl: 'https://maps.app.goo.gl/d8CPAtcpJnVjhvtFA',
    embedUrl: 'https://maps.google.com/maps?q=Gg.+Sentosa+Dusun+III+Sidodadi+Batang+Kuis&output=embed&hl=id&z=16',
  },

  // ── RSVP / Contact ──────────────────────────────────────
  contact: {
    whatsapp: '6285156847850', // e.g. '628123456789' — leave empty to hide RSVP button
    name: 'Andre Pratama', // contact person name
  },

  // ── Dress Code ──────────────────────────────────────────
  dresscode: 'Busana Muslim / Sopan', // leave empty to hide

  // ── Site / SEO ──────────────────────────────────────────
  site: {
    url: 'https://aqiqah-mateen.vercel.app',
    ogImagePath: '/og-image.svg',
    locale: 'id_ID',
    lang: 'id',
    get ogTitle() {
      return `Undangan ${event.type} · ${event.baby.fullName}`;
    },
    get ogDescription() {
      return `Bismillah, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam syukuran ${event.type} putra kami. ${event.dateLabel} · ${event.timeLabel} di ${event.venue.address.split(',')[1]?.trim() ?? event.venue.address}.`;
    },
    get ogImage() {
      return `${this.url}${this.ogImagePath}`;
    },
  },
};
