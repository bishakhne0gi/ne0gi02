'use client'

import { useRef } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { AppIcon } from '@/components/os/AppIcon'
import { DOCK_LEFT, DOCK_RIGHT, apps } from '@/lib/apps'
import { prefetchApp } from '@/lib/queries'
import { useWindows } from '@/lib/window-store'
import { useReducedMotion } from '@/hooks'
import type { AppId } from '@/lib/content'

const BASE = 46
const PEAK = 74
/** How far along the dock the cursor's influence reaches. */
const REACH = 128

export function Dock() {
  const pointerX = useMotionValue(Number.POSITIVE_INFINITY)
  const reduced = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[8000] flex justify-center pb-3">
      <motion.div
        onPointerMove={(e) => e.pointerType === 'mouse' && pointerX.set(e.clientX)}
        onPointerLeave={() => pointerX.set(Number.POSITIVE_INFINITY)}
        className="glass pointer-events-auto flex items-end gap-2 rounded-[20px] px-3 pb-2.5 pt-2 shadow-dock ring-[0.5px] ring-line-strong"
      >
        {DOCK_LEFT.map((id) => (
          <DockItem key={id} id={id} pointerX={pointerX} reduced={reduced} />
        ))}

        <div className="mx-1 mb-1 h-11 w-px self-center bg-line-strong" />

        {DOCK_RIGHT.map((id) => (
          <DockItem key={id} id={id} pointerX={pointerX} reduced={reduced} />
        ))}
      </motion.div>
    </div>
  )
}

function DockItem({
  id,
  pointerX,
  reduced,
}: {
  id: AppId
  pointerX: MotionValue<number>
  reduced: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const queryClient = useQueryClient()

  const open = useWindows((s) => s.open)
  const focus = useWindows((s) => s.focus)
  const toggleMinimize = useWindows((s) => s.toggleMinimize)
  const win = useWindows((s) => s.windows[id])
  const focused = useWindows((s) => s.focused)

  const distance = useTransform(pointerX, (x) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return Number.POSITIVE_INFINITY
    return x - (box.left + box.width / 2)
  })

  const target = useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE], { clamp: true })
  const size = useSpring(target, { mass: 0.1, stiffness: 240, damping: 16 })
  const width = reduced ? BASE : size

  const isRunning = win.open
  const isForeground = isRunning && !win.minimized && focused === id

  function activate() {
    if (!win.open) return open(id)
    if (win.minimized) return focus(id)
    if (focused === id) return toggleMinimize(id)
    focus(id)
  }

  return (
    <div className="group/dock relative flex flex-col items-center">
      {/* tooltip */}
      <AnimatePresence>
        <motion.span
          key="tip"
          initial={false}
          className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-surface-solid px-2 py-1 text-[12px] text-ink opacity-0 shadow-window-idle ring-[0.5px] ring-line-strong transition-opacity duration-150 group-hover/dock:opacity-100"
        >
          {apps[id].name}
        </motion.span>
      </AnimatePresence>

      <motion.button
        ref={ref}
        type="button"
        aria-label={`${apps[id].name}${isRunning ? ' (open)' : ''}`}
        onClick={activate}
        onPointerEnter={() => prefetchApp(queryClient, id)}
        onFocus={() => prefetchApp(queryClient, id)}
        style={{ width, height: width }}
        whileTap={{ scale: 0.88 }}
        className="origin-bottom rounded-[22%] outline-none transition-[filter] duration-200 focus-visible:ring-2 focus-visible:ring-accent"
      >
        <AppIcon id={id} className="h-full w-full drop-shadow-sm" />
      </motion.button>

      {/* running indicator */}
      <span
        aria-hidden="true"
        className="mt-1 h-[3px] w-[3px] rounded-full transition-colors duration-200"
        style={{
          background: isRunning
            ? isForeground
              ? 'var(--flame)'
              : 'var(--ink-faint)'
            : 'transparent',
        }}
      />
    </div>
  )
}
