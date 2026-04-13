import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const prerender = false;

function generateMessageTemplateTS(template: string): string {
  const templateLiteral = JSON.stringify(template);

  return `import { event } from './event';

export function getDefaultMessageTemplate(): string {
  const { baby, type: eventType, dateLabel, timeLabel, venue, site } = event;

  return \`Assalamu'alaikum 🌙

Kepada Bapak/Ibu *{GUEST}*,

Kami mengundang untuk hadir dalam acara \${eventType} putra kami:
✨ *\${baby.fullName}* ✨

📅 \${dateLabel}
🕙 \${timeLabel}
📍 \${venue.name}, \${venue.address.split(',').pop()?.trim() ?? venue.address}

Buka undangan: \${site.url}?to={GUEST_URI}

Terima kasih 🤲\`;
}

/**
 * Editable WhatsApp template used by /manage-invitation.
 * Available placeholders:
 * - {GUEST}: guest name as-is
 * - {GUEST_URI}: URL-encoded guest name for query param
 */
export const messageTemplate = ${templateLiteral};

export function getWhatsAppMessageTemplate(): string {
  return messageTemplate.trim() || getDefaultMessageTemplate();
}
`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as { template?: unknown };
    const template = typeof body.template === 'string' ? body.template : '';

    const content = generateMessageTemplateTS(template);

    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const targetPath = path.resolve(currentDir, '../../config/message-template.ts');

    await writeFile(targetPath, content, 'utf-8');

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
