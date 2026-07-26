'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react'
import { AppIcon } from '@/components/os/AppIcon'
import { IosWidget, WIDGET_APP, WIDGET_LABEL } from '@/components/ios/IosWidget'
import { AppLibrary } from '@/components/ios/AppLibrary'
import { apps } from '@/lib/apps'
import { COLUMNS, DOCK_APPS, itemSpan, ROWS, useIos, WIDGET_SPAN } from '@/lib/ios-store'
import { haptic } from '@/lib/haptics'
import { useReducedMotion } from '@/hooks'
import { cn } from '@/lib/cn'
import type { HomeItem, WidgetItem, WidgetSize } from '@/lib/ios-store'
import type { AppId } from '@/lib/content'

const GAP_X = 16
const GAP_Y = 12
/** An icon cell never grows past this, or widgets stretch on tall phones. */
const MAX_CELL = 92
const MIN_CELL = 66
const LONG_PRESS_MS = 420
/** How long the finger has to hover an edge before the page turns. */
const EDGE_TURN_MS = 620
const EDGE_ZONE = 46

interface DragState {
  key: string
  item: HomeItem
  /** Pointer offset inside the icon, so it does not jump to the fingertip. */
  grab: { x: number; y: number }
  size: { w: number; h: number }
  point: { x: number; y: number }
}

/**
 * The home screen: paged icon grid, widgets that resize, a dock that stays
 * put, and the App Library one page past the end. Icons are dragged with
 * raw pointer events rather than a drag library, because the page has to
 * turn under the finger while the icon is still held.
 */
