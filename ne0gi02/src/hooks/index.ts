'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

/* ─────────────────────────── client detection ─────────────────────────── */

const noopSubscribe = () => () => {}

/**
 * True only after hydration. Implemented with useSyncExternalStore rather
 * than a mount effect so there is no setState-in-effect cascade.
 */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

/* ─────────────────────────── media queries ─────────────────────────── */

const mqlCache = new Map<string, MediaQueryList>()

function mql(query: string) {
  let list = mqlCache.get(query)
  if (!list) {
    list = window.matchMedia(query)
    mqlCache.set(query, list)
  }
  return list
}

/** SSR-safe media query. Reports `false` during server render. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = mql(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => mql(query).matches,
    () => false,
  )
}

/** Phones and small tablets get a different scene, not a smaller one. */
export function useIsHandheld() {
  return useMediaQuery('(max-width: 819px)')
}

export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/* ─────────────────────────── theme ─────────────────────────── */

export type Theme = 'light' | 'dark'

/**
 * The `dark` class on <html> is the single source of truth. It is set by the
 * inline script in the document head before first paint, so React only ever
 * reads and toggles it.
 */
const themeListeners = new Set<() => void>()

function subscribeTheme(onChange: () => void) {
  themeListeners.add(onChange)
  return () => {
    themeListeners.delete(onChange)
  }
}

function readTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'light' as Theme)

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* private mode, so the choice just won't persist */
    }
    themeListeners.forEach((listener) => listener())
  }, [])

  return { theme, toggle }
}

/* ─────────────────────────── clock ─────────────────────────── */

/** Menu-bar clock. Ticks on the minute boundary, not every second. */
export function useClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const date = new Date()
      setNow(date)
      timer = setTimeout(tick, (60 - date.getSeconds()) * 1000 + 50)
    }

    // Deferred by a turn so the first paint stays a pure render.
    timer = setTimeout(tick, 0)
    return () => clearTimeout(timer)
  }, [])

  return now
}

/* ─────────────────────────── viewport ─────────────────────────── */

/** Viewport size, coalesced to animation frames. */
export function useViewport() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setSize({ w: window.innerWidth, h: window.innerHeight }))
    }
    update()
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', update)
    }
  }, [])

  return size
}
