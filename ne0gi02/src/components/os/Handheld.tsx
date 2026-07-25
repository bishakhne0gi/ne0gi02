'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppIcon } from '@/components/os/AppIcon'
import { AppSurface } from '@/components/apps'
import { APP_ORDER, apps } from '@/lib/apps'
import { useClock, useTheme } from '@/hooks'
import { cn } from '@/lib/cn'
import type { AppId } from '@/lib/content'

/**
 * A different scene, not a shrunk desktop. Phones get a single fullscreen
 * app, a status bar and a tab bar — the interaction model they already have.
 */
export function Handheld() {
  const [active, setActive] = useState<AppId>('letter')
  const { theme, toggle } = useTheme()
  const now = useClock()

  const tabs = APP_ORDER.filter((id) => id !== 'about')

  return (
    <main className="fixed inset-0 flex flex-col">
      {/* status bar */}
      <header className="glass-thin flex h-9 shrink-0 items-center justify-between px-4 text-[12.5px] hairline-b">
        <time className="tabular-nums text-ink" suppressHydrationWarning>
          {now
            ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            : ' '}
        </time>

        <span className="font-medium text-ink">{apps[active].name}</span>

        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle appearance"
          className="text-muted"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      {/* app surface */}
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 overflow-hidden"
          >
            <AppSurface id={active} fullscreen />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* tab bar */}
      <nav className="glass shrink-0 hairline-t">
        <ul className="flex items-end justify-around gap-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {tabs.map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setActive(id)}
                aria-current={active === id ? 'page' : undefined}
                className="flex w-[58px] flex-col items-center gap-1"
              >
                <AppIcon
                  id={id}
                  className={cn(
                    'h-9 w-9 transition-all duration-300',
                    active === id ? 'scale-105 opacity-100' : 'opacity-55',
                  )}
                />
                <span
                  className={cn(
                    'truncate text-[10px] leading-none transition-colors',
                    active === id ? 'text-ink' : 'text-faint',
                  )}
                >
                  {apps[id].name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  )
}
