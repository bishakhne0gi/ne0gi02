'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { AppIcon } from '@/components/os/AppIcon'
import { apps, APP_ORDER } from '@/lib/apps'
import { projects, timeline, writing } from '@/lib/content'
import type { AppId } from '@/lib/content'

interface Hit {
  id: string
  app: AppId
  title: string
  detail: string
  group: string
}

/**
 * Spotlight, reached by pulling down on the home screen. It searches the
 * apps and everything inside them, because on a portfolio the thing being
 * looked for is a project, not an icon.
 */
export function Spotlight({
  onClose,
  onOpen,
}: {
  onClose: () => void
  onOpen: (id: AppId) => void
}) {
  const [query, setQuery] = useState('')
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => input.current?.focus(), 260)
    return () => clearTimeout(timer)
  }, [])

  const index = useMemo<Hit[]>(
    () => [
      ...APP_ORDER.map((id) => ({
        id: `app-${id}`,
        app: id,
        title: apps[id].name,
        detail: apps[id].title,
        group: 'Applications',
      })),
      ...projects.map((project) => ({
        id: `project-${project.id}`,
        app: 'projects' as AppId,
        title: project.title,
        detail: project.blurb,
        group: 'Projects',
      })),
      ...writing.map((piece) => ({
        id: `writing-${piece.id}`,
        app: 'writing' as AppId,
        title: piece.title,
        detail: `${piece.date} · ${piece.tags.join(', ')}`,
        group: 'Writing',
      })),
      ...timeline.map((entry) => ({
        id: `timeline-${entry.id}`,
        app: 'timeline' as AppId,
        title: entry.title,
        detail: `${entry.year} · ${entry.org}`,
        group: 'Curriculum',
      })),
    ],
    [],
  )

  const term = query.trim().toLowerCase()
  const hits = term
    ? index.filter(
        (hit) =>
          hit.title.toLowerCase().includes(term) || hit.detail.toLowerCase().includes(term),
      )
    : []

  const groups = hits.reduce<Record<string, Hit[]>>((acc, hit) => {
    ;(acc[hit.group] ??= []).push(hit)
    return acc
  }, {})

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(28px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-40 flex flex-col bg-black/45 px-5 pb-4"
      style={{ paddingTop: 'calc(max(0.75rem, env(safe-area-inset-top)) + 46px)' }}
    >
      <div className="flex shrink-0 items-center gap-3">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/55">
            <SearchGlyph />
          </span>
          <input
            ref={input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search"
            className="h-11 w-full rounded-[13px] bg-white/16 pl-10 pr-3 text-[16px] text-white placeholder:text-white/50 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-[15px] font-medium text-white/85"
        >
          Cancel
        </button>
      </div>

      <div className="hide-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {!term ? (
          <>
            <p className="mb-3 text-[12px] uppercase tracking-[0.14em] text-white/45">Siri suggestions</p>
            <div className="grid grid-cols-4 gap-x-3 gap-y-5">
              {APP_ORDER.slice(0, 8).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onOpen(id)}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                >
                  <AppIcon id={id} className="w-full" />
                  <span className="max-w-full truncate text-[11px] text-white/85">
                    {apps[id].name}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : hits.length === 0 ? (
          <p className="pt-10 text-center text-[14px] text-white/55">No results for “{query}”.</p>
        ) : (
          Object.entries(groups).map(([group, rows]) => (
            <section key={group} className="mb-5">
              <p className="mb-2 text-[12px] uppercase tracking-[0.14em] text-white/45">{group}</p>
              <ul className="overflow-hidden rounded-[16px] bg-white/10">
                {rows.map((hit, i) => (
                  <li key={hit.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(hit.app)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-white/12"
                      style={{ boxShadow: i ? 'inset 0 0.5px 0 0 rgb(255 255 255 / .12)' : undefined }}
                    >
                      <AppIcon id={hit.app} className="h-9 w-9 shrink-0" />
                      <span className="min-w-0">
                        <span className="block truncate text-[14.5px] text-white">{hit.title}</span>
                        <span className="block truncate text-[12px] text-white/55">
                          {hit.detail}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </motion.div>
  )
}

function SearchGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
