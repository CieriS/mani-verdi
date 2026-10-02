// Genera i segnaposto delle foto in src/assets/images/.
// Non sovrascrive i file esistenti (così non cancella le foto reali): usa --force per rigenerarli.
import { mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'images');
const force = process.argv.includes('--force');

const SIZES = {
  '4/3': [1600, 1200],
  '4/5': [1600, 2000],
};

const TONES = {
  green: ['#dfe7da', '#9fb59f', '#2e5a43'],
  earth: ['#ebe3d6', '#c9b79f', '#6b4a30'],
  neutral: ['#eeebe2', '#cfd2c4', '#4f5a51'],
};

/** @type {{ file: string, ratio: keyof typeof SIZES, tone: keyof typeof TONES, label: string }[]} */
const placeholders = [
  { file: 'hero/hero-verticale', ratio: '4/5', tone: 'green', label: 'giardino curato (verticale, desktop)' },
  { file: 'hero/hero-orizzontale', ratio: '4/3', tone: 'green', label: 'giardino curato (orizzontale, telefono)' },
  { file: 'chi-sono/tommaso', ratio: '4/5', tone: 'neutral', label: 'Tommaso al lavoro' },
  { file: 'placeholder/generico', ratio: '4/3', tone: 'neutral', label: 'immagine da inserire' },
  { file: 'servizi/manutenzione-giardini', ratio: '4/3', tone: 'green', label: 'giardino in ordine dopo la manutenzione' },
  { file: 'servizi/potatura-siepi-alberi', ratio: '4/3', tone: 'green', label: 'siepe potata' },
  { file: 'servizi/progettazione-realizzazione-giardini', ratio: '4/3', tone: 'green', label: 'giardino appena realizzato' },
  { file: 'servizi/prati-semina-rotoli', ratio: '4/3', tone: 'green', label: 'prato nuovo' },
  { file: 'servizi/impianti-irrigazione', ratio: '4/3', tone: 'green', label: 'impianto di irrigazione in funzione' },
  { file: 'servizi/pulizia-smaltimento-verde', ratio: '4/3', tone: 'green', label: 'area ripulita dal verde' },
  { file: 'servizi/terrazzi-balconi', ratio: '4/3', tone: 'green', label: 'terrazzo con piante curate' },
  ...[1, 2, 3].flatMap((n) => [
    { file: `portfolio/lavoro-${n}-prima`, ratio: '4/3', tone: 'earth', label: `lavoro ${n}, prima dell'intervento` },
    { file: `portfolio/lavoro-${n}-dopo`, ratio: '4/3', tone: 'green', label: `lavoro ${n}, dopo l'intervento` },
  ]),
];

const escapeXml = (s) => s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

function svg({ ratio, tone, label, file }) {
  const [w, h] = SIZES[ratio];
  const [from, to, ink] = TONES[tone];
  const cx = w / 2;
  const cy = h / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.82}" cy="${h * 0.2}" r="${w * 0.28}" fill="#ffffff" opacity="0.14"/>
  <circle cx="${w * 0.12}" cy="${h * 0.88}" r="${w * 0.34}" fill="${ink}" opacity="0.08"/>
  <rect x="40" y="40" width="${w - 80}" height="${h - 80}" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="3" stroke-dasharray="14 14"/>
  <g fill="${ink}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
    <text x="${cx}" y="${cy - 30}" font-size="44" letter-spacing="10" opacity="0.75">FOTO</text>
    <text x="${cx}" y="${cy + 50}" font-size="62">${escapeXml(label)}</text>
    <text x="${cx}" y="${cy + 130}" font-size="34" font-family="Helvetica, Arial, sans-serif" opacity="0.75">${escapeXml(file)}.jpg · proporzioni ${ratio.replace('/', ':')}</text>
  </g>
</svg>`;
}

const exists = (p) => access(p).then(() => true, () => false);

let written = 0;
for (const p of placeholders) {
  const out = join(root, `${p.file}.jpg`);
  if (!force && (await exists(out))) continue;
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg(p))).jpeg({ quality: 80, mozjpeg: true }).toFile(out);
  written++;
}
console.log(`Segnaposto generati: ${written} (già presenti: ${placeholders.length - written})`);
