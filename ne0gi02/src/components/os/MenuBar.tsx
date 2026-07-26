'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  AppleLogo,
  BatteryGlyph,
  ControlCentreGlyph,
  SearchGlyph,
  WifiGlyph,
} from '@/components/os/SystemGlyphs'
import { ControlCentre } from '@/components/os/ControlCentre'
import { apps } from '@/lib/apps'
import { useWindows } from '@/lib/window-store'
import { useSystem } from '@/lib/system-store'
import { useClock } from '@/hooks'
import { cn } from '@/lib/cn'
import { profile } from '@/lib/content'

export function MenuBar() {
  const focused = useWindows((s) => s.focused)
  const windows = useWindows((s) => s.windows)
  const open = useWindows((s) => s.open)
  const closeApp = useWindows((s) => s.close)
  const closeAll = useWindows((s) => s.closeAll)
  const toggleMaximize = useWindows((s) => s.toggleMaximize)

  const popover = useSystem((s) => s.popover)
  const setPopover = useSystem((s) => s.setPopover)
  const brightness = useSystem((s) => s.brightness)
  const setBrightness = useSystem((s) => s.setBrightness)

  const now = useClock()
  const barRef = useRef<HTMLDivElement>(null)

  const active = focused && windows[focused]?.open && !windows[focused]?.minimized ? focused : null
  const appName = active ? apps[active].name : 'Finder'

  /* dismiss on outside click or Escape */
  useEffect(() => {
    if (!popover) return
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setPopover(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPopover(null)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [popover, setPopover])

  return (
    <div
      ref={barRef}
      className="menubar fixed inset-x-0 top-0 z-[9000] flex h-[26px] items-center gap-0.5 px-2 text-[13px] text-ink select-none"
    >
      {/* ── the Apple menu ── */}
      <Menu id="apple" width={228} label={<AppleLogo size={15} />} narrow>
        <Item onSelect={() => open('about')}>About This Developer</Item>
        <Sep />
        <Item onSelect={() => open('letter')}>Read the Letter…</Item>
        <Item onSelect={() => window.open(profile.resumeUrl, '_blank', 'noopener')}>
          Résumé…
        </Item>
        <Sep />
        <Item onSelect={closeAll}>Close All Windows</Item>
      </Menu>

      {/* ── the focused app's menus ── */}
      <Menu id="app" width={216} label={<span className="font-semibold">{appName}</span>}>
        <Item onSelect={() => open('about')}>About {appName}</Item>
        <Sep />
        <Item onSelect={() => active && toggleMaximize(active)} shortcut="⌃⌘F" disabled={!active}>
          Enter Full Screen
        </Item>
        <Item onSelect={() => active && closeApp(active)} shortcut="⌘W" disabled={!active}>
          Close Window
        </Item>
      </Menu>

      {/* Inert on purpose: the OS fiction shouldn't promise interactions it
          can't keep, so these read as labels rather than menus. */}
      <div className="hidden items-center text-ink/85 sm:flex">
        {(active ? apps[active].menus : ['File', 'Edit', 'View', 'Go']).map((m) => (
          <span key={m} className="cursor-default rounded px-2 py-[2px]">
            {m}
          </span>
        ))}
      </div>

      <div className="flex-1" />

      {/* ── status items ── */}
      <div className="flex items-center gap-0.5">
        <StatusItem label="Wi-Fi" onClick={() => setPopover(popover === 'cc' ? null : 'cc')}>
          <WifiGlyph size={16} />
        </StatusItem>

        <span className="px-1.5 text-ink/85">
          <BatteryGlyph percent={82} width={25} />
        </span>

        <StatusItem label="Search">
          <SearchGlyph size={15} />
        </StatusItem>

        <StatusItem
          label="Control Centre"
          onClick={() => setPopover(popover === 'cc' ? null : 'cc')}
          active={popover === 'cc'}
        >
          <ControlCentreGlyph size={16} />
        </StatusItem>

        <time
          className="shrink-0 whitespace-nowrap px-1.5 tabular-nums text-ink/90"
          dateTime={now?.toISOString()}
          suppressHydrationWarning
        >
          {now ? formatClock(now) : ' '}
        </time>
      </div>

      <Popover id="cc" width={302}>
        <ControlCentre brightness={brightness} onBrightness={setBrightness} />
      </Popover>
    </div>
  )
}

/* ────────────────────────────── parts ────────────────────────────── */

function StatusItem({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'grid h-[20px] min-w-[24px] place-items-center rounded-[4px] px-1 text-ink/85 transition-colors',
        active ? 'bg-accent text-white' : 'hover:bg-ink/10',
      )}
    >
      {children}
    </button>
  )
}

function Menu({
  id,
  label,
  width,
  narrow,
  children,
}: {
  id: string
  label: React.ReactNode
  width: number
  narrow?: boolean
  children: React.ReactNode
}) {
  const popover = useSystem((s) => s.popover)
  const setPopover = useSystem((s) => s.setPopover)
  const isOpen = popover === id

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setPopover(isOpen ? null : id)}
        // Once one menu is open, sliding across the bar opens the next,
        // exactly how the real menu bar behaves.
        onPointerEnter={() => popover && popover !== 'cc' && setPopover(id)}
        className={cn(
          'flex h-[20px] items-center rounded-[4px] transition-colors',
          narrow ? 'px-2' : 'px-2.5',
          isOpen ? 'bg-accent text-white' : 'hover:bg-ink/10',
        )}
      >
        {label}
      </button>

      <Dropdown open={isOpen} width={width} onDismiss={() => setPopover(null)}>
        {children}
      </Dropdown>
    </div>
  )
}

function Popover({
  id,
  width,
  children,
}: {
  id: string
  width: number
  children: React.ReactNode
}) {
  const popover = useSystem((s) => s.popover)
  return (
    <AnimatePresence>
      {popover === id && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.11 } }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ width, transformOrigin: 'top right' }}
          className="glass-thick absolute right-2 top-[30px] rounded-[17px]"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Dropdown({
  open,
  width,
  onDismiss,
  children,
}: {
  open: boolean
  width: number
  onDismiss: () => void
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="menu"
          initial={{ opacity: 0, y: -4, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.985, transition: { duration: 0.09 } }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ width, transformOrigin: 'top left' }}
          onClick={onDismiss}
          className="glass-thick absolute left-0 top-[22px] rounded-[8px] p-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Item({
  children,
  onSelect,
  shortcut,
  disabled,
}: {
  children: React.ReactNode
  onSelect: () => void
  shortcut?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center justify-between gap-6 rounded-[5px] px-2.5 py-[4px] text-left text-[13px] transition-colors',
        disabled ? 'text-faint' : 'text-ink hover:bg-accent hover:text-white',
      )}
    >
      <span>{children}</span>
      {shortcut && <span className="text-[12px] opacity-55">{shortcut}</span>}
    </button>
  )
}

function Sep() {
  return <div className="my-1 h-px bg-line" />
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
