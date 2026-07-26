'use client'

import { useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { AppSurface } from '@/components/apps'
import { apps } from '@/lib/apps'
import { haptic } from '@/lib/haptics'
import { useReducedMotion, useViewport } from '@/hooks'
import type { AppId } from '@/lib/content'

/** How far a swipe has to travel before letting go closes the app. */
const DISMISS_DISTANCE = 96

/**
 * An open app. It grows out of the icon that launched it, and it leaves the
 * same way: a swipe up from the bottom bar, or a drag in from the left edge,
 * both of which track the finger rather than firing at a threshold.
 */
export function AppFrame({
  id,
  from,
  onClose,
}: {
  id: AppId
  from: { x: number; y: number; w: number; h: number } | null
  onClose: () => void
}) {
  const reduced = useReducedMotion()
  const screen = useViewport()
  const [closing, setClosing] = useState(false)

  /* One value drives both gestures: 0 is open, 1 is gone. */
  const progress = useMotionValue(0)
  const scale = useTransform(progress, [0, 1], [1, 0.62])
  const radius = useTransform(progress, [0, 1], [40, 68])
  const shift = useTransform(progress, [0, 1], [0, -40])

  const close = () => {
    if (closing) return
    setClosing(true)
    haptic(8)
    onClose()
  }

  const gesture = useRef<{ axis: 'y' | 'x'; x: number; y: number } | null>(null)

  function startGesture(axis: 'y' | 'x', event: React.PointerEvent) {
    gesture.current = { axis, x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onSwipeBackDown = (event: React.PointerEvent) => startGesture('x', event)
  const onSwipeHomeDown = (event: React.PointerEvent) => startGesture('y', event)

  const onPointerMove = (event: React.PointerEvent) => {
    const start = gesture.current
    if (!start) return
    const travelled =
      start.axis === 'y' ? Math.max(0, start.y - event.clientY) : Math.max(0, event.clientX - start.x)
    progress.set(Math.min(1, travelled / (DISMISS_DISTANCE * 2)))
  }

  const onPointerUp = (event: React.PointerEvent) => {
    const start = gesture.current
    gesture.current = null
    if (!start) return
    const travelled =
      start.axis === 'y' ? start.y - event.clientY : event.clientX - start.x

    if (travelled > DISMISS_DISTANCE) close()
    else animate(progress, 0, { type: 'spring', stiffness: 520, damping: 42 })
  }

  /* The icon the app came from, expressed as a transform of the full screen. */
  const zoom =
    from && screen && !reduced
      ? {
          x: from.x,
          y: from.y,
          scaleX: from.w / screen.w,
          scaleY: from.h / screen.h,
          opacity: 0.35,
          borderRadius: 60,
        }
      : { opacity: 0, scale: reduced ? 1 : 0.94 }

  return (
    <motion.section
      key={id}
      initial={zoom}
      animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, borderRadius: 40 }}
      exit={zoom}
      transition={
        reduced
          ? { duration: 0.12 }
          : { type: 'spring', stiffness: 320, damping: 34, mass: 0.85 }
      }
      style={{ originX: 0, originY: 0, scale, borderRadius: radius, y: shift }}
      className="fixed inset-0 z-30 overflow-hidden bg-surface-solid shadow-[0_24px_60px_-12px_rgba(0,0,0,.7)]"
      aria-label={apps[id].name}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.22 }}
        className="h-full w-full"
        style={{
          paddingTop: 'calc(max(0.75rem, env(safe-area-inset-top)) + 42px)',
          paddingBottom: 'calc(max(0.4rem, env(safe-area-inset-bottom)) + 14px)',
        }}
      >
        <div className="h-full w-full overflow-hidden">
          <AppSurface id={id} fullscreen />
        </div>
      </motion.div>

      {/* left edge: the back swipe */}
      <div
        onPointerDown={onSwipeBackDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-y-0 left-0 z-10 w-5 touch-none"
        aria-hidden="true"
      />

      {/* bottom bar: the swipe home */}
      <div
        onPointerDown={onSwipeHomeDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-x-0 bottom-0 z-10 h-8 touch-none"
        aria-hidden="true"
      />
    </motion.section>
  )
}
