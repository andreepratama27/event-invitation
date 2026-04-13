import { event } from './event';

export function getDefaultMessageTemplate(): string {
  const { baby, type: eventType, dateLabel, timeLabel, venue, site } = event;

  return `Assalamu'alaikum 🌙

Kepada Bapak/Ibu *{GUEST}*,

Kami mengundang untuk hadir dalam acara ${eventType} putra kami:
✨ *${baby.fullName}* ✨

📅 ${dateLabel}
🕙 ${timeLabel}
📍 ${venue.name}, ${venue.address.split(',').pop()?.trim() ?? venue.address}

Buka undangan: ${site.url}?to={GUEST_URI}

Terima kasih 🤲`;
}

/**
 * Editable WhatsApp template used by /manage-invitation.
 * Available placeholders:
 * - {GUEST}: guest name as-is
 * - {GUEST_URI}: URL-encoded guest name for query param
 */
export const messageTemplate = "Kepada Yth.\n{GUEST}\n\nAssalamualaikum Wr. Wb.\n\nDengan memohon Rahmat dan Ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara Tasyakuran Aqiqah putra kami:\n\n✨ Emir Ayden Mateen ✨\n\nInsya Allah acara akan dilaksanakan pada:\n\nHari & Tanggal: Sabtu, 18 April 2026\nWaktu: 11.00 WIB s/d Selesai\nTempat: Gg. Sentosa Dusun III, Desa Sidodadi Batang Jambu, Kec. Batang Kuis\n\nUntuk informasi lebih detail mengenai acara dan denah lokasi, silakan kunjungi tautan undangan digital berikut:\n🔗 https://aqiqah-mateen.vercel.app/?to={GUEST_URI}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu. Atas kehadiran dan perhatiannya, kami ucapkan terima kasih.\n\nWassalamualaikum Wr. Wb.\n\nKami yang berbahagia,\nAndre Pratama & Syaras Saryang Putri";

export function getWhatsAppMessageTemplate(): string {
  return messageTemplate.trim() || getDefaultMessageTemplate();
}
