'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { highlights, profile } from '@/lib/content'
import { useWindows } from '@/lib/window-store'
import { prefetchApp } from '@/lib/queries'
import { useClock, useReducedMotion } from '@/hooks'

/**
 * The widget column, in macOS's Notification Centre position: right edge,
 * under the menu bar. Widgets are 22px-cornered glass plates on a single
 * column grid, and the ones that show live state actually track it.
 */
export function Widgets() {
  const reduced = useReducedMotion()

  return (
    <div className="pointer-events-none absolute right-5 top-[38px] z-[1] hidden w-[172px] flex-col gap-3.5 lg:flex">
      <Widget delay={0.55} reduced={reduced}>
        <ClockWidget />
      </Widget>
      <Widget delay={0.63} reduced={reduced}>
        <StatsWidget />
      </Widget>
      <Widget delay={0.71} reduced={reduced}>
        <NowWidget />
      </Widget>
    </div>
  )
}

function Widget({
  children,
  delay,
  reduced,
}: {
  children: React.ReactNode
  delay: number
  reduced: boolean
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      className="glass pointer-events-auto overflow-hidden rounded-widget shadow-dock"
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────── clock ───────────────────────── */

function ClockWidget() {
  const now = useClock()
  const reduced = useReducedMotion()
  const [seconds, setSeconds] = useState(0)

  // The minute hand comes from useClock; the second hand needs its own beat.
  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => setSeconds(new Date().getSeconds()), 1000)
    return () => clearInterval(timer)
  }, [reduced])

  const h = now ? now.getHours() % 12 : 0
  const m = now ? now.getMinutes() : 0

  return (
    <div className="flex flex-col items-center gap-2.5 p-3.5">
      <div className="relative h-[104px] w-[104px]">
        {/* face */}
        <div className="absolute inset-0 rounded-full bg-surface-solid/55 shadow-[inset_0_0_0_0.5px_var(--line)]" />

        {/* hour ticks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-[42px] w-px origin-top -translate-x-1/2"
            style={{ transform: `translate(-50%,0) rotate(${i * 30}deg)` }}
          >
            <span
              className="absolute left-1/2 top-[3px] -translate-x-1/2 rounded-full bg-ink"
              style={{
                width: i % 3 === 0 ? 2.5 : 1.5,
                height: i % 3 === 0 ? 7 : 4,
                opacity: i % 3 === 0 ? 0.75 : 0.3,
              }}
            />
          </span>
        ))}

        <Hand angle={h * 30 + m * 0.5} length={26} width={3.2} opacity={0.9} />
        <Hand angle={m * 6} length={38} width={2.4} opacity={0.9} />
        {!reduced && <Hand angle={seconds * 6} length={40} width={1.2} colour="var(--flame)" />}

        <span className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame ring-2 ring-[var(--surface-solid)]" />
      </div>

      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{profile.location}</p>
    </div>
  )
}

function Hand({
  angle,
  length,
  width,
  colour = 'var(--ink)',
  opacity = 1,
}: {
  angle: number
  length: number
  width: number
  colour?: string
  opacity?: number
}) {
  return (
    <span
      className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
      style={{
        height: length,
        width,
        background: colour,
        opacity,
        transform: `translate(-50%,-100%) rotate(${angle}deg)`,
        transformOrigin: '50% 100%',
      }}
    />
  )
}

/* ───────────────────────── stats ───────────────────────── */

/** Cycles the three headline numbers, the way a Stocks widget rotates. */
function StatsWidget() {
  const [at, setAt] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => setAt((i) => (i + 1) % highlights.length), 4200)
    return () => clearInterval(timer)
  }, [reduced])

  const stat = highlights[at]

  return (
    <div className="flex h-[132px] flex-col justify-between p-3.5">
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-faint">The record</p>

      <motion.div key={stat.value} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
        <p className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-ink">
          {stat.value}
        </p>
        <p className="mt-1 text-[12.5px] leading-tight text-ink">{stat.label}</p>
        <p className="mt-0.5 text-[11px] leading-tight text-muted">{stat.sub}</p>
      </motion.div>

      <div className="flex gap-1">
        {highlights.map((h, i) => (
          <span
            key={h.value}
            className="h-[3px] flex-1 rounded-full transition-colors duration-300"
            style={{ background: i === at ? 'var(--flame)' : 'var(--line-strong)' }}
          />
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── now ───────────────────────── */

/** A "what I'm doing" widget that doubles as the fastest route into the letter. */
function NowWidget() {
  const open = useWindows((s) => s.open)
  const queryClient = useQueryClient()

  return (
    <button
      type="button"
      onClick={() => open('letter')}
      onPointerEnter={() => prefetchApp(queryClient, 'letter')}
      className="w-full p-3.5 text-left transition-colors hover:bg-ink/[0.04]"
    >
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-[7px] w-[7px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#28C840] opacity-70" />
          <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[#28C840]" />
        </span>
        <p className="text-[10.5px] uppercase tracking-[0.16em] text-faint">Currently</p>
      </div>

      <p className="mt-2.5 text-[19px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink">
        {profile.role} at {profile.company}
      </p>
      <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
        Open to conversations. Read the letter →
      </p>
    </button>
  )
}
