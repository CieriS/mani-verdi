/**
 * FONTE UNICA DI VERITÀ per i dati del cliente.
 * Nessun componente contiene dati hardcoded: si modifica solo questo file.
 *
 * I campi ancora mancanti sono `null` e portano il commento [DA COMPILARE]:
 * finché restano vuoti, il sito mostra un segnaposto ben visibile oppure nasconde il dato.
 */

/** Testo mostrato al posto di un dato mancante. */
export const placeholder = (label: string) => `[${label}]`;

export const site = {
  brand: 'Mani Verdi',
  owner: 'Tommaso Boschi',
  role: 'Giardiniere',
  vat: '04304121207',

  phone: {
    /** Formato leggibile, mostrato nel sito */
    display: '+39 338 485 3683',
    /** Formato internazionale senza spazi, usato nei link tel: */
    e164: '+393384853683',
  },
  /** Numero WhatsApp: solo cifre, con prefisso internazionale e senza "+" */
  whatsapp: '393384853683',
  email: 'tommasoboschi2004@gmail.com',

  area: {
    /** Formula completa, usata in hero, barra di fiducia e footer */
    label: 'Sasso Marconi e dintorni, fino a Bologna',
    /** Formula breve, usata in title e meta description */
    short: 'Sasso Marconi e Bologna',
    /** Comune di riferimento */
    base: 'Sasso Marconi',
    /** Località dichiarate nei dati strutturati (areaServed). Aggiungi qui altri comuni serviti. */
    places: ['Sasso Marconi', 'Bologna'],
    province: 'BO',
    region: 'Emilia-Romagna',
    country: 'IT',
  },

  /** Anni di esperienza: `null` = non mostrare (scelta del cliente). */
  yearsOfExperience: null as number | null,
  freeSurvey: true,

  /** [DA COMPILARE] Link al profilo Google Business. `null` = pulsante e dati nascosti. */
  googleBusinessUrl: null as string | null,

  /** [DA COMPILARE] Indirizzo della sede legale (serve nella Privacy Policy). */
  legalAddress: null as string | null,

  /** [DA COMPILARE] PEC, facoltativa. `null` = non mostrata. */
  pec: null as string | null,

  /** [DA COMPILARE] Nome del servizio di hosting (serve nella Privacy Policy). */
  hostingProvider: null as string | null,

  /** Servizio che riceve i dati del form (citato nella Privacy Policy). */
  formProvider: {
    name: 'Web3Forms',
    url: 'https://web3forms.com',
  },

  /** Data dell'ultima verifica di accessibilità (AAAA-MM-GG), mostrata in /accessibilita/. */
  accessibilityReviewedAt: '2026-10-08',

  /** Data dell'ultimo aggiornamento della Privacy Policy (AAAA-MM-GG). */
  privacyUpdatedAt: '2026-10-02',

  /**
   * `false` esclude il sito dai motori di ricerca (meta robots noindex).
   * Va riportato a `true` solo quando foto, lavori e recensioni sono quelli reali.
   */
  indexable: false,

  locale: 'it-IT',
} as const;

/** Testi e link ricorrenti derivati dai dati qui sopra. */
export const cta = {
  primary: {
    label: site.freeSurvey ? 'Richiedi un sopralluogo' : 'Richiedi un preventivo',
    href: '/#contatti',
  },
  note: site.freeSurvey ? 'Sopralluogo gratuito e senza impegno.' : 'Preventivo scritto e senza impegno.',
} as const;

const defaultWhatsAppMessage = site.freeSurvey
  ? `Ciao Tommaso, vorrei fissare un sopralluogo gratuito per il mio giardino.`
  : `Ciao Tommaso, vorrei un preventivo per il mio giardino.`;

/** Link WhatsApp con messaggio precompilato. */
export const whatsappUrl = (message: string = defaultWhatsAppMessage) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const phoneUrl = `tel:${site.phone.e164}`;
export const emailUrl = `mailto:${site.email}`;

/** Voci di navigazione, condivise da header, menu mobile e footer. */
export const navigation = [
  { label: 'Servizi', href: '/#servizi' },
  { label: 'Come lavoro', href: '/#come-lavoro' },
  { label: 'Lavori', href: '/#lavori' },
  { label: 'Chi sono', href: '/#chi-sono' },
  { label: 'Domande', href: '/#domande' },
] as const;

/**
 * PUNTO DI INTEGRAZIONE ANALYTICS
 * Oggi il sito non usa cookie né strumenti di tracciamento, quindi non serve alcun banner.
 * Per aggiungere statistiche in futuro:
 *  1. scegli uno strumento senza cookie (es. Plausible, Umami, Cloudflare Web Analytics);
 *  2. inserisci qui l'URL dello script e gli eventuali attributi;
 *  3. aggiorna la sezione "Cookie e statistiche" in src/pages/privacy.astro.
 * Lo script viene caricato da src/components/layout/BaseLayout.astro solo se `analytics` non è null.
 * Con strumenti che usano cookie di profilazione (es. Google Analytics) serve anche un banner di consenso.
 */
export const analytics = null as { src: string; attributes?: Record<string, string> } | null;
