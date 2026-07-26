import { profile, projects, writing } from '@/lib/content'

/**
 * One place for everything a crawler, a scraper or a share sheet reads.
 * The origin is overridable so preview deployments describe themselves
 * correctly instead of pointing every canonical at production.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === 'production'
    ? 'https://ne0gi02.dev'
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://ne0gi02.dev')
).replace(/\/$/, '')

export const siteName = `${profile.name} · ${profile.handle}`

export const siteTitle = `${profile.name} · ${profile.role} at ${profile.company}`

export const siteDescription =
  `${profile.name} (${profile.handle}) is a ${profile.role.toLowerCase()} at ${profile.company} ` +
  `in ${profile.location}. A portfolio written as a letter and read from a desk: ten production ` +
  'applications across retail, fintech, healthcare and manufacturing, VectorDrop, and a national ' +
  'donation platform moving ₹4,00,000+ a month with zero payment failures.'

/** Terms that actually appear in the copy. Nothing invented for the crawler. */
export const siteKeywords = [
  profile.name,
  profile.handle,
  'Bishakh Neogi portfolio',
  'founding engineer',
  'forward deployed engineer',
  'CosX AI',
  'VectorDrop',
  'React engineer Bengaluru',
  'Next.js engineer India',
  'TypeScript',
  'Rust',
  'FastAPI',
  'Aptos',
  'LeetCode Knight',
]

/** Absolute URL for a path, which is what Open Graph and JSON-LD both want. */
export function absolute(path: string) {
  return new URL(path, siteUrl).toString()
}

/** The dynamic card. Any page can ask for its own headline. */
export function ogUrl(params: { title?: string; eyebrow?: string; subtitle?: string } = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value)
  const query = search.toString()
  return absolute(`/api/og${query ? `?${query}` : ''}`)
}

/**
 * Structured data. A Person carrying the real credentials, the WebSite that
 * hosts it, and the work itself as CreativeWork entries so a rich result has
 * something true to quote.
 */
export function jsonLd() {
  const person = {
    '@type': 'Person',
    '@id': absolute('/#person'),
    name: profile.name,
    alternateName: profile.handle,
    url: siteUrl,
    image: absolute(profile.avatar),
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: siteDescription,
    worksFor: { '@type': 'Organization', name: profile.company, url: 'https://cosx.ai' },
    address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Academy of Technology, West Bengal',
    },
    knowsAbout: [
      'TypeScript',
      'React',
      'Next.js',
      'Rust',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Web performance',
      'Aptos',
    ],
    sameAs: profile.socials.map((social) => social.href),
  }

  const website = {
    '@type': 'WebSite',
    '@id': absolute('/#website'),
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    inLanguage: 'en',
    publisher: { '@id': absolute('/#person') },
  }

  const page = {
    '@type': 'ProfilePage',
    '@id': absolute('/#page'),
    url: siteUrl,
    name: siteTitle,
    isPartOf: { '@id': absolute('/#website') },
    about: { '@id': absolute('/#person') },
    primaryImageOfPage: ogUrl(),
  }

  const works = projects.map((project) => ({
    '@type': 'CreativeWork',
    '@id': absolute(`/#project-${project.id}`),
    name: project.title,
    description: project.description,
    dateCreated: project.year,
    creator: { '@id': absolute('/#person') },
    keywords: project.stack.join(', '),
    ...(project.live ? { url: project.live } : {}),
  }))

  const posts = writing.map((piece) => ({
    '@type': 'BlogPosting',
    '@id': absolute(`/#writing-${piece.id}`),
    headline: piece.title,
    abstract: piece.excerpt,
    keywords: piece.tags.join(', '),
    author: { '@id': absolute('/#person') },
    url: piece.href,
  }))

  return { '@context': 'https://schema.org', '@graph': [person, website, page, ...works, ...posts] }
}
