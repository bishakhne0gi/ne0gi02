import { NextResponse } from 'next/server'
import { letter, letterMeta } from '@/lib/content'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ meta: letterMeta, blocks: letter })
}
