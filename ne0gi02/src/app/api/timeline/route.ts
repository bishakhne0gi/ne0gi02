import { NextResponse } from 'next/server'
import { timeline } from '@/lib/content'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json(timeline)
}
