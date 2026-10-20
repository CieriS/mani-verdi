import { readdirSync } from 'node:fs';

/**
 * Every page of the site, read from the same content the build uses: a new service is checked
 * as soon as its Markdown file exists, with no list to keep in step.
 */
const services = readdirSync(new URL('../src/content/services/', import.meta.url))
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace(/\.md$/, ''))
  .sort();

export const PAGES: Array<{ name: string; path: string }> = [
  { name: 'home', path: '/' },
  { name: 'privacy', path: '/privacy/' },
  { name: 'not-found', path: '/pagina-inesistente/' },
  ...services.map((slug) => ({ name: `servizio-${slug}`, path: `/servizi/${slug}/` })),
];
