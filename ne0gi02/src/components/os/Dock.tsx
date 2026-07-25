'use client'

import { useRef } from 'react'
import {
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

const BASE = 52
const PEAK = 84
/** How far along the dock the cursor's influence reaches. */
const REACH = 132

export function Dock() {
  const pointerX = useMotionValue(Number.POSITIVE_INFINITY)
  const reduced = useReducedMotion()
  const closeAll = useWindows((s) => s.closeAll)
  const order = useWindows((s) => s.order)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[8000] flex justify-center pb-2">
      <motion.div
        onPointerMove={(e) => e.pointerType === 'mouse' && pointerX.set(e.clientX)}
        onPointerLeave={() => pointerX.set(Number.POSITIVE_INFINITY)}
        className="pointer-events-auto flex h-[68px] items-end gap-2 rounded-[20px] px-2.5 pb-2"
        style={{
          background: 'rgb(28 28 32 / 0.42)',
          backdropFilter: 'blur(38px) saturate(180%)',
          WebkitBackdropFilter: 'blur(38px) saturate(180%)',
          boxShadow:
            'inset 0 0.5px 0 0 rgb(255 255 255 / 0.16), inset 0 0 0 0.5px rgb(255 255 255 / 0.1), 0 18px 44px -10px rgb(0 0 0 / 0.62)',
        }}
      >
        {DOCK_LEFT.map((id) => (
          <DockItem key={id} id={id} pointerX={pointerX} reduced={reduced} />
        ))}

        <span className="mx-1 h-[42px] w-px self-end bg-white/16" />

        {DOCK_RIGHT.map((id) => (
          <DockItem key={id} id={id} pointerX={pointerX} reduced={reduced} />
        ))}

        {/* the bin — closes every open window, which is the only honest
            thing a bin can do in a portfolio */}
        <span className="mx-0.5 h-[42px] w-px self-end bg-white/16" />
        <BinItem pointerX={pointerX} reduced={reduced} full={order.length > 0} onClick={closeAll} />
      </motion.div>
    </div>
  )
}

/** Shared magnification maths — distance from the cursor drives the size. */
function useMagnify(
  ref: React.RefObject<HTMLElement | null>,
  pointerX: MotionValue<number>,
  reduced: boolean,
) {
  const distance = useTransform(pointerX, (x) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return Number.POSITIVE_INFINITY
    return x - (box.left + box.width / 2)
  })

  const target = useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE], { clamp: true })
  const size = useSpring(target, { mass: 0.09, stiffness: 260, damping: 17 })
  return reduced ? BASE : size
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

  const width = useMagnify(ref, pointerX, reduced)
  const isRunning = win.open

  function activate() {
    if (!win.open) return open(id)
    if (win.minimized) return focus(id)
    if (focused === id) return toggleMinimize(id)
    focus(id)
  }

  return (
    <motion.div
      // The wrapper owns the width so neighbours slide apart, but its height
      // is fixed — the icon grows upward, out of the dock.
      style={{ width }}
      className="group/dock relative flex h-[52px] shrink-0 justify-center"
    >
      <span className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-[#2A2A2E]/95 px-2.5 py-1 text-[12.5px] text-white opacity-0 shadow-xl ring-[0.5px] ring-white/16 backdrop-blur-md transition-opacity duration-150 group-hover/dock:opacity-100">
        {apps[id].name}
      </span>

      <motion.button
        ref={ref}
        type="button"
        aria-label={`${apps[id].name}${isRunning ? ' (open)' : ''}`}
        onClick={activate}
        onPointerEnter={() => prefetchApp(queryClient, id)}
        onFocus={() => prefetchApp(queryClient, id)}
        style={{ width, height: width }}
        whileTap={{ scale: 0.86 }}
        className="absolute bottom-0 left-1/2 origin-bottom -translate-x-1/2 rounded-[22%] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <AppIcon id={id} className="h-full w-full drop-shadow-[0_4px_10px_rgba(0,0,0,.45)]" />
      </motion.button>

      <span
        aria-hidden="true"
        className="absolute -bottom-[7px] left-1/2 h-[4px] w-[4px] -translate-x-1/2 rounded-full transition-colors duration-200"
        style={{ background: isRunning ? 'rgb(255 255 255 / 0.75)' : 'transparent' }}
      />
    </motion.div>
  )
}

function BinItem({
  pointerX,
  reduced,
  full,
  onClick,
}: {
  pointerX: MotionValue<number>
  reduced: boolean
  full: boolean
  onClick: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const width = useMagnify(ref, pointerX, reduced)

  return (
    <motion.div
      style={{ width }}
      className="group/dock relative flex h-[52px] shrink-0 justify-center"
    >
      <span className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-[#2A2A2E]/95 px-2.5 py-1 text-[12.5px] text-white opacity-0 shadow-xl ring-[0.5px] ring-white/16 backdrop-blur-md transition-opacity duration-150 group-hover/dock:opacity-100">
        {full ? 'Close all windows' : 'Bin'}
      </span>

      <motion.button
        ref={ref}
        type="button"
        aria-label="Close all windows"
        onClick={onClick}
        style={{ width, height: width }}
        whileTap={{ scale: 0.86 }}
        className="absolute bottom-0 left-1/2 origin-bottom -translate-x-1/2 outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_3px_6px_rgba(0,0,0,.36)]">
          {/* lid */}
          <rect x="24" y="20" width="52" height="6" rx="3" fill="#C6CBD4" opacity={0.9} />
          <rect x="42" y="14" width="16" height="6" rx="3" fill="#C6CBD4" opacity={0.9} />
          {/* body */}
          <path
            d="M28 30h44l-4 50a6 6 0 0 1-6 5.6H38a6 6 0 0 1-6-5.6Z"
            fill="rgb(198 203 212 / .22)"
            stroke="#C6CBD4"
            strokeWidth="3"
            strokeOpacity="0.9"
          />
          {full && (
            <g stroke="#C6CBD4" strokeWidth="3" strokeOpacity="0.55" strokeLinecap="round">
              <path d="M42 42v32M50 42v32M58 42v32" />
            </g>
          )}
        </svg>
      </motion.button>
    </motion.div>
  )
}
