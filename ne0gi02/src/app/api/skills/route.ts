import { NextResponse } from 'next/server'
import { skills } from '@/lib/content'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json(skills)
}
