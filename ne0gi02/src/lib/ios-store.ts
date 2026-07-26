'use client'

import { create } from 'zustand'
import { APP_ORDER } from '@/lib/apps'
import type { AppId } from '@/lib/content'

/* ───────────────────────────── model ───────────────────────────── */

export type WidgetKind = 'clock' | 'record' | 'currently' | 'photos'
/** iOS sizes, in icon cells: 2×2, 4×2, 4×4. */
export type WidgetSize = 'small' | 'medium' | 'large'

export interface AppItem {
  key: string
  kind: 'app'
  app: AppId
}

export interface WidgetItem {
  key: string
  kind: 'widget'
  widget: WidgetKind
  size: WidgetSize
}

export type HomeItem = AppItem | WidgetItem

export const WIDGET_SPAN: Record<WidgetSize, { cols: number; rows: number }> = {
  small: { cols: 2, rows: 2 },
  medium: { cols: 4, rows: 2 },
  large: { cols: 4, rows: 4 },
}

export function itemSpan(item: HomeItem) {
  return item.kind === 'widget' ? WIDGET_SPAN[item.size] : { cols: 1, rows: 1 }
}

/** The icon grid a page is laid out on. */
export const COLUMNS = 4
export const ROWS = 6

/** Which layer is over the home screen. Only ever one at a time. */
export type Layer = 'none' | 'notifications' | 'control' | 'spotlight'

const app = (id: AppId): AppItem => ({ key: `app:${id}`, kind: 'app', app: id })
const widget = (kind: WidgetKind, size: WidgetSize): WidgetItem => ({
  key: `widget:${kind}`,
  kind: 'widget',
  widget: kind,
  size,
})

/**
 * The layout a phone ships with. Page one is the one that has to argue for
 * the letter, so it leads with the Currently widget and the two apps that
 * carry the writing; page two is the rest of the desk.
 */
function defaultPages(): HomeItem[][] {
  return [
    [
      widget('currently', 'medium'),
      app('letter'),
      app('projects'),
      app('writing'),
      app('timeline'),
      widget('record', 'small'),
      widget('clock', 'small'),
      app('terminal'),
    ],
    [widget('photos', 'large'), app('gallery'), app('about')],
  ]
}

export const DOCK_APPS: AppId[] = ['letter', 'projects', 'writing', 'contact']

/* ───────────────────────────── store ───────────────────────────── */

const STORAGE_KEY = 'ios-home-layout-v1'

/**
 * A page holds six rows and no more. Anything that no longer fits is pushed
 * to the front of the next page, making one if there is not one already,
 * which is what the phone does when a page fills up.
 *
 * The placement below is CSS grid's sparse auto-flow: the cursor only ever
 * moves forward, so the simulation and the rendered grid agree on where
 * every tile lands.
 */
function packPages(pages: HomeItem[][]): HomeItem[][] {
  // An item may only exist in one place, whatever the caller believes.
  const seen = new Set<string>()
  const queue = pages.map((page) =>
    page.filter((item) => {
      if (seen.has(item.key)) return false
      seen.add(item.key)
      return true
    }),
  )
  const packed: HomeItem[][] = []

  for (let index = 0; index < queue.length && packed.length < 12; index++) {
    const grid: boolean[][] = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(false))
    const fitted: HomeItem[] = []
    let cursor = 0
    let overflow: HomeItem[] = []

    const free = (row: number, col: number, cols: number, rows: number) => {
      if (col + cols > COLUMNS || row + rows > ROWS) return false
      for (let r = row; r < row + rows; r++) {
        for (let c = col; c < col + cols; c++) if (grid[r][c]) return false
      }
      return true
    }

    const page = queue[index]
    for (let i = 0; i < page.length; i++) {
      const { cols, rows } = itemSpan(page[i])

      let at = -1
      for (let slot = cursor; slot < ROWS * COLUMNS; slot++) {
        if (free(Math.floor(slot / COLUMNS), slot % COLUMNS, cols, rows)) {
          at = slot
          break
        }
      }

      if (at === -1) {
        overflow = page.slice(i)
        break
      }

      const row = Math.floor(at / COLUMNS)
      const col = at % COLUMNS
      for (let r = row; r < row + rows; r++) {
        for (let c = col; c < col + cols; c++) grid[r][c] = true
      }
      cursor = at + cols
      fitted.push(page[i])
    }

    packed.push(fitted)

    if (overflow.length) {
      if (index + 1 >= queue.length) queue.push([])
      queue[index + 1] = [...overflow, ...queue[index + 1]]
    }
  }

  return packed
}

