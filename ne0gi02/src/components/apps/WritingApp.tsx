'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { ErrorState, Loading } from '@/components/ui/Loading'
import { writingQuery } from '@/lib/queries'
import { cn } from '@/lib/cn'
import type { Piece } from '@/lib/content'

const KIND_LABEL: Record<Piece['kind'], string> = {
  article: 'Article',
  thread: 'Thread',
  note: 'Note',
}

const KIND_TONE: Record<Piece['kind'], string> = {
  article: 'var(--flame)',
  thread: '#F5A524',
  note: 'var(--accent)',
}

/**
 * Writing — the build-in-public posts and articles from x.com/ne0gi02,
 * staged as a reader: a list of pieces on the left, the piece on the right.
 */
export function WritingApp({ fullscreen = false }: { fullscreen?: boolean }) {
  const { data, isPending, isError, refetch } = useQuery(writingQuery)
  const [openId, setOpenId] = useState<string | null>(null)

  if (isPending) return <Loading label="fetching the feed" lines={5} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const selected = data.find((p) => p.id === openId) ?? data[0]

  return (
    <div className="@container flex h-full">
      {/* ── the list ── */}
      <aside
        className={cn(
          'scroll-area shrink-0 overflow-y-auto border-r border-line bg-sidebar backdrop-blur-xl',
          fullscreen ? 'w-full' : 'hidden w-[248px] @[620px]:block',
        )}
      >
        <div className="sticky top-0 z-[1] bg-[var(--titlebar)] px-3.5 py-2.5 backdrop-blur-xl">
          <p className="text-[10.5px] uppercase tracking-[0.16em] text-faint">
            {data.length} pieces
          </p>
        </div>

        {data.map((piece) => (
          <button
            key={piece.id}
            type="button"
            onClick={() => setOpenId(piece.id)}
            className={cn(
              'block w-full border-b border-line/60 px-3.5 py-3 text-left transition-colors',
              selected?.id === piece.id ? 'bg-accent/18' : 'hover:bg-ink/[0.05]',
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className="h-[6px] w-[6px] shrink-0 rounded-full"
                style={{ background: KIND_TONE[piece.kind] }}
              />
              <span className="text-[10px] uppercase tracking-[0.14em] text-faint">
                {KIND_LABEL[piece.kind]} · {piece.date}
              </span>
            </span>
            <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-ink">
              {piece.title}
            </p>
            <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted">
              {piece.excerpt}
            </p>
          </button>
        ))}
      </aside>

      {/* ── the piece ── */}
      {!fullscreen && (
        <div className="scroll-area @container min-w-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.article
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-[42rem] px-8 py-9 @[620px]:px-12"
              >
                <p className="text-[10.5px] uppercase tracking-[0.16em] text-flame">
                  {KIND_LABEL[selected.kind]} · {selected.date}
                </p>

                <h2 className="mt-3 font-serif text-[clamp(1.6rem,4.4cqi,2.3rem)] leading-[1.1] tracking-[-0.025em] text-ink">
                  {selected.title}
                </h2>

                <div className="mt-6 space-y-4">
                  {selected.body.map((para) => (
                    <p
                      key={para.slice(0, 24)}
                      className="font-serif text-[clamp(1rem,2.5cqi,1.16rem)] leading-[1.7] text-ink/92"
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-sunken px-2.5 py-1 font-mono text-[11.5px] text-muted ring-[0.5px] ring-line"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={selected.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-[13px] text-ink transition-colors hover:bg-sunken"
                >
                  Read it on X ↗
                </a>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
