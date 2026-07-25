'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppIcon } from '@/components/os/AppIcon'
import { BatteryGlyph, WifiGlyph } from '@/components/os/SystemGlyphs'
import { AppSurface } from '@/components/apps'
import { APP_ORDER, apps } from '@/lib/apps'
import { useClock, useReducedMotion } from '@/hooks'
import { profile } from '@/lib/content'
import type { AppId } from '@/lib/content'

const HOME_APPS: AppId[] = ['letter', 'projects', 'timeline', 'terminal', 'gallery', 'about']
const DOCK_APPS: AppId[] = ['letter', 'projects', 'contact']

/**
 * A different scene, not a shrunk desktop: an iOS home screen. Apps launch
 * from the grid with the icon-expand transition, and the home indicator
 * takes you back — the interaction model a phone already has.
 */
export function Handheld() {
  const [open, setOpen] = useState<AppId | null>(null)
  const reduced = useReducedMotion()

  return (
    <main className="fixed inset-0 flex flex-col overflow-hidden">
      <StatusBar appName={open ? apps[open].name : null} />

      <div className="relative min-h-0 flex-1">
        <AnimatePresence initial={false}>
          {open ? (
            <motion.section
              key={open}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 26 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 18 }}
              transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.7 }}
              className="glass absolute inset-0 overflow-hidden rounded-t-[18px]"
            >
              <AppSurface id={open} fullscreen />
            </motion.section>
          ) : (
            <motion.div
              key="home"
              initial={reduced ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col px-6 pt-6"
            >
              {/* the name plate, where iOS puts its widget */}
              <div className="glass mb-7 rounded-widget p-4">
                <p className="text-[10.5px] uppercase tracking-[0.16em] text-faint">Currently</p>
                <p className="mt-1.5 font-serif text-[21px] leading-tight tracking-[-0.02em] text-ink">
                  {profile.role} at {profile.company}
                </p>
                <p className="mt-1 text-[12px] text-muted">
                  {profile.location} · tap Notes to read the letter
                </p>
              </div>

              <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                {HOME_APPS.map((id, i) => (
                  <HomeIcon key={id} id={id} index={i} onOpen={() => setOpen(id)} reduced={reduced} />
                ))}
              </div>

              <div className="flex-1" />

              {/* the iOS dock */}
              <div className="glass mb-3 flex justify-around rounded-[26px] px-3 py-3">
                {DOCK_APPS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={apps[id].name}
                    onClick={() => setOpen(id)}
                    className="w-[58px]"
                  >
                    <AppIcon
                      id={id}
                      className="h-[54px] w-[54px] drop-shadow-[0_3px_6px_rgba(0,0,0,.3)]"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* home indicator — swipe target and back button in one */}
      <div className="flex shrink-0 justify-center pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2">
        <button
          type="button"
          onClick={() => setOpen(null)}
          aria-label={open ? 'Close app' : 'Home'}
          className="h-[5px] w-[136px] rounded-full bg-ink/45 transition-colors active:bg-ink/70"
        />
      </div>
    </main>
  )
}

function HomeIcon({
  id,
  index,
  onOpen,
  reduced,
}: {
  id: AppId
  index: number
  onOpen: () => void
  reduced: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={reduced ? false : { opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center gap-1.5"
    >
      <AppIcon id={id} className="h-[58px] w-[58px] drop-shadow-[0_3px_7px_rgba(0,0,0,.34)]" />
      <span className="truncate text-[11px] leading-none text-ink [text-shadow:0_1px_3px_rgb(0_0_0/.5)]">
        {apps[id].name}
      </span>
    </motion.button>
  )
}

function StatusBar({ appName }: { appName: string | null }) {
  const now = useClock()

  return (
    <header className="flex h-11 shrink-0 items-center justify-between px-6 pt-1 text-[13px] font-semibold text-ink">
      <time suppressHydrationWarning className="tabular-nums">
        {now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ' '}
      </time>

      {appName && (
        <span className="text-[12px] font-medium text-muted">{appName}</span>
      )}

      <span className="flex items-center gap-1.5">
        <WifiGlyph size={15} />
        <BatteryGlyph percent={82} width={24} />
      </span>
    </header>
  )
}

/** Keeps the app registry honest if an id is ever added to content. */
export const HANDHELD_APPS = APP_ORDER
