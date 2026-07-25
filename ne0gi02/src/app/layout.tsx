import type { Metadata, Viewport } from 'next'
import { Providers } from '@/app/providers'
import { profile } from '@/lib/content'
import './globals.css'

/**
 * Type is Apple's own, drawn from the OS rather than downloaded:
 *   sans  → SF Pro          (-apple-system / ui-sans-serif)
 *   serif → New York        (ui-serif on Apple platforms)
 *   mono  → SF Mono         (ui-monospace)
 *
 * Nothing is fetched, so there is no font request, no FOUT and no CDN — and
 * on a Mac the interface is set in the exact faces the OS itself uses. The
 * stacks in globals.css degrade to Georgia/Segoe/Menlo elsewhere.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://ne0gi02.dev'),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description:
    'A portfolio written as a letter, read from a desk. Projects, curriculum and correspondence from ' +
    `${profile.name} (${profile.handle}).`,
  icons: { icon: '/assets/fav.jpg' },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: 'A portfolio written as a letter, read from a desk.',
    type: 'profile',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e3dccd' },
    { media: '(prefers-color-scheme: dark)', color: '#121419' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

/** Applied before paint so the desktop never flashes the wrong theme. */
const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
