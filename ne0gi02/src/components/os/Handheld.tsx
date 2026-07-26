'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { StatusBar } from '@/components/ios/StatusBar'
import { HomeScreen } from '@/components/ios/HomeScreen'
import { AppFrame } from '@/components/ios/AppFrame'
import { NotificationCentre } from '@/components/ios/NotificationCentre'
import { ControlCentreIos } from '@/components/ios/ControlCentreIos'
import { Spotlight } from '@/components/ios/Spotlight'
import { apps, APP_ORDER } from '@/lib/apps'
import { hydrateIosLayout, useIos } from '@/lib/ios-store'
import { haptic } from '@/lib/haptics'
import { useReducedMotion } from '@/hooks'
import type { Layer } from '@/lib/ios-store'

/** How far the finger has to come down from the notch to commit to a panel. */
const PULL_DISTANCE = 190

/**
 * The phone. Not a narrow desktop: a home screen with pages and widgets, an
 * App Library, Spotlight, a Notification Centre under the left of the notch
 * and Control Centre under the right, and apps that zoom out of their icons
 * and are dismissed by gesture.
 */
export function Handheld() {
  const openApp = useIos((s) => s.openApp)
  const launchRect = useIos((s) => s.launchRect)
  const closeApp = useIos((s) => s.closeApp)
  const layer = useIos((s) => s.layer)
  const setLayer = useIos((s) => s.setLayer)
  const launch = useIos((s) => s.launch)
  const editing = useIos((s) => s.editing)
  const setEditing = useIos((s) => s.setEditing)
  const reduced = useReducedMotion()

  useEffect(hydrateIosLayout, [])

  /* ── the two pull-down panels ── */
  const pull = useMotionValue(0)
  const [pulling, setPulling] = useState<Exclude<Layer, 'none' | 'spotlight'> | null>(null)
  const gesture = useRef<{
    kind: 'notifications' | 'control'
    y: number
    /** Where the panel was when the finger landed. */
    from: number
  } | null>(null)
  const panel = pulling ?? (layer === 'notifications' || layer === 'control' ? layer : null)

  useEffect(() => {
    if (layer === 'notifications' || layer === 'control') {
      if (reduced) pull.set(1)
      else animate(pull, 1, { type: 'spring', stiffness: 380, damping: 40 })
    } else if (!pulling) {
      if (reduced) pull.set(0)
      else animate(pull, 0, { type: 'spring', stiffness: 420, damping: 44 })
    }
  }, [layer, pulling, pull, reduced])

  /**
   * One gesture, both directions: pulling down from the notch opens a panel,
   * pushing up from its handle puts it away, and either can be abandoned
   * halfway, because the finger is what decides.
   */
  function startPull(kind: 'notifications' | 'control', event: React.PointerEvent) {
    if (openApp) return
    gesture.current = { kind, y: event.clientY, from: pull.get() }
    setPulling(kind)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onNotificationsDown = (event: React.PointerEvent) => startPull('notifications', event)
  const onControlDown = (event: React.PointerEvent) => startPull('control', event)
  const onPanelHandleDown = (event: React.PointerEvent) => {
    if (!panel) return
    startPull(panel, event)
  }

  const movePull = (event: React.PointerEvent) => {
    const start = gesture.current
    if (!start) return
    const travelled = (event.clientY - start.y) / PULL_DISTANCE
    pull.set(Math.max(0, Math.min(1, start.from + travelled)))
  }

  const endPull = () => {
    const start = gesture.current
    gesture.current = null
    if (!start) return

    /* Committing takes a third of the way down from closed, but only a third
       of the way up from open, so neither direction feels sticky. */
    const open = start.from > 0.5 ? pull.get() > 0.66 : pull.get() > 0.34

    if (open) {
      setLayer(start.kind)
      setPulling(null)
      if (start.from <= 0.5) haptic(10)
    } else {
      setLayer('none')
      animate(pull, 0, {
        type: 'spring',
        stiffness: 460,
        damping: 44,
        onComplete: () => setPulling(null),
      })
      /* Belt and braces: if that animation is ever interrupted the panel
         must still stop covering the screen. */
      setTimeout(() => setPulling(null), 600)
    }
  }

  /** Dragging the open panel back up. */
  const dismissPanel = () => {
    setLayer('none')
    setPulling(null)
    haptic(6)
  }

  const panelY = useTransform(pull, [0, 1], ['-100%', '0%'])
  const panelFade = useTransform(pull, [0, 0.25, 1], [0, 0.6, 1])

  /* ── the home indicator, which is also the only visible control ── */
  const goHome = () => {
    if (layer !== 'none') return dismissPanel()
    if (openApp) return closeApp()
    if (editing) return setEditing(false)
  }

  return (
    <main className="fixed inset-0 flex touch-none flex-col overflow-hidden select-none">
      <StatusBar activity={openApp ? apps[openApp].name : null} />

      <div className="relative min-h-0 flex-1">
        <HomeScreen />
      </div>

      <AnimatePresence>
        {openApp && <AppFrame key={openApp} id={openApp} from={launchRect} onClose={closeApp} />}
      </AnimatePresence>

      <AnimatePresence>
        {layer === 'spotlight' && (
          <Spotlight onClose={() => setLayer('none')} onOpen={(id) => launch(id, null)} />
        )}
      </AnimatePresence>

      {/* ── notification centre and control centre ── */}
      {panel && (
        <>
          <motion.div
            style={{ opacity: panelFade }}
            className="pointer-events-none fixed inset-0 z-40 bg-black/45 backdrop-blur-2xl"
          />
          <motion.div
            style={{ y: panelY }}
            className="fixed inset-0 z-40 flex flex-col"
            onPointerUp={endPull}
            onPointerMove={movePull}
          >
            <div className="min-h-0 flex-1">
              {panel === 'notifications' ? (
                <NotificationCentre onOpen={(id) => launch(id, null)} />
              ) : (
                <ControlCentreIos />
              )}
            </div>
            <div
              onPointerDown={onPanelHandleDown}
              onPointerMove={movePull}
              onPointerUp={endPull}
              onPointerCancel={endPull}
              className="grid shrink-0 touch-none place-items-center pb-2 pt-3"
            >
              <button
                type="button"
                onClick={dismissPanel}
                aria-label="Close panel"
                className="h-[5px] w-[136px] rounded-full bg-white/60"
              />
            </div>
          </motion.div>
        </>
      )}

      {/* ── the two pull zones under the notch ── */}
      {!openApp && layer === 'none' && (
        <>
          <div
            onPointerDown={onNotificationsDown}
            onPointerMove={movePull}
            onPointerUp={endPull}
            onPointerCancel={endPull}
            className="absolute left-0 top-0 z-50 h-[46px] w-1/2 touch-none"
            aria-label="Open Notification Centre"
            role="button"
          />
          <div
            onPointerDown={onControlDown}
            onPointerMove={movePull}
            onPointerUp={endPull}
            onPointerCancel={endPull}
            className="absolute right-0 top-0 z-50 h-[46px] w-1/2 touch-none"
            aria-label="Open Control Centre"
            role="button"
          />
        </>
      )}

      {/* ── home indicator ── */}
      <div
        className="relative z-40 flex shrink-0 justify-center pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5"
        /* While an app is open the bottom belongs to its swipe-home gesture,
           so the indicator is drawn but not touchable. */
        style={{ pointerEvents: panel || openApp ? 'none' : undefined }}
      >
        <button
          type="button"
          onClick={goHome}
          aria-label={openApp ? `Close ${apps[openApp].name}` : 'Home'}
          className="h-[5px] w-[136px] rounded-full bg-white/70 transition-colors active:bg-white"
        />
      </div>
    </main>
  )
}

/** Keeps the app registry honest if an id is ever added to content. */
export const HANDHELD_APPS = APP_ORDER
