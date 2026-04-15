import type { Delta } from "quill/core";

// ─── Delta → WhatsApp plain text ────────────────────────────────────────────

export function deltaToWhatsApp(delta: Delta): string {
  if (!delta || !delta.ops) return "";

  const lines: string[] = [];
  let currentLine = "";
  let listIndex = 1;

  delta.ops.forEach((op) => {
    if (typeof op.insert !== "string") return;

    const text = op.insert;
    const attrs = op.attributes ?? {};

    // ── Newline op (carries block-level formatting) ──
    if (text === "\n") {
      if (attrs.list === "ordered") {
        currentLine = `${listIndex}. ${currentLine}`;
        listIndex++;
        lines.push(currentLine);
      } else if (attrs.list === "bullet") {
        currentLine = `• ${currentLine}`;
        lines.push(currentLine);
      } else if (attrs.blockquote) {
        currentLine = `> ${currentLine}`;
        lines.push(currentLine);
        listIndex = 1;
      } else if (attrs["code-block"]) {
        // Wrap the accumulated code line in triple backticks
        currentLine = `\`\`\`${currentLine}\`\`\``;
        lines.push(currentLine);
        listIndex = 1;
      } else {
        lines.push(currentLine);
        listIndex = 1;
      }

      // Reset list counter when leaving a list context
      if (!attrs.list) listIndex = 1;
      currentLine = "";
      return;
    }

    // ── Inline text (may carry inline formatting) ──
    let segment = text;

    // Apply formats in WhatsApp order: bold, italic, strike, code
    // Note: Quill can stack multiple inline attrs simultaneously
    if (attrs.code) {
      // Inline code → monospace ` ``` ` wrapping happens per-segment
      segment = `\`\`\`${segment}\`\`\``;
    } else {
      // Apply in reverse nesting order so *_~text~_* reads correctly
      if (attrs.strike) segment = `~${segment}~`;
      if (attrs.italic) segment = `_${segment}_`;
      if (attrs.bold) segment = `*${segment}*`;
    }

    currentLine += segment;
  });

  // Flush any trailing text that has no trailing newline op
  if (currentLine) lines.push(currentLine);

  let result = lines.join("\n");

  // Quill always appends a trailing "\n"; strip the empty last line it creates
  if (result.endsWith("\n")) result = result.slice(0, -1);

  return result;
}

// ─── WhatsApp plain text → Delta ────────────────────────────────────────────

type Op = { insert: string; attributes?: Record<string, unknown> };

/** Parse a single line's inline WhatsApp markers into Quill ops. */
function parseInline(content: string): Op[] {
  const ops: Op[] = [];

  // Combined regex that captures bold (*), italic (_), strike (~), monospace (```)
  // We process them sequentially with a simple tokeniser.
  const TOKEN_RE =
    /(\*([^*]+)\*)|(_([^_]+)_)|(~([^~]+)~)|(`{3}([\s\S]+?)`{3})/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_RE.exec(content)) !== null) {
    // Plain text before this match
    if (match.index > lastIndex) {
      ops.push({ insert: content.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      // Bold: *text*
      ops.push({ insert: match[2], attributes: { bold: true } });
    } else if (match[3]) {
      // Italic: _text_
      ops.push({ insert: match[4], attributes: { italic: true } });
    } else if (match[5]) {
      // Strikethrough: ~text~
      ops.push({ insert: match[6], attributes: { strike: true } });
    } else if (match[7]) {
      // Monospace: ```text```
      ops.push({ insert: match[8], attributes: { code: true } });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  if (lastIndex < content.length) {
    ops.push({ insert: content.slice(lastIndex) });
  }

  return ops;
}

export function whatsAppToDelta(text: string): Delta {
  const ops: Op[] = [];
  if (!text) return { ops };

  const lines = text.split("\n");

  // Track whether we're inside a code-block (consecutive ``` lines)
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  const flushCodeBlock = () => {
    if (codeBlockLines.length === 0) return;
    codeBlockLines.forEach((codeLine) => {
      ops.push({ insert: codeLine });
      ops.push({ insert: "\n", attributes: { "code-block": true } });
    });
    codeBlockLines = [];
    inCodeBlock = false;
  };

  lines.forEach((line) => {
    // ── Fenced code block: ```...``` spanning a whole line ──
    if (line.startsWith("```") && line.endsWith("```") && line.length > 6) {
      const code = line.slice(3, -3);
      ops.push({ insert: code });
      ops.push({ insert: "\n", attributes: { "code-block": true } });
      return;
    }

    // Opening fence (multi-line code blocks, rare in WA but handle gracefully)
    if (line === "```") {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // ── Blockquote: > text ──
    if (line.startsWith("> ")) {
      const content = line.slice(2);
      ops.push(...parseInline(content));
      ops.push({ insert: "\n", attributes: { blockquote: true } });
      return;
    }

    // ── Ordered list: 1. text ──
    const orderedMatch = line.match(/^(\d+)\.\s(.*)/);
    if (orderedMatch) {
      ops.push(...parseInline(orderedMatch[2]));
      ops.push({ insert: "\n", attributes: { list: "ordered" } });
      return;
    }

    // ── Bullet list: • text ──
    if (line.startsWith("• ")) {
      ops.push(...parseInline(line.slice(2)));
      ops.push({ insert: "\n", attributes: { list: "bullet" } });
      return;
    }

    // ── Regular line ──
    ops.push(...parseInline(line));
    ops.push({ insert: "\n" });
  });

  // Flush any unterminated code block
  flushCodeBlock();

  return { ops };
}
