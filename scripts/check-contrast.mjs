// Verifica il contrasto WCAG AA delle coppie di colori usate nel sito.
// Legge i token direttamente da src/styles/global.css, così resta allineato al design.
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function tokens(marker) {
  const start = css.indexOf(marker);
  if (start === -1) throw new Error(`Blocco non trovato: ${marker}`);
  const block = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
}

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [testo, sfondo, soglia]
const pairs = [
  ['ink', 'bg', 4.5], ['ink', 'raised', 4.5], ['ink', 'subtle', 4.5],
  ['muted', 'bg', 4.5], ['muted', 'raised', 4.5], ['muted', 'subtle', 4.5],
  ['primary', 'bg', 4.5], ['primary', 'raised', 4.5], ['primary', 'subtle', 4.5],
  ['on-primary', 'primary', 4.5], ['on-primary', 'primary-strong', 4.5],
  ['accent', 'bg', 4.5], ['accent', 'raised', 4.5], ['accent', 'subtle', 4.5],
  ['danger', 'bg', 4.5], ['danger', 'raised', 4.5],
  ['line-strong', 'bg', 3], ['line-strong', 'raised', 3],
];

let failed = 0;
for (const [name, marker] of [['light', '/* tema:chiaro */'], ['dark', '/* tema:scuro */']]) {
  const t = tokens(marker);
  console.log(`\nTema ${name}`);
  for (const [fg, bg, min] of pairs) {
    const r = ratio(t[fg], t[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`  ${ok ? 'OK ' : 'NO '} ${fg} su ${bg}: ${r.toFixed(2)} (min ${min})`);
  }
}
process.exit(failed ? 1 : 0);
