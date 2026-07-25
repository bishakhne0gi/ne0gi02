'use client'

import { useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import { apps } from '@/lib/apps'
import { useWindows } from '@/lib/window-store'
import { useReducedMotion } from '@/hooks'
import { cn } from '@/lib/cn'
import type { AppId } from '@/lib/content'

const MENUBAR_H = 30

export function Window({
  id,
  children,
  /** Optional right-aligned content in the title bar (segmented controls etc). */
  toolbar,
  /** Suppress the default padded scroll container — app draws its own chrome. */
  bare,
  /** Force a dark title bar, the way Terminal carries its profile up top. */
  darkChrome,
}: {
  id: AppId
  children: React.ReactNode
  toolbar?: React.ReactNode
  bare?: boolean
  darkChrome?: boolean
}) {
  const win = useWindows((s) => s.windows[id])
  const focused = useWindows((s) => s.focused === id)
  const focus = useWindows((s) => s.focus)
  const close = useWindows((s) => s.close)
  const move = useWindows((s) => s.move)
  const resize = useWindows((s) => s.resize)
  const toggleMinimize = useWindows((s) => s.toggleMinimize)
  const toggleMaximize = useWindows((s) => s.toggleMaximize)
  const reduced = useReducedMotion()

  const meta = apps[id]
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const grip = useRef<{ x: number; y: number; w: number; h: number } | null>(null)

  /* ── drag by the title bar ── */
  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (win.maximized) return
      if ((e.target as HTMLElement).closest('[data-no-drag]')) return
      e.currentTarget.setPointerCapture(e.pointerId)
      drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y }
    },
    [win.x, win.y, win.maximized],
  )

  const onTitlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current) return
      const x = e.clientX - drag.current.dx
      const y = e.clientY - drag.current.dy
      move(
        id,
        clamp(x, -win.w + 120, window.innerWidth - 120),
        clamp(y, MENUBAR_H, window.innerHeight - 48),
      )
    },
    [id, move, win.w],
  )

  const endTitleDrag = useCallback((e: React.PointerEvent) => {
    drag.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId)
  }, [])

  /* ── resize from the bottom-right grip ── */
  const onGripPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)
      grip.current = { x: e.clientX, y: e.clientY, w: win.w, h: win.h }
    },
    [win.w, win.h],
  )

  const onGripPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!grip.current) return
      const { x, y, w, h } = grip.current
      resize(id, {
        x: win.x,
        y: win.y,
        w: clamp(w + (e.clientX - x), meta.minSize.w, window.innerWidth - win.x - 8),
        h: clamp(h + (e.clientY - y), meta.minSize.h, window.innerHeight - win.y - 8),
      })
    },
    [id, resize, win.x, win.y, meta.minSize.w, meta.minSize.h],
  )

  const endGrip = useCallback((e: React.PointerEvent) => {
    grip.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId)
  }, [])

  return (
    <motion.section
      role="dialog"
      aria-label={meta.title}
      initial={reduced ? false : { opacity: 0, scale: 0.94, y: 14 }}
      animate={
        win.minimized
          ? { opacity: 0, scale: 0.34, y: 260, pointerEvents: 'none' as const }
          : { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' as const }
      }
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
      transition={
        reduced
          ? { duration: 0.01 }
          : { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }
      }
      onPointerDownCapture={() => focus(id)}
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        transformOrigin: 'center bottom',
        boxShadow: focused ? 'var(--shadow-window)' : 'var(--shadow-window-idle)',
      }}
      className="absolute flex flex-col overflow-hidden rounded-window bg-[var(--window)] ring-[0.5px] ring-[var(--glass-edge)] backdrop-blur-2xl"
    >
      {/* ── title bar ── */}
      <header
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={endTitleDrag}
        onPointerCancel={endTitleDrag}
        onDoubleClick={() => toggleMaximize(id)}
        className={cn(
          'group/bar relative flex h-[38px] shrink-0 items-center gap-2 px-3 select-none hairline-b bg-[var(--titlebar)]',
          win.maximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
          darkChrome && 'bg-[#20222899] [--line:rgb(255_255_255/0.12)]',
        )}
      >
        <div data-no-drag className="flex items-center gap-2">
          <TrafficLight color="var(--tl-close)" label="Close" onClick={() => close(id)} glyph="close" dim={!focused} />
          <TrafficLight color="var(--tl-min)" label="Minimise" onClick={() => toggleMinimize(id)} glyph="min" dim={!focused} />
          <TrafficLight color="var(--tl-max)" label="Maximise" onClick={() => toggleMaximize(id)} glyph="max" dim={!focused} />
        </div>

        <span
          className={cn(
            'pointer-events-none absolute inset-x-0 text-center text-[13px] font-medium tracking-[-0.005em] transition-opacity',
            darkChrome
              ? focused
                ? 'text-[#E8EDF3] opacity-100'
                : 'text-[#8A919C] opacity-80'
              : focused
                ? 'text-ink opacity-100'
                : 'text-muted opacity-70',
          )}
        >
          {meta.title}
        </span>

        <div className="ml-auto" data-no-drag>
          {toolbar}
        </div>
      </header>

      {/* ── content ── */}
      <div
        className={cn(
          'scroll-area relative min-h-0 flex-1',
          bare ? 'overflow-hidden' : 'overflow-y-auto',
        )}
      >
        {children}
      </div>

      {/* ── resize grip ── */}
      {!win.maximized && (
        <div
          onPointerDown={onGripPointerDown}
          onPointerMove={onGripPointerMove}
          onPointerUp={endGrip}
          onPointerCancel={endGrip}
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize touch-none"
        />
      )}
    </motion.section>
  )
}

function TrafficLight({
  color,
  label,
  onClick,
  glyph,
  dim,
}: {
  color: string
  label: string
  onClick: () => void
  glyph: 'close' | 'min' | 'max'
  dim: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{ background: dim ? 'var(--line-strong)' : color }}
      className="grid h-[12px] w-[12px] place-items-center rounded-full ring-[0.5px] ring-black/12 transition-colors"
    >
      <svg
        viewBox="0 0 12 12"
        className="h-[12px] w-[12px] opacity-0 transition-opacity duration-100 group-hover/bar:opacity-60"
        aria-hidden="true"
      >
        {glyph === 'close' && (
          <path d="M4 4l4 4M8 4l-4 4" stroke="#4d0f08" strokeWidth="1.4" strokeLinecap="round" />
        )}
        {glyph === 'min' && <path d="M3.5 6h5" stroke="#5c3d02" strokeWidth="1.4" strokeLinecap="round" />}
        {glyph === 'max' && (
          <path
            d="M4.2 7.8V4.2h3.6"
            fill="none"
            stroke="#0a3d12"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  )
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max))
}