interface IosStore {
  pages: HomeItem[][]
  /** Jiggle mode: icons wobble, widgets grow a resize handle. */
  editing: boolean
  /** The app filling the screen, if any. */
  openApp: AppId | null
  /** Where the last launch came from, so the app can zoom back into it. */
  launchRect: { x: number; y: number; w: number; h: number } | null
  layer: Layer

  setPages: (pages: HomeItem[][]) => void
  moveItem: (key: string, toPage: number, toIndex: number) => void
  setWidgetSize: (key: string, size: WidgetSize) => void
  addPage: () => void
  /** Drops trailing empty pages, keeping at least one. */
  tidyPages: () => void
  reset: () => void

  setEditing: (editing: boolean) => void
  launch: (id: AppId, rect?: { x: number; y: number; w: number; h: number } | null) => void
  closeApp: () => void
  setLayer: (layer: Layer) => void
}

/** Layouts are persisted whole, then validated on read against the registry. */
function load(): HomeItem[][] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as HomeItem[][]
    if (!Array.isArray(parsed) || !parsed.length) return null

    const seen = new Set<string>()
    const pages = parsed.map((page) =>
      (Array.isArray(page) ? page : []).filter((item: HomeItem) => {
        if (!item || seen.has(item.key)) return false
        if (item.kind === 'app' && !APP_ORDER.includes(item.app)) return false
        if (item.kind === 'widget' && !WIDGET_SPAN[item.size]) return false
        seen.add(item.key)
        return true
      }),
    )

    // An app added to the registry after this layout was saved still has to
    // land somewhere, or it would be unreachable outside the App Library.
    const missing = APP_ORDER.filter((id) => !seen.has(`app:${id}`)).map(app)
    if (missing.length) pages[pages.length - 1] = [...pages[pages.length - 1], ...missing]

    return pages.filter((page, i) => page.length > 0 || i === 0)
  } catch {
    return null
  }
}

function save(pages: HomeItem[][]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
  } catch {
    /* private mode, so the arrangement just will not survive a reload */
  }
}

export const useIos = create<IosStore>((set, get) => ({
  pages: defaultPages(),
  editing: false,
  openApp: null,
  launchRect: null,
  layer: 'none',

  setPages: (pages) => {
    const packed = packPages(pages)
    save(packed)
    set({ pages: packed })
  },

  moveItem: (key, toPage, toIndex) => {
    const pages = get().pages.map((page) => [...page])
    if (!pages[toPage]) return

    let item: HomeItem | undefined
    for (const page of pages) {
      const at = page.findIndex((candidate) => candidate.key === key)
      if (at !== -1) {
        item = page.splice(at, 1)[0]
        break
      }
    }
    if (!item) return

    const target = pages[toPage]
    target.splice(Math.max(0, Math.min(toIndex, target.length)), 0, item)
    const packed = packPages(pages)
    save(packed)
    set({ pages: packed })
  },

  setWidgetSize: (key, size) => {
    const pages = get().pages.map((page) =>
      page.map((item) => (item.key === key && item.kind === 'widget' ? { ...item, size } : item)),
    )
    const packed = packPages(pages)
    save(packed)
    set({ pages: packed })
  },

  addPage: () => {
    const pages = [...get().pages, []]
    save(pages)
    set({ pages })
  },

  tidyPages: () => {
    const pages = [...get().pages]
    while (pages.length > 1 && pages[pages.length - 1].length === 0) pages.pop()
    if (pages.length === get().pages.length) return
    save(pages)
    set({ pages })
  },

  reset: () => {
    const pages = packPages(defaultPages())
    save(pages)
    set({ pages, editing: false })
  },

  setEditing: (editing) => set({ editing }),

  launch: (id, rect = null) => set({ openApp: id, launchRect: rect, layer: 'none', editing: false }),
  closeApp: () => set({ openApp: null }),
  setLayer: (layer) => set({ layer }),
}))

/** Called once on mount: swaps the shipped layout for the saved one. */
export function hydrateIosLayout() {
  const saved = load()
  useIos.setState({ pages: packPages(saved ?? defaultPages()) })
}
