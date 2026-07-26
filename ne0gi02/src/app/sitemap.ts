import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

/**
 * One page, honestly declared. The windows are client state rather than
 * routes, so inventing URLs for them would only feed a crawler 404s.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
