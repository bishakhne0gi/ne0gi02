'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { gallery, highlights, profile } from '@/lib/content'
import { useClock, useReducedMotion } from '@/hooks'
import { cn } from '@/lib/cn'
import type { WidgetItem, WidgetSize } from '@/lib/ios-store'
import type { AppId } from '@/lib/content'

/** Which app a widget belongs to, so tapping it launches the right thing. */
export const WIDGET_APP: Record<WidgetItem['widget'], AppId> = {
  clock: 'timeline',
  record: 'projects',
  currently: 'letter',
  photos: 'gallery',
}

export const WIDGET_LABEL: Record<WidgetItem['widget'], string> = {
  clock: 'Clock',
  record: 'The Record',
  currently: 'Currently',
  photos: 'Photos',
}

/**
 * Home screen widgets. Each one has to say something true at every size,
 * so they are written as three layouts rather than one layout scaled.
 */
export function IosWidget({ item }: { item: WidgetItem }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-[22px] bg-black/28 shadow-[0_10px_28px_-10px_rgba(0,0,0,.6)] backdrop-blur-2xl backdrop-saturate-150 [box-shadow:inset_0_0.5px_0_0_rgb(255_255_255/.14),0_10px_28px_-10px_rgb(0_0_0/.6)]">
      {item.widget === 'clock' && <ClockWidget size={item.size} />}
      {item.widget === 'record' && <RecordWidget size={item.size} />}
      {item.widget === 'currently' && <CurrentlyWidget size={item.size} />}
      {item.widget === 'photos' && <PhotosWidget size={item.size} />}
    </div>
  )
}

/* ───────────────────────────── clock ───────────────────────────── */

function ClockWidget({ size }: { size: WidgetSize }) {
  const now = useClock()
  const reduced = useReducedMotion()
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => setSeconds(new Date().getSeconds()), 1000)
    return () => clearInterval(timer)
  }, [reduced])

  const hours = now ? now.getHours() % 12 : 0
  const minutes = now ? now.getMinutes() : 0

  const face = (
    <div className="relative aspect-square h-full max-h-full">
      <div className="absolute inset-0 rounded-full bg-white/[0.06] shadow-[inset_0_0_0_0.5px_rgb(255_255_255/.16)]" />
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top -translate-x-1/2"
          style={{ transform: `translate(-50%,0) rotate(${i * 30}deg)` }}
        >
          <span
            className="absolute left-1/2 top-[8%] -translate-x-1/2 rounded-full bg-white"
            style={{
              width: i % 3 === 0 ? 2.6 : 1.6,
              height: i % 3 === 0 ? 7 : 4,
              opacity: i % 3 === 0 ? 0.85 : 0.32,
            }}
          />
        </span>
      ))}
      <Hand angle={hours * 30 + minutes * 0.5} length="26%" width={3.4} />
      <Hand angle={minutes * 6} length="38%" width={2.6} />
      {!reduced && <Hand angle={seconds * 6} length="41%" width={1.3} colour="var(--flame)" />}
      <span className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame" />
    </div>
  )

  if (size === 'small') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-3">
        <div className="min-h-0 flex-1">{face}</div>
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">Bengaluru</p>
      </div>
    )
  }

  return (
    <div className="flex h-full items-center gap-5 p-4">
      <div className="h-full py-1">{face}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">{profile.location}</p>
        <p
          suppressHydrationWarning
          className="mt-1 text-[34px] font-semibold leading-none tracking-[-0.04em] text-white tabular-nums"
        >
          {now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ' '}
        </p>
        <p suppressHydrationWarning className="mt-1.5 text-[12.5px] text-white/60">
          {now
            ? now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
            : ' '}
        </p>
        {size === 'large' && (
          <p className="mt-4 text-[12.5px] leading-snug text-white/55">
            Written from {profile.origin}, shipped from {profile.location}. Tap for the curriculum.
          </p>
        )}
      </div>
    </div>
  )
}

function Hand({
  angle,
  length,
  width,
  colour = '#fff',
}: {
  angle: number
  length: string
  width: number
  colour?: string
}) {
  return (
    <span
      className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
      style={{
        height: length,
        width,
        background: colour,
        transform: `translate(-50%,-100%) rotate(${angle}deg)`,
        transformOrigin: '50% 100%',
      }}
    />
  )
}

/* ───────────────────────────── the record ───────────────────────────── */

function RecordWidget({ size }: { size: WidgetSize }) {
  const [at, setAt] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || size !== 'small') return
    const timer = setInterval(() => setAt((i) => (i + 1) % highlights.length), 4200)
    return () => clearInterval(timer)
  }, [reduced, size])

  if (size === 'small') {
    const stat = highlights[at]
    return (
      <div className="flex h-full flex-col justify-between p-3.5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">The record</p>
        <motion.div
          key={stat.value}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-white">
            {stat.value}
          </p>
          <p className="mt-1 text-[11.5px] leading-tight text-white/80">{stat.label}</p>
        </motion.div>
        <div className="flex gap-1">
          {highlights.map((h, i) => (
            <span
              key={h.value}
              className="h-[3px] flex-1 rounded-full transition-colors duration-300"
              style={{ background: i === at ? 'var(--flame)' : 'rgb(255 255 255 / 0.22)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col p-4">
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">The record</p>
      <div className="mt-auto grid grid-cols-3 gap-3">
        {highlights.map((stat) => (
          <div key={stat.value}>
            <p className="text-[26px] font-semibold leading-none tracking-[-0.04em] text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] leading-tight text-white/70">{stat.label}</p>
            {size === 'large' && (
              <p className="mt-0.5 text-[10.5px] leading-tight text-white/45">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────────── currently ───────────────────────────── */

function CurrentlyWidget({ size }: { size: WidgetSize }) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-[7px] w-[7px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#30D158] opacity-70" />
          <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[#30D158]" />
        </span>
        <p className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">Currently</p>
      </div>

      {size !== 'small' && (
        <p className="mt-3 text-[12.5px] leading-snug text-white/45">
          {profile.titles.slice(1, 3).join(' · ')}
        </p>
      )}

      <p
        className={cn(
          'mt-auto font-semibold leading-[1.12] tracking-[-0.03em] text-white',
          size === 'small' ? 'text-[17px]' : 'text-[22px]',
        )}
      >
        {profile.role} at {profile.company}
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-white/60">
        {size === 'small' ? profile.location : 'Open to conversations. Tap to read the letter.'}
      </p>

      {size === 'large' && (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
          {profile.titles.slice(1, 5).map((title) => (
            <p key={title} className="text-[11.5px] leading-tight text-white/55">
              {title}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

/* ───────────────────────────── photos ───────────────────────────── */

function PhotosWidget({ size }: { size: WidgetSize }) {
  const shots = gallery.slice(0, size === 'small' ? 1 : size === 'medium' ? 3 : 6)

  return (
    <div className="relative h-full w-full">
      <div
        className={cn(
          'grid h-full w-full gap-px',
          size === 'small' && 'grid-cols-1',
          size === 'medium' && 'grid-cols-3',
          size === 'large' && 'grid-cols-3 grid-rows-2',
        )}
      >
        {shots.map((shot) => (
          <div key={shot.src} className="relative overflow-hidden bg-white/5">
            <Image
              src={shot.src}
              alt={shot.caption}
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3.5 pb-2.5 pt-8">
        <p className="text-[11px] font-medium text-white/90">Hall of Fame</p>
      </div>
    </div>
  )
}
