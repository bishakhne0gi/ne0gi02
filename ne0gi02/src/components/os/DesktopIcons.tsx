'use client'

import { useCallback, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { AppIcon } from '@/components/os/AppIcon'
import { APP_ORDER, apps } from '@/lib/apps'
import { prefetchApp } from '@/lib/queries'
import { useWindows } from '@/lib/window-store'
import { cn } from '@/lib/cn'
import type { AppId } from '@/lib/content'

/** The desktop's invisible grid — icons snap to it, as they do in Finder. */
const GRID_X = 96
const GRID_Y = 92
const ORIGIN = { x: 20, y: 38 }
const STORE_KEY = 'desktop-icon-positions'

type Positions = Partial<Record<AppId, { x: number; y: number }>>

function defaultPosition(index: number) {
  return { x: ORIGIN.x, y: ORIGIN.y + index * GRID_Y }
}

/** Whatever arrangement the visitor left behind, if any. */
function readPositions(): Positions {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as Positions) : {}
  } catch {
    return {}
  }
}

/** Drag-and-drop desktop shortcuts. Positions snap to the grid and persist. */
export function DesktopIcons() {
  const shortcuts = APP_ORDER.filter((id) => apps[id].onDesktop)

  const [selected, setSelected] = useState<AppId | null>(null)
  // Read during the first render — this only ever runs on the client, since
  // the whole desktop is mounted after hydration.
  const [positions, setPositions] = useState<Positions>(readPositions)
  const [dragging, setDragging] = useState<AppId | null>(null)

  const open = useWindows((s) => s.open)
  const queryClient = useQueryClient()
  const grab = useRef<{ dx: number; dy: number } | null>(null)

  const persist = useCallback((next: Positions) => {
    setPositions(next)
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next))
    } catch {
      /* private mode — the arrangement just won't survive a reload */
    }
  }, [])

  const positionOf = (id: AppId, index: number) => positions[id] ?? defaultPosition(index)

  return (
    <div
      className="absolute inset-0 z-[1]"
      onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
    >
      {shortcuts.map((id, i) => {
        const pos = positionOf(id, i)
        const isDragging = dragging === id

        return (
          <motion.button
            key={id}
            type="button"
            initial={{ opacity: 0, x: pos.x - 10, y: pos.y }}
            animate={{ opacity: 1, x: pos.x, y: pos.y }}
            transition={
              isDragging
                ? { duration: 0 }
                : { delay: 0.45 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            }
            style={{ position: 'absolute', top: 0, left: 0, touchAction: 'none' }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              setSelected(id)
              grab.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
            }}
            onPointerMove={(e) => {
              if (!grab.current) return
              // Only treat it as a drag once the pointer has actually moved,
              // so a plain click still selects rather than nudging the icon.
              const nx = e.clientX - grab.current.dx
              const ny = e.clientY - grab.current.dy
              if (!isDragging && Math.abs(nx - pos.x) < 4 && Math.abs(ny - pos.y) < 4) return

              setDragging(id)
              setPositions((prev) => ({
                ...prev,
                [id]: {
                  x: Math.max(4, Math.min(nx, window.innerWidth - 100)),
                  y: Math.max(32, Math.min(ny, window.innerHeight - 130)),
                },
              }))
            }}
            onPointerUp={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId)
              }
              grab.current = null
              if (!isDragging) return

              // Snap to the grid on release.
              const current = positions[id] ?? pos
              persist({
                ...positions,
                [id]: {
                  x: Math.round((current.x - ORIGIN.x) / GRID_X) * GRID_X + ORIGIN.x,
                  y: Math.round((current.y - ORIGIN.y) / GRID_Y) * GRID_Y + ORIGIN.y,
                },
              })
              setDragging(null)
            }}
            onDoubleClick={() => open(id)}
            onPointerEnter={() => prefetchApp(queryClient, id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open(id)}
            className={cn(
              'flex w-[88px] cursor-default flex-col items-center gap-1.5 rounded-lg px-1.5 pb-1.5 pt-2 text-center outline-none',
              isDragging && 'z-10 opacity-80',
              selected === id && !isDragging && 'bg-white/[0.14]',
            )}
          >
            <AppIcon
              id={id}
              className="pointer-events-none h-12 w-12 drop-shadow-[0_3px_8px_rgba(0,0,0,.45)]"
            />
            <span
              className={cn(
                'pointer-events-none rounded px-1 text-[11.5px] leading-tight tracking-[-0.005em]',
                selected === id
                  ? 'bg-accent text-white'
                  : 'text-white [text-shadow:0_1px_4px_rgb(0_0_0/.9)]',
              )}
            >
              {apps[id].name}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
