import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { profile } from '@/lib/content'

export const alt = `${profile.name}, ${profile.role} at ${profile.company}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/** The default card for the site root, drawn from the same renderer. */
export default function Image() {
  return ogImage()
}
