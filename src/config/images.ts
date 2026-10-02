/**
 * MANIFEST UNICO DELLE IMMAGINI
 *
 * Tutte le immagini vivono in src/assets/images/ e vengono registrate qui in automatico.
 * La chiave è il percorso senza estensione: src/assets/images/servizi/prati.jpg → "servizi/prati".
 *
 * Sostituire una foto = sovrascrivere il file mantenendo lo stesso nome.
 * (Se cambi estensione, es. da .jpg a .png, cancella il vecchio file.)
 */
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const registry = new Map<string, ImageMetadata>();
for (const [path, module] of Object.entries(modules)) {
  const key = path.replace('../assets/images/', '').replace(/\.\w+$/, '');
  registry.set(key, module.default);
}

/** Immagini con una posizione fissa nel sito. Proporzioni attese tra parentesi. */
export const slots = {
  /** Hero su desktop (verticale 4:5) */
  heroDesktop: 'hero/hero-verticale',
  /** Hero su telefono (orizzontale 4:3). Usata anche per l'anteprima social. */
  heroMobile: 'hero/hero-orizzontale',
  /** Sezione "Chi sono" (verticale 4:5) */
  about: 'chi-sono/tommaso',
  /** Immagine di riserva quando un contenuto non indica la propria (4:3) */
  fallback: 'placeholder/generico',
} as const;

export const imageKeys = () => [...registry.keys()];

/**
 * Restituisce l'immagine associata a una chiave.
 * Se la chiave manca o non esiste, usa l'immagine di riserva e avvisa in fase di build.
 */
export function getImage(key?: string): ImageMetadata {
  const found = key ? registry.get(key) : undefined;
  if (found) return found;
  if (key) console.warn(`[immagini] "${key}" non trovata in src/assets/images/: uso il segnaposto generico.`);
  const fallback = registry.get(slots.fallback);
  if (!fallback) throw new Error(`[immagini] Manca l'immagine di riserva "${slots.fallback}". Lancia: npm run placeholders`);
  return fallback;
}
