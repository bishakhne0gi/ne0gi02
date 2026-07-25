'use client'

import { AboutApp } from '@/components/apps/AboutApp'
import { ContactApp } from '@/components/apps/ContactApp'
import { GalleryApp } from '@/components/apps/GalleryApp'
import { LetterApp } from '@/components/apps/LetterApp'
import { ProjectsApp } from '@/components/apps/ProjectsApp'
import { TerminalApp } from '@/components/apps/TerminalApp'
import { TimelineApp } from '@/components/apps/TimelineApp'
import { WritingApp } from '@/components/apps/WritingApp'
import type { AppId } from '@/lib/content'

/** Apps that draw their own scroll container / chrome. */
export const BARE_APPS: AppId[] = [
  'letter',
  'projects',
  'terminal',
  'contact',
  'gallery',
  'writing',
]

/** Apps whose title bar is dark to match their content. */
export const DARK_CHROME_APPS: AppId[] = ['terminal']

export function AppSurface({ id, fullscreen }: { id: AppId; fullscreen?: boolean }) {
  switch (id) {
    case 'letter':
      return <LetterApp fullscreen={fullscreen} />
    case 'projects':
      return <ProjectsApp fullscreen={fullscreen} />
    case 'timeline':
      return <TimelineApp />
    case 'terminal':
      return <TerminalApp />
    case 'gallery':
      return <GalleryApp />
    case 'writing':
      return <WritingApp fullscreen={fullscreen} />
    case 'about':
      return <AboutApp />
    case 'contact':
      return <ContactApp />
  }
}
