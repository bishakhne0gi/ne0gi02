'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { MenuBar } from '@/components/os/MenuBar'
import { Dock } from '@/components/os/Dock'
import { Window } from '@/components/os/Window'
import { DesktopIcons } from '@/components/os/DesktopIcons'
import { Widgets } from '@/components/os/Widgets'
import { BootSequence } from '@/components/os/BootSequence'
import { AppSurface, BARE_APPS, DARK_CHROME_APPS } from '@/components/apps'
import { useWindows } from '@/lib/window-store'
import { letterQuery } from '@/lib/queries'
import { useViewport } from '@/hooks'

export function Desktop() {
  const viewport = useViewport()
  const layout = useWindows((s) => s.layout)
  const laidOut = useWindows((s) => s.laidOut)
  const order = useWindows((s) => s.order)
  const windows = useWindows((s) => s.windows)
  const openApp = useWindows((s) => s.open)
  const focused = useWindows((s) => s.focused)
  const close = useWindows((s) => s.close)
  const toggleMinimize = useWindows((s) => s.toggleMinimize)

  const queryClient = useQueryClient()
  const [booted, setBooted] = useState(false)

  /* Position windows once the viewport is known, and again on resize. */
  useEffect(() => {
    if (viewport) layout(viewport)
  }, [viewport, layout])

  /* The letter is the front door, so open it as the boot completes. */
  const onBooted = useCallback(() => setBooted(true), [])

  useEffect(() => {
    if (!booted || !laidOut) return
    queryClient.prefetchQuery(letterQuery)
    openApp('letter')
  }, [booted, laidOut, openApp, queryClient])

  /* ⌘W closes, ⌘M minimises: the two shortcuts people actually try. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || !focused) return
      if (e.key === 'w') {
        e.preventDefault()
        close(focused)
      }
      if (e.key === 'm') {
        e.preventDefault()
        toggleMinimize(focused)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused, close, toggleMinimize])

  return (
    <>
      <BootSequence onDone={onBooted} />

      <main className="fixed inset-0 overflow-hidden">
        <MenuBar />
        <Widgets />
        <DesktopIcons />

        {/* window layer */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {order
              .filter((id) => windows[id].open)
              .map((id) => (
                <Window
                  key={id}
                  id={id}
                  bare={BARE_APPS.includes(id)}
                  darkChrome={DARK_CHROME_APPS.includes(id)}
                >
                  <AppSurface id={id} />
                </Window>
              ))}
          </AnimatePresence>
        </div>

        <Dock />
      </main>
    </>
  )
}
