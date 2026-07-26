'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppIcon } from '@/components/os/AppIcon'
import { apps, APP_ORDER } from '@/lib/apps'
import { cn } from '@/lib/cn'
import type { AppId } from '@/lib/content'

/** The App Library's own filing, which iOS decides for you and never asks about. */
const CATEGORIES: { label: string; ids: AppId[] }[] = [
  { label: 'Productivity & Finance', ids: ['letter', 'contact', 'timeline', 'about'] },
  { label: 'Creativity', ids: ['writing', 'gallery'] },
  { label: 'Utilities', ids: ['projects', 'terminal'] },
]

/**
 * The page past the last home page: every app, filed into folders it did not
 * choose, with the search field that is the fastest way to any of them.
 */
export function AppLibrary({
  active,
  onOpen,
}: {
  active: boolean
  onOpen: (id: AppId, element: HTMLElement | null) => void
}) {
  const [query, setQuery] = useState('')
  const [folder, setFolder] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return null
    return APP_ORDER.filter((id) => {
      const meta = apps[id]
      return (
        meta.name.toLowerCase().includes(term) ||
        meta.title.toLowerCase().includes(term) ||
        id.includes(term)
      )
    })
  }, [query])

  return (
    <div className="flex h-full flex-col px-5 pb-2 pt-3">
      {/* ── search field ── */}
      <div className="relative shrink-0">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50">
          <SearchGlyph />
        </span>
        <input
          ref={input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="App Library"
          aria-label="Search apps"
          className="h-10 w-full rounded-[12px] bg-white/14 pl-10 pr-9 text-[15px] text-white placeholder:text-white/50 backdrop-blur-xl outline-none focus:bg-white/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              input.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-[13px] text-white"
          >
            ×
          </button>
        )}
      </div>

      {/* ── results, or the folders ── */}
      <div className="hide-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {results ? (
          <ul className="space-y-1.5 pb-4">
            {results.length === 0 && (
              <p className="px-1 pt-6 text-center text-[13.5px] text-white/50">
                No apps match “{query}”.
              </p>
            )}
            {results.map((id) => (
              <ResultRow key={id} id={id} onOpen={onOpen} />
            ))}
          </ul>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-4">
            {CATEGORIES.map((category) => (
              <FolderTile
                key={category.label}
                label={category.label}
                ids={category.ids}
                onOpenApp={onOpen}
                onExpand={() => setFolder(category.label)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── an expanded folder ── */}
      <AnimatePresence>
        {folder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFolder(null)}
            className="absolute inset-0 z-30 grid place-items-center bg-black/45 px-6 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full rounded-[32px] bg-white/12 p-5 backdrop-blur-2xl"
            >
              <p className="mb-4 text-center text-[15px] font-medium text-white">{folder}</p>
              <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                {(CATEGORIES.find((c) => c.label === folder)?.ids ?? []).map((id) => (
                  <LibraryIcon key={id} id={id} onOpen={onOpen} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && <span className="sr-only">App Library</span>}
    </div>
  )
}

/* ───────────────────────────── parts ───────────────────────────── */

/**
 * A folder tile: three apps you can tap straight through, and a fourth
 * quadrant that opens the folder, which is precisely how iOS behaves.
 */
function FolderTile({
  label,
  ids,
  onOpenApp,
  onExpand,
}: {
  label: string
  ids: AppId[]
  onOpenApp: (id: AppId, element: HTMLElement | null) => void
  onExpand: () => void
}) {
  const direct = ids.slice(0, 3)
  const rest = ids.slice(3)

  return (
    <div>
      <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-2 rounded-[26px] bg-white/12 p-2.5 backdrop-blur-2xl">
        {direct.map((id) => (
          <LibraryMiniIcon key={id} id={id} onOpen={onOpenApp} />
        ))}
        {rest.length > 0 ? (
          <button
            type="button"
            onClick={onExpand}
            aria-label={`Open ${label}`}
            className="grid grid-cols-2 grid-rows-2 gap-[3px] rounded-full bg-black/25 p-2"
          >
            {rest.slice(0, 4).map((id) => (
              <AppIcon key={id} id={id} className="h-full w-full" />
            ))}
          </button>
        ) : (
          <button
            type="button"
            onClick={onExpand}
            aria-label={`Open ${label}`}
            className="grid place-items-center rounded-full bg-black/25 text-[15px] text-white/70"
          >
            ⋯
          </button>
        )}
      </div>
      <p className="mt-2 truncate px-1 text-center text-[11.5px] text-white/70">{label}</p>
    </div>
  )
}

function LibraryMiniIcon({
  id,
  onOpen,
}: {
  id: AppId
  onOpen: (id: AppId, element: HTMLElement | null) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <button
      ref={ref}
      type="button"
      aria-label={apps[id].name}
      onClick={() => onOpen(id, ref.current)}
      className="active:scale-90 transition-transform"
    >
      <AppIcon id={id} className="h-full w-full" />
    </button>
  )
}

function LibraryIcon({
  id,
  onOpen,
}: {
  id: AppId
  onOpen: (id: AppId, element: HTMLElement | null) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(id, ref.current)}
      className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
    >
      <AppIcon id={id} className="w-full drop-shadow-[0_4px_10px_rgba(0,0,0,.35)]" />
      <span className="max-w-full truncate text-[11px] text-white/85">{apps[id].name}</span>
    </button>
  )
}

function ResultRow({
  id,
  onOpen,
}: {
  id: AppId
  onOpen: (id: AppId, element: HTMLElement | null) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <li>
      <button
        ref={ref}
        type="button"
        onClick={() => onOpen(id, ref.current)}
        className={cn(
          'flex w-full items-center gap-3 rounded-[14px] px-2 py-2 text-left',
          'active:bg-white/12',
        )}
      >
        <AppIcon id={id} className="h-11 w-11 shrink-0" />
        <span className="min-w-0">
          <span className="block truncate text-[15px] text-white">{apps[id].name}</span>
          <span className="block truncate text-[12.5px] text-white/55">{apps[id].title}</span>
        </span>
      </button>
    </li>
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
