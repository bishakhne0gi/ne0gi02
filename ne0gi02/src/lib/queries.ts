import { queryOptions, type QueryClient } from '@tanstack/react-query'
import type {
  AppId,
  LetterBlock,
  Photo,
  Profile,
  Project,
  SkillGroup,
  TimelineEntry,
  galleryCaption,
  letterMeta,
} from '@/lib/content'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Request to ${path} failed with ${res.status}`)
  return res.json() as Promise<T>
}

/**
 * Content is immutable per deploy, so nothing ever goes stale at runtime.
 * Queries exist to keep each window's payload lazy and independently
 * suspendable — open Terminal.app and only the skills payload is fetched.
 */
const forever = { staleTime: Infinity, gcTime: Infinity } as const

export const profileQuery = queryOptions({
  queryKey: ['profile'],
  queryFn: () => get<Profile>('/api/profile'),
  ...forever,
})

export const letterQuery = queryOptions({
  queryKey: ['letter'],
  queryFn: () =>
    get<{ meta: typeof letterMeta; blocks: LetterBlock[] }>('/api/letter'),
  ...forever,
})

export const projectsQuery = queryOptions({
  queryKey: ['projects'],
  queryFn: () =>
    get<{ projects: Project[]; experiments: { title: string; note: string; href: string }[] }>(
      '/api/projects',
    ),
  ...forever,
})

export const timelineQuery = queryOptions({
  queryKey: ['timeline'],
  queryFn: () => get<TimelineEntry[]>('/api/timeline'),
  ...forever,
})

export const skillsQuery = queryOptions({
  queryKey: ['skills'],
  queryFn: () => get<SkillGroup[]>('/api/skills'),
  ...forever,
})

export const galleryQuery = queryOptions({
  queryKey: ['gallery'],
  queryFn: () =>
    get<{ caption: typeof galleryCaption; photos: Photo[] }>('/api/gallery'),
  ...forever,
})

/**
 * Dock/desktop hover prefetch — a window's payload is warm before it opens.
 * A switch rather than a lookup table so each branch keeps its own generics.
 */
export function prefetchApp(client: QueryClient, id: AppId): Promise<void> {
  switch (id) {
    case 'letter':
      return client.prefetchQuery(letterQuery)
    case 'projects':
      return client.prefetchQuery(projectsQuery)
    case 'timeline':
      return client.prefetchQuery(timelineQuery)
    case 'terminal':
      return client.prefetchQuery(skillsQuery)
    case 'gallery':
      return client.prefetchQuery(galleryQuery)
    case 'about':
    case 'contact':
      return client.prefetchQuery(profileQuery)
  }
}
