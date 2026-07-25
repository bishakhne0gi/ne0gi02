import { NextResponse } from 'next/server'
import { gallery, galleryCaption } from '@/lib/content'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ caption: galleryCaption, photos: gallery })
}
