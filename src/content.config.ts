import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Un file per servizio in src/content/services/.
 * Ogni file genera in automatico una card in home e la pagina /servizi/<nome-file>.
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    /** Beneficio per il cliente, mostrato nella card in home */
    benefit: z.string(),
    /** Meta description e sottotitolo della pagina (max ~155 caratteri) */
    summary: z.string().max(170),
    /** Chiave dell'immagine (vedi src/config/images.ts). Facoltativa: senza, usa il segnaposto. */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    /** Elenco "Cosa comprende" */
    includes: z.array(z.string()).default([]),
    /** Posizione in elenco (crescente) */
    order: z.number().default(99),
  }),
});

/** Un file per lavoro in src/content/portfolio/, con coppia di foto prima/dopo. */
const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    place: z.string().optional(),
    /** Slug del servizio collegato (nome del file in src/content/services/) */
    service: z.string().optional(),
    before: z.string(),
    beforeAlt: z.string(),
    after: z.string(),
    afterAlt: z.string(),
    order: z.number().default(99),
    /** true = lavoro di esempio da sostituire: viene marcato come segnaposto */
    placeholder: z.boolean().default(false),
  }),
});

/** Un file per domanda in src/content/faq/. Il testo del file è la risposta. */
const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number().default(99),
  }),
});

/**
 * Un file per recensione in src/content/reviews/. Il testo del file è la recensione.
 * Solo recensioni reali, copiate da Google: vietato inventarle.
 */
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    author: z.string(),
    /** Es. "Sasso Marconi" */
    place: z.string().optional(),
    /** Da 1 a 5. Facoltativo. */
    rating: z.number().min(1).max(5).optional(),
    /** Data della recensione (AAAA-MM-GG) */
    date: z.coerce.date().optional(),
    /** Link alla recensione originale */
    sourceUrl: z.url().optional(),
    order: z.number().default(99),
    /** true = segnaposto da sostituire con una recensione reale */
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { services, portfolio, faq, reviews };
