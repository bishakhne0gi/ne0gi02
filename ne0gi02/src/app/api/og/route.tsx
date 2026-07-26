import type { NextRequest } from 'next/server'
import { ogImage } from '@/lib/og'

export const runtime = 'edge'

/**
 * The dynamic card: /api/og?title=…&subtitle=…&eyebrow=…
 * Anything that can be linked can carry its own preview.
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  return ogImage({
    title: params.get('title') ?? undefined,
    subtitle: params.get('subtitle') ?? undefined,
    eyebrow: params.get('eyebrow') ?? undefined,
  })
}
