'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { RichText } from '@/components/ui/RichText'
import { ErrorState, Loading } from '@/components/ui/Loading'
import { letterQuery } from '@/lib/queries'
import { profile } from '@/lib/content'
import { useReducedMotion } from '@/hooks'
import { cn } from '@/lib/cn'
import type { LetterBlock } from '@/lib/content'

/** Notes' yellow, used only for selection and the folder marks. */
const NOTES_YELLOW = '#E6A500'

/**
 * The letter, staged inside Notes.app: folder rail, note list, and the
 * note itself. The middle column doubles as a live table of contents:
 * it tracks which paragraph you are reading and jumps you to any other.
 */
export function LetterApp({ fullscreen = false }: { fullscreen?: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()
  const [reading, setReading] = useState(0)

  const { data, isPending, isError, refetch } = useQuery(letterQuery)

  /* Lenis drives scroll inside this note only. One instance, one rAF. */
  useEffect(() => {
    if (reduced || !wrapper.current || !content.current) return

    const lenis = new Lenis({
      wrapper: wrapper.current,
      content: content.current,
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced, isPending])

  const jumpTo = useCallback((id: string) => {
    const target = document.getElementById(`block-${id}`)
    const scroller = wrapper.current
    if (!target || !scroller) return

    const top = target.offsetTop - 28
    if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 0.9 })
    else scroller.scrollTo({ top })
  }, [])

  if (isPending) return <Loading label="opening the note" lines={6} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const sections = data.blocks.filter((b) => b.marginNote)

  return (
    <div className="@container flex h-full">
      {/* ── folder rail ── */}
      {!fullscreen && (
        <aside className="hidden w-[156px] shrink-0 flex-col gap-0.5 border-r border-line bg-sidebar p-2.5 backdrop-blur-xl @[760px]:flex">
          <p className="px-2 pb-1 pt-1 text-[10.5px] uppercase tracking-[0.14em] text-faint">
            iCloud
          </p>
          <FolderRow label="Notes" count={1} selected />
          <FolderRow label="Applications" count={1} />
          <FolderRow label="Drafts" count={0} />
          <FolderRow label="Recently Deleted" count={0} />
        </aside>
      )}

      {/* ── note list, doubling as a table of contents ── */}
      {!fullscreen && (
        <aside className="scroll-area hidden w-[214px] shrink-0 flex-col overflow-y-auto border-r border-line bg-sidebar backdrop-blur-xl @[600px]:flex">
          <div className="sticky top-0 z-[1] bg-[var(--titlebar)] px-3 py-2 backdrop-blur-xl">
            <p className="text-[10.5px] uppercase tracking-[0.14em] text-faint">
              {sections.length + 1} notes
            </p>
          </div>

          <NoteRow
            title="A Letter"
            preview={data.blocks[0]?.body ?? ''}
            meta={data.meta.date}
            selected={reading === 0}
            onClick={() => {
              setReading(0)
              jumpTo('salutation')
            }}
          />

          {sections.map((block, i) => (
            <NoteRow
              key={block.id}
              title={(block.marginNote ?? '').replace(/^\d+\s·\s/, '')}
              preview={block.body}
              meta={block.marginNote?.slice(0, 2)}
              selected={reading === i + 1}
              indent
              onClick={() => {
                setReading(i + 1)
                jumpTo(block.id)
              }}
            />
          ))}
        </aside>
      )}

      {/* ── the note ── */}
      <div className="@container/note flex min-w-0 flex-1 flex-col">
        {!fullscreen && <NoteToolbar />}

        <div
          ref={wrapper}
          className="scroll-area min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div
            ref={content}
            className={cn(
              'mx-auto w-full pb-24',
              fullscreen ? 'max-w-[36rem] px-6 pt-6' : 'max-w-[44rem] px-9 pt-7 @[620px]:px-14',
            )}
          >
            {/* Notes stamps every note with its date, centred and small. */}
            <p className="pb-5 text-center text-[11.5px] text-faint">
              {data.meta.place} · {data.meta.date}
            </p>

            <h1 className="text-[clamp(1.5rem,3.6cqi,2rem)] font-bold leading-[1.13] tracking-[-0.032em] text-ink">
              {data.meta.subject}
            </h1>

            <div className="mt-9 space-y-10">
              {data.blocks.map((block, i) => (
                <Block key={block.id} block={block} index={i} root={wrapper} reduced={reduced} />
              ))}
            </div>

            <SignOff reduced={reduced} root={wrapper} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────── chrome ───────────────────────────── */

function NoteToolbar() {
  return (
    <div className="flex h-[34px] shrink-0 items-center gap-1 border-b border-line px-3 text-muted">
      {['Aa', 'B', 'I', 'U'].map((t, i) => (
        <span
          key={t}
          className={cn(
            'grid h-[22px] min-w-[24px] cursor-default place-items-center rounded-[4px] text-[12.5px]',
            i === 1 && 'font-bold',
            i === 2 && 'italic',
            i === 3 && 'underline',
          )}
        >
          {t}
        </span>
      ))}
      <span className="mx-1 h-[15px] w-px bg-line" />
      <span className="cursor-default text-[12.5px]">☰</span>
      <span className="cursor-default text-[12.5px]">☑</span>
      <div className="flex-1" />
      <span className="text-[11.5px] text-faint">Edited just now</span>
    </div>
  )
}

function FolderRow({
  label,
  count,
  selected,
}: {
  label: string
  count: number
  selected?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-[6px] px-2 py-[5px] text-[13px]',
        selected ? 'bg-ink/[0.08] font-medium text-ink' : 'text-ink/80',
      )}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 7.2a2 2 0 0 1 2-2h4.3l1.9 2.1H19a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
          fill={NOTES_YELLOW}
        />
      </svg>
      <span className="flex-1 truncate">{label}</span>
      <span className="text-[11.5px] text-faint">{count || ''}</span>
    </div>
  )
}

function NoteRow({
  title,
  preview,
  meta,
  selected,
  indent,
  onClick,
}: {
  title: string
  preview: string
  meta?: string
  selected?: boolean
  indent?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'block w-full border-b border-line/60 px-3 py-2.5 text-left transition-colors',
        indent && 'pl-4',
        selected ? 'bg-[#FFD60A]/22' : 'hover:bg-ink/[0.04]',
      )}
    >
      <p className="truncate text-[12.5px] font-semibold capitalize text-ink">{title}</p>
      <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-muted">
        {plain(preview)}
      </p>
      {meta && <p className="mt-1 font-mono text-[10px] uppercase text-faint">{meta}</p>}
    </button>
  )
}

