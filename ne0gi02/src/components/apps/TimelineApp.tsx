'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
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
  { id: 'education', label: 'Education' },
  { id: 'recognition', label: 'Recognition' },
]

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
      {/* segmented control */}
      <div className="sticky top-0 z-10 glass-thin flex gap-1 px-5 py-2.5 hairline-b">
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

      <ol className="relative px-5 py-7 @[520px]:px-9">
        {/* the spine */}
        <span
          aria-hidden="true"
          className="absolute bottom-10 left-[2.55rem] top-10 w-px bg-line @[520px]:left-[3.55rem]"
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
      className="relative grid grid-cols-[2.6rem_1fr] gap-4 pb-7 last:pb-0 @[520px]:grid-cols-[3.6rem_1fr] @[520px]:gap-6"
    >
      {/* node */}
      <div className="relative z-[1] mt-0.5 grid h-[2.6rem] w-[2.6rem] place-items-center overflow-hidden rounded-full bg-surface-solid ring-[0.5px] ring-line-strong @[520px]:h-[3.6rem] @[520px]:w-[3.6rem]">
        {entry.logo ? (
          <Image
            src={entry.logo}
            alt=""
            width={72}
            height={72}
            className="h-full w-full object-contain p-1.5"
          />
        ) : (
          <span className="h-2 w-2 rounded-full bg-flame" />
        )}
      </div>

      <div className="min-w-0 pt-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-flame">{entry.year}</p>

        <h3 className="mt-1 font-serif text-[clamp(1.1rem,3cqi,1.35rem)] leading-tight tracking-[-0.015em] text-ink">
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
        {entry.detail && <p className="mt-1 text-[13px] text-faint">{entry.detail}</p>}
      </div>
    </motion.li>
  )
}
