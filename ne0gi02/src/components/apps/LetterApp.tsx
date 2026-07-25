'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Lenis from 'lenis'
import { motion, useScroll, useSpring } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { RichText } from '@/components/ui/RichText'
import { ErrorState, Loading } from '@/components/ui/Loading'
import { letterQuery } from '@/lib/queries'
import { profile } from '@/lib/content'
import { useReducedMotion } from '@/hooks'
import { cn } from '@/lib/cn'
import type { LetterBlock } from '@/lib/content'

/**
 * The narrative spine. Renders as an actual letter — salutation, body,
 * sign-off, signature — revealed block by block as it is scrolled.
 */
export function LetterApp({ fullscreen = false }: { fullscreen?: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { data, isPending, isError, refetch } = useQuery(letterQuery)

  /* Lenis drives scroll inside this window only. One instance, one rAF. */
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

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced, isPending])

  // `layoutEffect: false` — the wrapper only exists after the payload lands.
  const { scrollYProgress } = useScroll({ container: wrapper, layoutEffect: false })
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.4 })

  if (isPending) return <Loading label="opening the envelope" lines={6} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div ref={wrapper} className="scroll-area @container h-full overflow-y-auto overscroll-contain">
      {/* reading progress */}
      <motion.div
        style={{ scaleX: progress, transformOrigin: 'left' }}
        className="sticky top-0 z-10 h-[2px] w-full bg-flame/70"
        aria-hidden="true"
      />

      <div
        ref={content}
        className={cn(
          'mx-auto w-full pb-24',
          fullscreen ? 'max-w-[36rem] px-6 pt-8' : 'max-w-[46rem] px-8 pt-10 @[620px]:px-14',
        )}
      >
        <Letterhead meta={data.meta} />

        <div className="mt-14 space-y-11">
          {data.blocks.map((block, i) => (
            <Block key={block.id} block={block} index={i} root={wrapper} reduced={reduced} />
          ))}
        </div>

        <Signature reduced={reduced} root={wrapper} />
      </div>
    </div>
  )
}

/* ───────────────────────────── letterhead ───────────────────────────── */

function Letterhead({ meta }: { meta: { subject: string; place: string; date: string } }) {
  return (
    <header className="border-b border-line pb-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-faint">
        <span>{profile.name}</span>
        <span>
          {meta.place} · {meta.date}
        </span>
      </div>

      <p className="mt-6 font-serif text-[clamp(1.25rem,3.2cqi,1.75rem)] leading-[1.2] tracking-[-0.015em] text-ink">
        {meta.subject}
      </p>
    </header>
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
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { root, once: true, margin: '0px 0px -12% 0px' },
        transition: {
          duration: 0.72,
          ease: [0.16, 1, 0.3, 1] as const,
          delay: Math.min(index, 3) * 0.04,
        },
      }

  if (block.kind === 'salutation') {
    return (
      <motion.p
        {...reveal}
        className="font-serif text-[clamp(1.9rem,5.6cqi,2.85rem)] leading-[1.06] tracking-[-0.028em] text-ink"
      >
        {block.body}
      </motion.p>
    )
  }

  if (block.kind === 'aside') {
    return (
      <motion.blockquote
        {...reveal}
        className="border-l-2 border-flame/50 pl-5 font-serif text-[clamp(1rem,2.5cqi,1.14rem)] italic leading-[1.6] text-muted"
      >
        <RichText text={block.body} />
      </motion.blockquote>
    )
  }

  if (block.kind === 'signoff') {
    return (
      <motion.p
        {...reveal}
        className="pt-6 font-serif text-[clamp(1.3rem,3.4cqi,1.7rem)] leading-[1.3] tracking-[-0.015em] text-ink"
      >
        {block.body}
      </motion.p>
    )
  }

  return (
    <motion.div {...reveal} className="grid gap-2 @[620px]:grid-cols-[7.5rem_1fr] @[620px]:gap-8">
      <p className="pt-[0.55rem] font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.1em] text-faint @[620px]:text-right">
        {block.marginNote}
      </p>
      <p className="font-serif text-[clamp(1.02rem,2.6cqi,1.2rem)] leading-[1.68] tracking-[-0.005em] text-ink/92">
        <RichText text={block.body} />
      </p>
    </motion.div>
  )
}

/* ───────────────────────────── signature ───────────────────────────── */

function Signature({
  reduced,
  root,
}: {
  reduced: boolean
  root: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ root, once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mt-4 @[620px]:pl-[9.5rem]"
    >
      <p className="font-serif text-[clamp(1.3rem,3.4cqi,1.7rem)] leading-[1.3] tracking-[-0.015em] text-ink">
        Yours faithfully,
      </p>

      <Image
        src={profile.signature}
        alt={`${profile.name}, signed`}
        width={220}
        height={90}
        priority={false}
        className="-ml-1 mt-2 h-auto w-[190px] opacity-85 mix-blend-multiply dark:opacity-90 dark:mix-blend-screen dark:invert"
      />

      <div className="mt-3 border-t border-line pt-3">
        <p className="text-[13.5px] font-medium text-ink">{profile.name}</p>
        <p className="text-[12.5px] text-muted">
          {profile.role} · {profile.location}
        </p>
      </div>
    </motion.div>
  )
}