export function HomeScreen() {
  const pages = useIos((s) => s.pages)
  const editing = useIos((s) => s.editing)
  const setEditing = useIos((s) => s.setEditing)
  const moveItem = useIos((s) => s.moveItem)
  const addPage = useIos((s) => s.addPage)
  const tidyPages = useIos((s) => s.tidyPages)
  const reset = useIos((s) => s.reset)
  const launch = useIos((s) => s.launch)
  const setLayer = useIos((s) => s.setLayer)
  const reduced = useReducedMotion()

  const root = useRef<HTMLDivElement>(null)
  const pager = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const width = size.w
  /* One row height for the whole grid, so a 2×2 widget is exactly two icons
     tall on every screen instead of a fraction of whatever is left. */
  const cell = Math.max(
    MIN_CELL,
    Math.min(MAX_CELL, (size.h - 28 - GAP_Y * (ROWS - 1)) / ROWS),
  )
  const [rawPanel, setPanel] = useState(0)
  const [drag, setDrag] = useState<DragState | null>(null)
  const cells = useRef(new Map<string, HTMLElement>())
  const x = useMotionValue(0)

  /** Home pages, then the blank page that only exists while editing, then the library. */
  const panels = pages.length + (editing ? 1 : 0) + 1
  const libraryPanel = panels - 1
  const newPagePanel = editing ? pages.length : -1
  /* Leaving edit mode removes a panel, so the index is clamped on read
     rather than corrected in an effect. */
  const panel = Math.min(rawPanel, panels - 1)

  /* Width comes from the screen, height from the pager itself, so the grid
     is measured against the space it actually has rather than the space the
     dock and the page dots are already using. */
  useLayoutEffect(() => {
    const outer = root.current
    const inner = pager.current
    if (!outer || !inner) return

    const measure = () =>
      setSize({
        w: outer.getBoundingClientRect().width,
        h: inner.getBoundingClientRect().height,
      })

    const observer = new ResizeObserver(measure)
    observer.observe(outer)
    observer.observe(inner)
    measure()
    return () => observer.disconnect()
  }, [])

  /* The pager is one motion value driven both by the drag and by taps on
     the page dots, so the two can never disagree about where it is. */
  useEffect(() => {
    if (!width) return
    const target = -Math.min(panel, panels - 1) * width
    if (reduced) x.set(target)
    else animate(x, target, { type: 'spring', stiffness: 420, damping: 44, mass: 0.9 })
  }, [panel, width, panels, x, reduced])


  /* ─────────────── icon dragging ─────────────── */

  const edgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const edgeSide = useRef<'left' | 'right' | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const panelRef = useRef(0)

  useEffect(() => {
    panelRef.current = panel
  }, [panel])

  const clearEdge = () => {
    if (edgeTimer.current) clearTimeout(edgeTimer.current)
    edgeTimer.current = null
    edgeSide.current = null
  }

  /** Nearest slot on the visible page to the point the finger is over. */
  const dropIndex = useCallback(
    (point: { x: number; y: number }, page: number, key: string) => {
      const items = pages[page] ?? []
      let index = items.length
      let best = Infinity

      items.forEach((item, i) => {
        const element = cells.current.get(`${page}:${item.key}`)
        if (!element || item.key === key) return
        const box = element.getBoundingClientRect()
        const cx = box.left + box.width / 2
        const cy = box.top + box.height / 2
        // Rows dominate: a finger one row down is never a near miss sideways.
        const distance = Math.hypot(point.x - cx, (point.y - cy) * 1.6)
        if (distance < best) {
          best = distance
          index = point.x > cx || point.y > cy + box.height / 2 ? i + 1 : i
        }
      })

      return index
    },
    [pages],
  )

  const endDrag = useCallback(() => {
    clearEdge()
    dragRef.current = null
    setDrag(null)
    tidyPages()
    haptic(6)
  }, [tidyPages])

  const onDragMove = useCallback(
    (point: { x: number; y: number }) => {
      const state = dragRef.current
      if (!state) return
      setDrag({ ...state, point })
      dragRef.current = { ...state, point }

      const box = root.current?.getBoundingClientRect()
      if (!box) return

      /* Hold an edge and the page turns, exactly as it does on the phone.
         Past the last page that means making a new one. */
      const side = point.x < box.left + EDGE_ZONE ? 'left' : point.x > box.right - EDGE_ZONE ? 'right' : null

      if (side !== edgeSide.current) {
        clearEdge()
        edgeSide.current = side
        if (side) {
          edgeTimer.current = setTimeout(() => {
            const current = panelRef.current
            if (side === 'left' && current > 0) {
              setPanel(current - 1)
              haptic(10)
            } else if (side === 'right') {
              const lastHome = useIos.getState().pages.length - 1
              if (current < lastHome) {
                setPanel(current + 1)
                haptic(10)
              } else if (useIos.getState().pages[lastHome]?.length > 1) {
                addPage()
                setPanel(lastHome + 1)
                haptic([12, 40, 12])
              }
            }
            edgeSide.current = null
            edgeTimer.current = null
          }, EDGE_TURN_MS)
        }
        return
      }

      const page = Math.min(panelRef.current, useIos.getState().pages.length - 1)
      if (panelRef.current > useIos.getState().pages.length - 1) return

      const index = dropIndex(point, page, state.key)
      const items = useIos.getState().pages[page] ?? []
      const at = items.findIndex((item) => item.key === state.key)
      const adjusted = at !== -1 && at < index ? index - 1 : index
      if (at === adjusted && at !== -1) return
      moveItem(state.key, page, adjusted)
    },
    [addPage, dropIndex, moveItem],
  )

  useEffect(() => {
    if (!drag) return

    const move = (event: PointerEvent) => {
      event.preventDefault()
      onDragMove({ x: event.clientX, y: event.clientY })
    }
    const up = () => endDrag()

    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [drag, endDrag, onDragMove])

  const beginDrag = useCallback(
    (item: HomeItem, element: HTMLElement, point: { x: number; y: number }) => {
      const box = element.getBoundingClientRect()
      const state: DragState = {
        key: item.key,
        item,
        grab: { x: point.x - box.left, y: point.y - box.top },
        size: { w: box.width, h: box.height },
        point,
      }
      dragRef.current = state
      setDrag(state)
      setEditing(true)
      haptic(12)
    },
    [setEditing],
  )

  /* ─────────────── pager ─────────────── */

  const onPagerDragEnd = (offset: number, velocity: number) => {
    const threshold = width * 0.22
    let next = panel
    if (offset < -threshold || velocity < -520) next = panel + 1
    else if (offset > threshold || velocity > 520) next = panel - 1
    setPanel(Math.max(0, Math.min(panels - 1, next)))
  }

  const openApp = (id: AppId, element: HTMLElement | null) => {
    const box = element?.getBoundingClientRect()
    launch(id, box ? { x: box.left, y: box.top, w: box.width, h: box.height } : null)
  }

  return (
    <div ref={root} className="absolute inset-0 flex flex-col overflow-hidden">
      {/* ── edit-mode toolbar ── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute inset-x-0 top-1 z-30 flex justify-center gap-2 px-5"
          >
            <button
              type="button"
              onClick={() => {
                addPage()
                setPanel(pages.length)
                haptic()
              }}
              className="rounded-full bg-black/45 px-3.5 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-xl"
            >
              Add page
            </button>
            <button
              type="button"
              onClick={() => {
                reset()
                setPanel(0)
              }}
              className="rounded-full bg-black/45 px-3.5 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-xl"
            >
              Reset layout
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                tidyPages()
              }}
              className="rounded-full bg-white px-4 py-1.5 text-[12.5px] font-semibold text-black"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── the pager ── */}
      <motion.div
        ref={pager}
        className="flex min-h-0 flex-1"
        style={{ x, width: width ? width * panels : '100%' }}
        drag={drag ? false : 'x'}
        dragDirectionLock
        dragConstraints={{ left: -(panels - 1) * width, right: 0 }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragEnd={(_, info) => onPagerDragEnd(info.offset.x, info.velocity.x)}
      >
        {pages.map((items, pageIndex) => (
          <HomePage
            key={pageIndex}
            width={width}
            cell={cell}
            items={items}
            pageIndex={pageIndex}
            editing={editing}
            draggingKey={drag?.key ?? null}
            registerCell={(key, element) => {
              if (element) cells.current.set(`${pageIndex}:${key}`, element)
              else cells.current.delete(`${pageIndex}:${key}`)
            }}
            onBeginDrag={beginDrag}
            onOpen={openApp}
            onEnterEdit={() => {
              setEditing(true)
              haptic(12)
            }}
            onExitEdit={() => setEditing(false)}
            onSpotlight={() => setLayer('spotlight')}
          />
        ))}

        {editing && (
          <div className="shrink-0 px-6 py-4" style={{ width: width || '100%' }}>
            <div className="grid h-full place-items-center rounded-[28px] border-2 border-dashed border-white/25 text-center">
              <div>
                <p className="text-[15px] font-medium text-white/80">New page</p>
                <p className="mt-1 px-8 text-[12.5px] text-white/45">
                  Drag an icon here, or hold one against the right edge.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="shrink-0" style={{ width: width || '100%' }}>
          <AppLibrary active={panel === libraryPanel} onOpen={openApp} />
        </div>
      </motion.div>

      {/* ── page dots and the search pill ── */}
      <div className="relative z-20 flex shrink-0 flex-col items-center gap-3 pb-2 pt-1">
        <div className="flex items-center gap-2">
          {Array.from({ length: panels }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={i === libraryPanel ? 'App Library' : `Page ${i + 1}`}
              onClick={() => setPanel(i)}
              className="grid h-5 w-5 place-items-center"
            >
              {i === libraryPanel ? (
                <LibraryDot active={panel === i} />
              ) : (
                <span
                  className={cn(
                    'h-[7px] w-[7px] rounded-full transition-all duration-200',
                    i === newPagePanel && 'ring-1 ring-white/50',
                    panel === i ? 'bg-white' : 'bg-white/35',
                  )}
                />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLayer('spotlight')}
          className="flex items-center gap-1.5 rounded-full bg-black/35 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-xl active:bg-black/55"
        >
          <SearchGlyph />
          Search
        </button>
      </div>

      {/* ── dock ── */}
      <Dock onOpen={openApp} />

      {/* ── the icon under the finger ── */}
      {drag && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: drag.point.x - drag.grab.x,
            top: drag.point.y - drag.grab.y,
            width: drag.size.w,
            height: drag.size.h,
          }}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.12 }}
            className="h-full w-full drop-shadow-[0_18px_28px_rgba(0,0,0,.55)]"
          >
            <ItemFace item={drag.item} floating />
          </motion.div>
        </div>
      )}
    </div>
  )
}

/* ───────────────────────────── a page ───────────────────────────── */

function HomePage({
  width,
  cell,
  items,
  pageIndex,
  editing,
  draggingKey,
  registerCell,
  onBeginDrag,
  onOpen,
  onEnterEdit,
  onExitEdit,
  onSpotlight,
}: {
  width: number
  cell: number
  items: HomeItem[]
  pageIndex: number
  editing: boolean
  draggingKey: string | null
  registerCell: (key: string, element: HTMLElement | null) => void
  onBeginDrag: (item: HomeItem, element: HTMLElement, point: { x: number; y: number }) => void
  onOpen: (id: AppId, element: HTMLElement | null) => void
  onEnterEdit: () => void
  onExitEdit: () => void
  onSpotlight: () => void
}) {
  const press = useRef<{
    x: number
    y: number
    timer: ReturnType<typeof setTimeout> | null
    fired: boolean
  } | null>(null)

  /* Pressing the wallpaper: hold to edit, pull down to search. Anywhere
     that is not an icon counts, including the gaps between them. */
  const onBackgroundDown = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest('[role="button"]')) return
    const timer = setTimeout(() => {
      onEnterEdit()
      if (press.current) press.current.fired = true
    }, LONG_PRESS_MS)
    press.current = { x: event.clientX, y: event.clientY, timer, fired: false }
  }

  const onBackgroundMove = (event: React.PointerEvent) => {
    const start = press.current
    if (!start || start.fired) return

    const dy = event.clientY - start.y
    const dx = Math.abs(event.clientX - start.x)

    // Any real movement rules out a long press.
    if (start.timer && (Math.abs(dy) > 8 || dx > 8)) {
      clearTimeout(start.timer)
      start.timer = null
    }

    // A downward pull on the wallpaper is Spotlight; sideways is the pager's.
    if (dy > 48 && dx < 60) {
      start.fired = true
      onSpotlight()
    }
  }

  const onBackgroundUp = () => {
    const start = press.current
    press.current = null
    if (!start) return
    if (!start.timer) return // it moved, so it was a swipe rather than a tap
    clearTimeout(start.timer)
    // A tap on the wallpaper is how you leave jiggle mode.
    if (!start.fired && editing) onExitEdit()
  }

  return (
    <div
      className={cn('shrink-0 touch-pan-y px-5 pb-1', editing ? 'pt-12' : 'pt-3')}
      style={{ width: width || '100%' }}
      onPointerDown={onBackgroundDown}
      onPointerMove={onBackgroundMove}
      onPointerUp={onBackgroundUp}
      onPointerCancel={onBackgroundUp}
    >
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
          gridAutoRows: `${cell}px`,
          columnGap: GAP_X,
          rowGap: GAP_Y,
          alignContent: 'start',
        }}
      >
        {items.map((item) => (
          <HomeCell
            key={item.key}
            item={item}
            pageIndex={pageIndex}
            editing={editing}
            dragging={draggingKey === item.key}
            registerCell={registerCell}
            onBeginDrag={onBeginDrag}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────────── a cell ───────────────────────────── */

function HomeCell({
  item,
  pageIndex,
  editing,
  dragging,
  registerCell,
  onBeginDrag,
  onOpen,
}: {
  item: HomeItem
  pageIndex: number
  editing: boolean
  dragging: boolean
  registerCell: (key: string, element: HTMLElement | null) => void
  onBeginDrag: (item: HomeItem, element: HTMLElement, point: { x: number; y: number }) => void
  onOpen: (id: AppId, element: HTMLElement | null) => void
}) {
  const span = itemSpan(item)
  const ref = useRef<HTMLDivElement>(null)
  const press = useRef<{
    x: number
    y: number
    timer: ReturnType<typeof setTimeout> | null
    moved: boolean
  } | null>(null)

  useEffect(() => {
    registerCell(item.key, ref.current)
    return () => registerCell(item.key, null)
  }, [item.key, registerCell, pageIndex])

  const appId = item.kind === 'app' ? item.app : WIDGET_APP[item.widget]

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    const point = { x: event.clientX, y: event.clientY }
    const element = ref.current
    if (!element) return

    const start = () => {
      press.current = null
      onBeginDrag(item, element, point)
    }

    press.current = {
      ...point,
      moved: false,
      // In edit mode the icon is already loose, so it lifts on contact.
      timer: editing ? null : setTimeout(start, LONG_PRESS_MS),
    }
    if (editing) start()
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const state = press.current
    if (!state) return
    if (Math.hypot(event.clientX - state.x, event.clientY - state.y) > 9) {
      if (state.timer) clearTimeout(state.timer)
      state.moved = true
      press.current = null
    }
  }

  const onPointerUp = () => {
    const state = press.current
    press.current = null
    if (!state) return
    if (state.timer) clearTimeout(state.timer)
    if (!state.moved && !editing) onOpen(appId, ref.current)
  }

  const label =
    item.kind === 'app' ? apps[item.app].name : `${WIDGET_LABEL[item.widget]} widget`

  return (
    <motion.div
      ref={ref}
      layout
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        onOpen(appId, ref.current)
      }}
      transition={{ type: 'spring', stiffness: 520, damping: 42, mass: 0.7 }}
      style={{ gridColumn: `span ${span.cols}`, gridRow: `span ${span.rows}` }}
      className={cn(
        'relative min-w-0 touch-none select-none rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-white/70',
        dragging && 'opacity-0',
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <ItemFace item={item} jiggle={editing && !dragging} />
      {editing && item.kind === 'widget' && <ResizeHandle item={item} />}
    </motion.div>
  )
}

/** Everything visible about an item, shared by the grid and the drag layer. */
function ItemFace({
  item,
  jiggle,
  floating,
}: {
  item: HomeItem
  jiggle?: boolean
  floating?: boolean
}) {
  const wobble = jiggle
    ? {
        rotate: [-0.9, 0.9, -0.9],
        transition: { repeat: Infinity, duration: 0.28, ease: 'linear' as const },
      }
    : { rotate: 0 }

  if (item.kind === 'widget') {
    return (
      <motion.div animate={wobble} className="h-full w-full">
        <IosWidget item={item} />
      </motion.div>
    )
  }

  return (
    <motion.div
      animate={wobble}
      className="flex h-full flex-col items-center justify-start gap-[6px] pt-0.5"
    >
      <AppIcon
        id={item.app}
        className="aspect-square w-[min(60px,100%)] drop-shadow-[0_4px_10px_rgba(0,0,0,.38)]"
      />
      {!floating && (
        <span className="max-w-full truncate text-[11px] leading-none text-white [text-shadow:0_1px_3px_rgb(0_0_0/.6)]">
          {apps[item.app].name}
        </span>
      )}
    </motion.div>
  )
}

/* ───────────────────── widget resize handle ───────────────────── */

const SIZE_ORDER: WidgetSize[] = ['small', 'medium', 'large']

/**
 * iOS resizes widgets by dragging the corner between fixed sizes. The handle
 * measures the cell it started in, so the snap points are the real grid.
 */
function ResizeHandle({ item }: { item: WidgetItem }) {
  const setWidgetSize = useIos((s) => s.setWidgetSize)
  const dragging = useRef<{ box: DOMRect; cell: { w: number; h: number } } | null>(null)

  const onPointerDown = (event: React.PointerEvent) => {
    event.stopPropagation()
    const widget = (event.currentTarget as HTMLElement).parentElement
    const grid = widget?.parentElement
    if (!widget || !grid) return

    const box = widget.getBoundingClientRect()
    const gridBox = grid.getBoundingClientRect()
    dragging.current = {
      box,
      cell: {
        w: (gridBox.width - GAP_X * (COLUMNS - 1)) / COLUMNS,
        h: box.height / WIDGET_SPAN[item.size].rows,
      },
    }
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const state = dragging.current
    if (!state) return
    event.stopPropagation()

    const cols = Math.round((event.clientX - state.box.left) / (state.cell.w + GAP_X))
    const rows = Math.round((event.clientY - state.box.top) / (state.cell.h + GAP_Y))

    // Snap to the size whose footprint the finger is closest to.
    let best: WidgetSize = 'small'
    let score = Infinity
    for (const size of SIZE_ORDER) {
      const span = WIDGET_SPAN[size]
      const distance = Math.abs(span.cols - cols) + Math.abs(span.rows - rows) * 1.2
      if (distance < score) {
        score = distance
        best = size
      }
    }
    if (best !== item.size) {
      setWidgetSize(item.key, best)
      haptic(6)
    }
  }

  const onPointerUp = (event: React.PointerEvent) => {
    dragging.current = null
    event.stopPropagation()
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Resize ${WIDGET_LABEL[item.widget]} widget`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={(event) => {
          event.stopPropagation()
          const next = SIZE_ORDER[(SIZE_ORDER.indexOf(item.size) + 1) % SIZE_ORDER.length]
          setWidgetSize(item.key, next)
          haptic(6)
        }}
        className="absolute -bottom-1 -right-1 z-10 grid h-7 w-7 touch-none place-items-center rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,.4)]"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M10 3h3v3M6 13H3v-3M13 3l-4 4M3 13l4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  )
}

/* ───────────────────────────── dock ───────────────────────────── */

function Dock({ onOpen }: { onOpen: (id: AppId, element: HTMLElement | null) => void }) {
  return (
    <div
      className="relative z-20 mx-4 mb-1 flex shrink-0 items-center justify-around rounded-[30px] bg-white/12 px-3 py-2.5 backdrop-blur-2xl backdrop-saturate-150 [box-shadow:inset_0_0.5px_0_0_rgb(255_255_255/.2)]"
      style={{ marginBottom: 'max(0.25rem, env(safe-area-inset-bottom))' }}
    >
      {DOCK_APPS.map((id) => (
        <DockIcon key={id} id={id} onOpen={onOpen} />
      ))}
    </div>
  )
}

function DockIcon({
  id,
  onOpen,
}: {
  id: AppId
  onOpen: (id: AppId, element: HTMLElement | null) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={{ scale: 0.88 }}
      aria-label={apps[id].name}
      onClick={() => onOpen(id, ref.current)}
      className="w-[17%] max-w-[62px]"
    >
      <AppIcon id={id} className="w-full drop-shadow-[0_4px_10px_rgba(0,0,0,.4)]" />
    </motion.button>
  )
}

/* ───────────────────────────── glyphs ───────────────────────────── */

function SearchGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function LibraryDot({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'grid h-[15px] w-[15px] grid-cols-2 gap-[2px] rounded-[4px] p-[2px] transition-colors',
        active ? 'bg-white/90' : 'bg-white/30',
      )}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className={cn('rounded-[1px]', active ? 'bg-black/70' : 'bg-black/45')} />
      ))}
    </span>
  )
}
