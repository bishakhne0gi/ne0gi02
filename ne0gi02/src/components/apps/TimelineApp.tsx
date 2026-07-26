'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { ErrorState, Loading } from '@/components/ui/Loading'
import { timelineQuery } from '@/lib/queries'
import { cn } from '@/lib/cn'
import type { TimelineEntry } from '@/lib/content'

type Kind = 'all' | TimelineEntry['kind']

const TABS: { id: Kind; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'work', label: 'Work' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'education', label: 'Education' },
]

const DOT: Record<TimelineEntry['kind'], string> = {
  work: 'var(--flame)',
  recognition: '#F5A524',
  education: 'var(--accent)',
}

/** A curriculum vitae as a single spine, newest first. */
export function TimelineApp() {
  const [kind, setKind] = useState<Kind>('all')
  const { data, isPending, isError, refetch } = useQuery(timelineQuery)

  const entries = useMemo(
    () => (!data ? [] : kind === 'all' ? data : data.filter((e) => e.kind === kind)),
    [data, kind],
  )

  if (isPending) return <Loading label="assembling the record" lines={5} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="@container">
      <div className="sticky top-0 z-10 flex gap-1 border-b border-line bg-[var(--titlebar)] px-5 py-2.5 backdrop-blur-xl">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setKind(t.id)}
            className={cn(
              'relative rounded-full px-3 py-1 text-[12.5px] transition-colors',
              kind === t.id ? 'text-white' : 'text-muted hover:text-ink',
            )}
          >
            {kind === t.id && (
              <motion.span
                layoutId="tl-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <ol className="relative px-5 py-7 @[520px]:px-8">
        <span
          aria-hidden="true"
          className="absolute bottom-10 left-[1.44rem] top-10 w-px bg-line @[520px]:left-[2.19rem]"
        />
        {entries.map((entry, i) => (
          <Entry key={entry.id} entry={entry} index={i} />
        ))}
      </ol>
    </div>
  )
}

function Entry({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid grid-cols-[1.4rem_1fr] gap-4 pb-8 last:pb-0 @[520px]:gap-6"
    >
      <span className="relative z-[1] mt-[7px] grid h-[1.4rem] w-[1.4rem] place-items-center">
        <span
          className="h-[11px] w-[11px] rounded-full ring-4 ring-[var(--surface-solid)]"
          style={{ background: DOT[entry.kind] }}
        />
      </span>

      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-flame">
          {entry.year}
        </p>

        <h3 className="mt-1 text-[clamp(1.05rem,2.9cqi,1.3rem)] font-semibold leading-tight tracking-[-0.022em] text-ink">
          {entry.href ? (
            <a
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line-strong underline-offset-[3px] transition-colors hover:decoration-accent"
            >
              {entry.title}
            </a>
          ) : (
            entry.title
          )}
        </h3>

        <p className="mt-0.5 text-[13.5px] text-muted">{entry.org}</p>
        {entry.detail && (
          <p className="mt-1.5 max-w-[62ch] text-[13px] leading-relaxed text-faint">
            {entry.detail}
          </p>
        )}

        {entry.bullets && (
          <ul className="mt-3 space-y-1.5">
            {entry.bullets.map((b) => (
              <li
                key={b}
                className="relative max-w-[64ch] pl-4 text-[13px] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-flame"
              >
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.li>
  )
}
