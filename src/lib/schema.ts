/** Dati strutturati JSON-LD, costruiti a partire da src/config/site.ts. */
import { site } from '@/config/site';

type Service = { id: string; title: string; summary: string };

const businessId = (origin: URL | string) => `${new URL('/', origin).href}#attivita`;

export function localBusinessSchema(origin: URL, services: Service[], image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': businessId(origin),
    name: site.brand,
    description: `${site.owner}, ${site.role.toLowerCase()}: ${services.map((s) => s.title.toLowerCase()).join(', ')}.`,
    url: new URL('/', origin).href,
    telephone: site.phone.e164,
    email: site.email,
    vatID: `IT${site.vat}`,
    founder: { '@type': 'Person', name: site.owner, jobTitle: site.role },
    ...(image ? { image } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.area.base,
      addressRegion: site.area.province,
      addressCountry: site.area.country,
    },
    areaServed: site.area.places.map((name) => ({ '@type': 'City', name })),
    ...(site.googleBusinessUrl ? { sameAs: [site.googleBusinessUrl] } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servizi di giardinaggio',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          url: new URL(`/servizi/${service.id}/`, origin).href,
        },
      })),
    },
  };
}

export function serviceSchema(origin: URL, service: Service, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    url: new URL(`/servizi/${service.id}/`, origin).href,
    ...(image ? { image } : {}),
    provider: { '@id': businessId(origin) },
    areaServed: site.area.places.map((name) => ({ '@type': 'City', name })),
  };
}

export function breadcrumbSchema(origin: URL, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, origin).href,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Riduce il Markdown di una risposta a testo semplice per i dati strutturati. */
export const plainText = (markdown = '') =>
  markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
