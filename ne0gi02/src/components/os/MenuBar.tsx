'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MoonStars, Sun } from '@phosphor-icons/react'
import { apps } from '@/lib/apps'
import { useWindows } from '@/lib/window-store'
import { useClock, useTheme } from '@/hooks'
import { cn } from '@/lib/cn'
import { profile } from '@/lib/content'

export function MenuBar() {
  const focused = useWindows((s) => s.focused)
  const windows = useWindows((s) => s.windows)
  const open = useWindows((s) => s.open)
  const closeAll = useWindows((s) => s.closeAll)
  const { theme, toggle } = useTheme()
  const now = useClock()

  const [menu, setMenu] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const active = focused && windows[focused]?.open && !windows[focused]?.minimized ? focused : null
  const appName = active ? apps[active].name : 'Desk'

  useEffect(() => {
    if (!menu) return
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setMenu(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  return (
    <div
      ref={barRef}
      className="glass-thin fixed inset-x-0 top-0 z-[9000] flex h-[30px] items-center gap-1 px-2.5 text-[13px] text-ink hairline-b select-none"
    >
      {/* ── monogram menu ── */}
      <MenuTrigger
        label={
          <span className="grid h-[17px] w-[17px] place-items-center rounded-full bg-flame font-serif text-[11px] leading-none text-white">
            b
          </span>
        }
        id="root"
        menu={menu}
        setMenu={setMenu}
      >
        <MenuItem onSelect={() => open('about')}>About This Developer</MenuItem>
        <MenuSep />
        <MenuItem onSelect={() => open('letter')}>Read the Letter</MenuItem>
        <MenuItem onSelect={() => window.open(profile.resumeUrl, '_blank', 'noopener')}>
          Résumé…
        </MenuItem>
        <MenuSep />
        <MenuItem onSelect={toggle}>
          {theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}
        </MenuItem>
        <MenuSep />
        <MenuItem onSelect={closeAll}>Close All Windows</MenuItem>
      </MenuTrigger>

      <span className="px-2 font-semibold tracking-[-0.005em]">{appName}</span>

      {/* app menus — decorative on purpose; the OS fiction shouldn't
          promise interactions it can't keep, so these are inert labels. */}
      <div className="hidden items-center gap-0.5 text-muted sm:flex">
        {(active ? apps[active].menus : ['File', 'Edit', 'View']).map((m) => (
          <span key={m} className="cursor-default rounded px-2 py-[3px]">
            {m}
          </span>
        ))}
      </div>

      <div className="flex-1" />

      {/* ── right cluster ── */}
      <div className="flex items-center gap-1 text-muted">
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance'}
          className="grid h-[22px] w-[22px] place-items-center rounded-md transition-colors hover:bg-sunken hover:text-ink"
        >
          {theme === 'dark' ? (
            <Sun size={15} weight="fill" aria-hidden />
          ) : (
            <MoonStars size={15} weight="fill" aria-hidden />
          )}
        </button>

        <a
          href={`mailto:${profile.email}`}
          className="hidden rounded-md px-2 py-[3px] transition-colors hover:bg-sunken hover:text-ink sm:block"
        >
          {profile.handle}
        </a>

        <time
          className="shrink-0 whitespace-nowrap pl-1 text-right tabular-nums"
          dateTime={now?.toISOString()}
          suppressHydrationWarning
        >
          {now ? formatClock(now) : ' '}
        </time>
      </div>
    </div>
  )
}

/* ────────────────────────────── menu parts ────────────────────────────── */

function MenuTrigger({
  id,
  label,
  menu,
  setMenu,
  children,
}: {
  id: string
  label: React.ReactNode
  menu: string | null
  setMenu: (v: string | null) => void
  children: React.ReactNode
}) {
  const isOpen = menu === id
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setMenu(isOpen ? null : id)}
        onPointerEnter={() => menu && setMenu(id)}
        className={cn(
          'flex h-[22px] items-center rounded-md px-2 transition-colors',
          isOpen ? 'bg-accent text-white' : 'hover:bg-sunken',
        )}
      >
        {label}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.985, transition: { duration: 0.09 } }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top left' }}
            onClick={() => setMenu(null)}
            className="glass absolute left-0 top-[26px] min-w-[232px] rounded-[9px] p-1.5 shadow-window ring-[0.5px] ring-line-strong"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuItem({
  children,
  onSelect,
}: {
  children: React.ReactNode
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className="block w-full rounded-[5px] px-2.5 py-[5px] text-left text-[13px] text-ink transition-colors hover:bg-accent hover:text-white"
    >
      {children}
    </button>
  )
}

function MenuSep() {
  return <div className="my-1.5 h-px bg-line" />
}

function formatClock(d: Date) {
  return d.toLocaleString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}


