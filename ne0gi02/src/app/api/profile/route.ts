import { NextResponse } from 'next/server'
import { profile } from '@/lib/content'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json(profile)
}
