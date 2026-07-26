import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/app/providers'
import { profile } from '@/lib/content'
import { siteDescription, siteKeywords, siteName, siteTitle, siteUrl } from '@/lib/seo'
import './globals.css'

/**
 * The whole interface is San Francisco. There is no second face any
 * more, and the New York serif that used to set headings and long-form
 * copy is gone.
 *
 * On Apple hardware `-apple-system` hands back the genuine article straight
 * from the OS (SF Pro, and SF Mono where a fixed advance is needed) with
 * nothing downloaded. That is also the only lawful way to put real SF on a
 * web page: Apple's font licence covers mock-ups of Apple-platform UI and
 * forbids embedding the files in a product, so the .otf downloads doing the
 * rounds cannot ship here.
 *
 * Everywhere else, on Windows, Android and Linux, Inter stands in. It was drawn
 * as an SF-alike, it mirrors SF's optical-size behaviour, and it is OFL, so
 * it is the one part of the stack we may serve ourselves. next/font vendors
 * it at build time, so it stays same-origin and preloaded with no CDN hop,
 * in keeping with the rest of this app.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * The card and the canonical both come from src/lib/seo.ts, and the image
 * itself from src/app/opengraph-image.tsx, which Next attaches to og:image
 * and twitter:image without either being listed here.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${profile.name}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: siteName,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: 'technology',
  icons: {
    icon: [{ url: '/assets/fav.jpg', type: 'image/jpeg' }],
    apple: [{ url: '/assets/fav.jpg' }],
  },
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  // None of this is private, so crawlers get all of it: full snippet, large
  // image preview, no truncation.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'profile',
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    locale: 'en_IN',
    firstName: profile.name.split(' ')[0],
    lastName: profile.name.split(' ').slice(1).join(' '),
    username: profile.handle,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    site: `@${profile.handle}`,
    creator: `@${profile.handle}`,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { color: '#0A0B0D' },
  ],
  width: 'device-width',
  initialScale: 1,
  // No maximum-scale: pinch-zoom stays available, which is both the
  // accessible choice and the one Lighthouse scores.
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // This OS only has one appearance. Dark is pinned rather than toggled,
    // because the desktop is a photograph of a dark room.
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