/* ───────────────────────────── blocks ───────────────────────────── */

function Block({
  block,
  index,
  root,
  reduced,
}: {
  block: LetterBlock
  index: number
  root: React.RefObject<HTMLDivElement | null>
  reduced: boolean
}) {
  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { root, once: true, margin: '0px 0px -12% 0px' },
        transition: {
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1] as const,
          delay: Math.min(index, 3) * 0.04,
        },
      }

  const anchor = `block-${block.id}`

  if (block.kind === 'salutation') {
    return (
      <motion.p
        id={anchor}
        {...reveal}
        className="text-[clamp(1.75rem,5.2cqi,2.6rem)] font-bold leading-[1.05] tracking-[-0.04em] text-ink"
      >
        {block.body}
      </motion.p>
    )
  }

  if (block.kind === 'aside') {
    return (
      <motion.blockquote
        id={anchor}
        {...reveal}
        className="rounded-[10px] bg-[#FFD60A]/12 px-5 py-4 text-[clamp(0.96rem,2.4cqi,1.08rem)] font-medium leading-[1.6] tracking-[-0.008em] text-muted shadow-[inset_2px_0_0_0_#E6A500]"
      >
        <RichText text={block.body} />
      </motion.blockquote>
    )
  }

  if (block.kind === 'signoff') {
    return (
      <motion.p
        id={anchor}
        {...reveal}
        className="pt-4 text-[clamp(1.3rem,3.4cqi,1.7rem)] font-semibold leading-[1.28] tracking-[-0.028em] text-ink"
      >
        {block.body}
      </motion.p>
    )
  }

  return (
    <motion.div id={anchor} {...reveal} className="scroll-mt-8">
      <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">
        {block.marginNote}
      </p>
      <p className="text-[clamp(0.97rem,2.45cqi,1.11rem)] leading-[1.72] tracking-[-0.009em] text-ink/92">
        <RichText text={block.body} />
      </p>
    </motion.div>
  )
}

/* ───────────────────────────── sign-off ───────────────────────────── */

/**
 * The close of the letter. In place of a scanned signature it renders the
 * card Notes would attach: a monogram tile, the sender, and the two lines
 * anyone would actually use to reply.
 */
function SignOff({
  reduced,
  root,
}: {
  reduced: boolean
  root: React.RefObject<HTMLDivElement | null>
}) {
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ root, once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mt-6"
    >
      <p className="text-[clamp(1.3rem,3.4cqi,1.7rem)] font-semibold leading-[1.28] tracking-[-0.028em] text-ink">
        Yours faithfully,
      </p>

      <div className="mt-4 flex items-center gap-3.5 rounded-[12px] border border-line bg-ink/[0.035] p-3.5">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-[14px] font-semibold tracking-[0.02em] text-ink"
          style={{ background: `${NOTES_YELLOW}1F` }}
        >
          {initials}
        </span>

        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-medium text-ink">
            {profile.name} <span className="text-faint">({profile.handle})</span>
          </p>
          <p className="text-[12.5px] leading-snug text-muted">
            {profile.role}, {profile.company} · {profile.location}
          </p>
        </div>

        <div className="ml-auto hidden shrink-0 flex-col items-end gap-0.5 @[520px]/note:flex">
          <a
            href={`mailto:${profile.email}`}
            className="font-mono text-[11px] text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            {profile.email}
          </a>
          <a
            href={`https://x.com/${profile.handle}`}
            target="_blank"
            rel="me noreferrer"
            className="font-mono text-[11px] text-faint underline-offset-2 hover:text-ink hover:underline"
          >
            x.com/{profile.handle}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function plain(text: string) {
  return text
    .replace(/\[\[([^\]|]+)\|[^\]]+\]\]/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
}
