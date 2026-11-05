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

// Fail the build loudly if the README loses a section the site depends on.
for (const key of ['What I do now', 'Where to find me', 'Facets', 'The log', 'A note on this page']) {
  if (!sections[key]) throw new Error(`README.md is missing the "## ${key}" section the site renders`);
}

export const spine = paragraphs('_top')[0] ?? '';
if (!spine) throw new Error('README.md has no opening paragraph');

/** "Where to find me" bullets: label plus the first link in the line. */
export const links = bullets('Where to find me').map((b) => {
  const label = (b.match(/^\*\*([^*:]+):?\*\*/)?.[1] ?? '').trim();
  const m = b.match(/\[([^\]]+)\]\(([^)\s]+)\)/);
  return { label, text: m?.[1] ?? '', href: m?.[2] ?? '' };
}).filter((l) => l.href);
/** Public profile URLs for the JSON-LD sameAs list (everything except the site itself and email). */
export const profiles = links.map((l) => l.href).filter((h) => h.startsWith('https://') && !h.includes('justinbradshaw.com'));
export const whatIDo = paragraphs('What I do now');
export const speakingIndex = whatIDo.findIndex((p) => /available for speaking/i.test(p));
if (speakingIndex < 0) throw new Error('README "What I do now" has no speaking paragraph; the nav links to #speaking');
export const facetsIntro = paragraphs('Facets')[0] ?? '';
export const facets = bullets('Facets').map((b) => {
  const m = b.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
  const name = m ? m[1] : b;
  const text = m ? m[2] : '';
  return { name, slug: name.toLowerCase(), text: text.charAt(0).toUpperCase() + text.slice(1) };
});
export const logIntro = paragraphs('The log')[0] ?? '';
export const note = paragraphs('A note on this page');
