# Mani Verdi — sito vetrina

Sito statico di Tommaso Boschi, giardiniere a Sasso Marconi. Obiettivo: trasformare chi visita da smartphone in richieste di sopralluogo.

**Stack:** Astro (output statico) · Tailwind CSS v4 · TypeScript strict · font self-hosted (Fraunces + Inter) · nessun framework UI, JavaScript vanilla (circa 4 KB in totale).

## Comandi

| Comando | Cosa fa |
| --- | --- |
| `npm install` | Installa le dipendenze |
| `npm run dev` | Avvia il sito in locale su `http://localhost:4321` |
| `npm run build` | Controlla i tipi e genera il sito in `dist/` |
| `npm run preview` | Serve in locale la cartella `dist/` |
| `npm run contrast` | Verifica il contrasto WCAG AA dei colori (tema chiaro e scuro) |
| `npm run placeholders` | Rigenera i segnaposto mancanti delle foto (non tocca le foto esistenti) |

## Struttura

```
src/
├── config/
│   ├── site.ts          ← TUTTI i dati del cliente (telefono, zona, P.IVA…)
│   └── images.ts        ← manifest delle immagini
├── content/             ← i contenuti, separati dal codice
│   ├── services/        ← un file = una card in home + una pagina /servizi/…
│   ├── portfolio/       ← un file = un lavoro prima/dopo
│   ├── faq/             ← un file = una domanda
│   └── reviews/         ← un file = una recensione
├── assets/images/       ← le foto (ottimizzate in automatico al build)
├── components/
│   ├── layout/          ← BaseLayout, Header, Footer, MobileCTABar
│   ├── sections/        ← le sezioni della home
│   └── ui/              ← Button, Card, Section, Container, ResponsiveImage, ThemeToggle, BeforeAfter, Icon
├── lib/schema.ts        ← dati strutturati JSON-LD
├── pages/               ← home, servizi/[slug], privacy, 404, robots.txt
└── styles/global.css    ← design token (colori, tipografia, spazi, raggi, animazioni)
```

## Modificare i dati di contatto

Tutto sta in [`src/config/site.ts`](src/config/site.ts): telefono, WhatsApp, email, zona, P.IVA, sopralluogo gratuito sì/no. Modifica il valore, salva, e il dato cambia in tutto il sito (header, footer, form, dati strutturati, privacy).

I campi con il commento `[DA COMPILARE]` sono ancora vuoti (`null`): finché restano tali, il sito mostra un segnaposto evidenziato oppure nasconde il dato.

> La zona compare anche, scritta per esteso, in `src/content/faq/zone.md`: se cambia, aggiorna anche quel file.

## Aggiungere un servizio

1. Crea un file in `src/content/services/`, ad esempio `tosatura-prati.md`. Il nome del file diventa l'indirizzo: `/servizi/tosatura-prati/`.
2. Compila l'intestazione e scrivi il testo sotto:

```md
---
title: Nome del servizio
benefit: Il vantaggio per il cliente, in una frase (compare nella card in home).
summary: Descrizione breve per Google, massimo 170 caratteri.
image: servizi/tosatura-prati        # facoltativa: senza, compare il segnaposto generico
imageAlt: Descrizione della foto
order: 8                             # posizione in elenco
includes:
  - Prima voce di "Cosa comprende"
  - Seconda voce
---

Testo della pagina, in Markdown. Usa `## Titolo` per i sottotitoli.
```

3. Se hai la foto, salvala come `src/assets/images/servizi/tosatura-prati.jpg`.

Fatto: card in home, pagina dedicata, voce nel footer, opzione nel form, sitemap e dati strutturati si aggiornano da soli. Per togliere un servizio, cancella il file.

Lo stesso principio vale per **portfolio**, **FAQ** e **recensioni**: copia un file esistente nella cartella giusta e modificalo. I campi disponibili sono descritti in [`src/content.config.ts`](src/content.config.ts).

### Recensioni e lavori: togliere i segnaposto

I file in `src/content/reviews/` e `src/content/portfolio/` sono segnaposto (`placeholder: true`). Quando inserisci un contenuto reale, sostituisci i testi tra parentesi quadre e **cancella la riga `placeholder: true`**.

Le recensioni vanno copiate così come sono da Google. Non inventarle e non ritoccarle.

## Sostituire una foto

Le foto stanno in `src/assets/images/`. Per sostituirne una, **sovrascrivi il file mantenendo lo stesso nome**: non serve toccare il codice.

- Carica l'originale grande e non compresso: ridimensionamento, ritaglio e conversione in AVIF/WebP avvengono al build.
- Se la nuova foto ha un'estensione diversa (es. `.png` al posto di `.jpg`), cancella il vecchio file.
- Aggiorna il testo alternativo (`imageAlt`, `beforeAlt`, `afterAlt`) nel file di contenuto corrispondente.

L'elenco completo delle foto, con nomi dei file e proporzioni, è in [`docs/foto-da-fornire.md`](docs/foto-da-fornire.md).

## Form di contatto

Il sito è statico, quindi l'invio passa da [Web3Forms](https://web3forms.com) (gratuito):

1. Vai su web3forms.com, inserisci l'email su cui ricevere le richieste e copia la chiave che ricevi.
2. Imposta la variabile d'ambiente `PUBLIC_FORM_ACCESS_KEY` con quella chiave (in locale nel file `.env`, online nel pannello dell'hosting). Vedi [`.env.example`](.env.example).

Senza chiave il form funziona comunque: apre WhatsApp con la richiesta già scritta.

Per usare un altro servizio (es. Formspree), cambia `PUBLIC_FORM_ENDPOINT` e, se serve, adatta i campi nascosti in `src/components/sections/FinalCTA.astro`.

## Colori, font e animazioni

Tutti i design token sono in [`src/styles/global.css`](src/styles/global.css). Dopo aver cambiato un colore lancia `npm run contrast` per verificare che il contrasto resti a norma su entrambi i temi.

## Statistiche (analytics)

Il sito non usa cookie né tracciamento, quindi non serve alcun banner. Il punto di integrazione è la costante `analytics` in fondo a `src/config/site.ts`: le istruzioni sono nel commento. Scegli uno strumento senza cookie (Plausible, Umami, Cloudflare Web Analytics) e aggiorna la sezione "Cookie e statistiche" di `src/pages/privacy.astro`.

## Deploy

Il sito è una cartella di file statici (`dist/`) e si pubblica su qualsiasi hosting. In tutti i casi imposta due variabili d'ambiente:

| Variabile | Valore |
| --- | --- |
| `SITE_URL` | L'indirizzo definitivo, es. `https://www.maniverdi.it` (senza slash finale) |
| `PUBLIC_FORM_ACCESS_KEY` | La chiave Web3Forms |

**Netlify** — *Add new site → Import an existing project*, collega il repository. Build command: `npm run build`. Publish directory: `dist`. Le variabili si impostano in *Site configuration → Environment variables*.

**Vercel** — *Add New → Project*, importa il repository. Astro viene riconosciuto da solo (build `npm run build`, output `dist`). Le variabili si impostano in *Settings → Environment Variables*.

**Cloudflare Pages** — *Workers & Pages → Create → Pages → Connect to Git*. Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`. Le variabili si impostano in *Settings → Environment variables*.

Dopo aver collegato il dominio:

1. controlla che `SITE_URL` corrisponda al dominio reale e rilancia il deploy;
2. scrivi il nome dell'hosting in `hostingProvider` (`src/config/site.ts`), perché compare nella Privacy Policy;
3. invia `https://<dominio>/sitemap-index.xml` a Google Search Console.
