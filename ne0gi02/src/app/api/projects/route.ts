import { NextResponse } from 'next/server'
import { experiments, projects } from '@/lib/content'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ projects, experiments })
}
