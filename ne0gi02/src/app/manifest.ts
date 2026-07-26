import type { MetadataRoute } from 'next'
import { profile } from '@/lib/content'
import { siteDescription } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} · ${profile.role}`,
    short_name: profile.handle,
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0B0D',
    theme_color: '#0A0B0D',
    icons: [{ src: '/assets/fav.jpg', sizes: 'any', type: 'image/jpeg' }],
  }
}
