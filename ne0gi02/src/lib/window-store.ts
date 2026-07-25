'use client'

import { create } from 'zustand'
import type { AppId } from '@/lib/content'
import { APP_ORDER, apps } from '@/lib/apps'

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface WindowState extends Rect {
  id: AppId
  open: boolean
  minimized: boolean
  maximized: boolean
  z: number
  /** rect to restore to when un-maximizing */
  restore: Rect | null
}

interface WindowStore {
  windows: Record<AppId, WindowState>
  order: AppId[]
  focused: AppId | null
  topZ: number
  laidOut: boolean

  layout: (viewport: { w: number; h: number }) => void
  open: (id: AppId) => void
  close: (id: AppId) => void
  focus: (id: AppId) => void
  toggleMinimize: (id: AppId) => void
  toggleMaximize: (id: AppId) => void
  move: (id: AppId, x: number, y: number) => void
  resize: (id: AppId, rect: Rect) => void
  closeAll: () => void
}

const MENUBAR_H = 30
const DOCK_RESERVE = 104

function blank(id: AppId): WindowState {
  return {
    id,
    open: false,
    minimized: false,
    maximized: false,
    z: 0,
    x: 0,
    y: 0,
    w: apps[id].defaultSize.w,
    h: apps[id].defaultSize.h,
    restore: null,
  }
}

const initialWindows = Object.fromEntries(
  APP_ORDER.map((id) => [id, blank(id)]),
) as Record<AppId, WindowState>

/** Clamp a window's default size to the viewport, then centre-ish it. */
function place(id: AppId, viewport: { w: number; h: number }, index: number): Rect {
  const { defaultSize } = apps[id]
  const availW = viewport.w - 48
  const availH = viewport.h - MENUBAR_H - DOCK_RESERVE

  const w = Math.min(defaultSize.w, availW)
  const h = Math.min(defaultSize.h, availH)

  // Cascade: each successive window steps down-right from centre.
  const step = 26
  const cx = (viewport.w - w) / 2
  const cy = MENUBAR_H + Math.max(12, (availH - h) / 2)

  return {
    w,
    h,
    x: Math.max(12, Math.min(cx + index * step, viewport.w - w - 12)),
    y: Math.max(MENUBAR_H + 8, Math.min(cy + index * step, viewport.h - DOCK_RESERVE - 40)),
  }
}

export const useWindows = create<WindowStore>((set, get) => ({
  windows: initialWindows,
  order: [],
  focused: null,
  topZ: 10,
  laidOut: false,

  layout: (viewport) =>
    set((s) => {
      const next = { ...s.windows }
      APP_ORDER.forEach((id, i) => {
        const rect = place(id, viewport, i)
        const win = next[id]
        // Only reposition windows the user hasn't touched yet.
        next[id] = win.open ? { ...win, ...clampInto(win, viewport) } : { ...win, ...rect }
      })
      return { windows: next, laidOut: true }
    }),

  open: (id) => {
    const s = get()
    const win = s.windows[id]
    const z = s.topZ + 1
    set({
      topZ: z,
      focused: id,
      order: s.order.includes(id) ? s.order : [...s.order, id],
      windows: {
        ...s.windows,
        [id]: {
          ...win,
          open: true,
          minimized: false,
          z,
        },
      },
    })
  },

  close: (id) =>
    set((s) => ({
      order: s.order.filter((w) => w !== id),
      focused: s.focused === id ? lastOf(s.order.filter((w) => w !== id && s.windows[w].open)) : s.focused,
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], open: false, minimized: false, maximized: false },
      },
    })),

  focus: (id) => {
    const s = get()
    if (s.focused === id && !s.windows[id].minimized) return
    const z = s.topZ + 1
    set({
      topZ: z,
      focused: id,
      windows: { ...s.windows, [id]: { ...s.windows[id], z, minimized: false } },
    })
  },

  toggleMinimize: (id) =>
    set((s) => {
      const win = s.windows[id]
      const minimized = !win.minimized
      return {
        focused: minimized ? lastOf(s.order.filter((w) => w !== id && s.windows[w].open && !s.windows[w].minimized)) : id,
        windows: { ...s.windows, [id]: { ...win, minimized } },
      }
    }),

  toggleMaximize: (id) =>
    set((s) => {
      const win = s.windows[id]
      if (win.maximized && win.restore) {
        return { windows: { ...s.windows, [id]: { ...win, ...win.restore, maximized: false, restore: null } } }
      }
      const vp = { w: window.innerWidth, h: window.innerHeight }
      return {
        windows: {
          ...s.windows,
          [id]: {
            ...win,
            maximized: true,
            restore: { x: win.x, y: win.y, w: win.w, h: win.h },
            x: 12,
            y: MENUBAR_H + 8,
            w: vp.w - 24,
            h: vp.h - MENUBAR_H - DOCK_RESERVE + 24,
          },
        },
      }
    }),

  move: (id, x, y) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], x, y } } })),

  resize: (id, rect) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], ...rect } } })),

  closeAll: () =>
    set((s) => ({
      order: [],
      focused: null,
      windows: Object.fromEntries(
        APP_ORDER.map((id) => [id, { ...s.windows[id], open: false, minimized: false }]),
      ) as Record<AppId, WindowState>,
    })),
}))

function lastOf(list: AppId[]): AppId | null {
  return list.length ? list[list.length - 1] : null
}

/** Keep an already-open window inside the viewport after a resize. */
function clampInto(win: WindowState, viewport: { w: number; h: number }): Rect {
  const w = Math.min(win.w, viewport.w - 24)
  const h = Math.min(win.h, viewport.h - MENUBAR_H - 60)
  return {
    w,
    h,
    x: Math.max(12, Math.min(win.x, viewport.w - w - 12)),
    y: Math.max(MENUBAR_H + 8, Math.min(win.y, viewport.h - 80)),
  }
}
