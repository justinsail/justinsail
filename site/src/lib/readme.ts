// Reads the repo-root README.md (the canonical bio) so the site never drifts from it.
import fs from 'node:fs';
import path from 'node:path';

const raw = fs.readFileSync(path.resolve(process.cwd(), '..', 'README.md'), 'utf8');

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Minimal inline markdown: links, bold, italic, code. Enough for the README. */
export function inline(md: string): string {
  return esc(md)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
}

const lines = raw.split('\n');
const sections: Record<string, string[]> = {};
let current = '_top';
sections[current] = [];
for (const line of lines) {
  const h = line.match(/^##\s+(.*)/);
  if (h) { current = h[1].trim(); sections[current] = []; continue; }
  if (/^#\s/.test(line)) continue;
  sections[current].push(line);
}

const paragraphs = (key: string) =>
  (sections[key] ?? []).join('\n').split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith('- '));

const bullets = (key: string) =>
  (sections[key] ?? []).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());

export const spine = paragraphs('_top')[0] ?? '';
export const whatIDo = paragraphs('What I do now');
export const facetsIntro = paragraphs('Facets')[0] ?? '';
export const facets = bullets('Facets').map((b) => {
  const m = b.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
  const name = m ? m[1] : b;
  const text = m ? m[2] : '';
  return { name, slug: name.toLowerCase(), text: text.charAt(0).toUpperCase() + text.slice(1) };
});
export const logIntro = paragraphs('The log')[0] ?? '';
export const note = paragraphs('A note on this page');
