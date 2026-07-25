'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { AppIcon } from '@/components/os/AppIcon'
import { APP_ORDER, apps } from '@/lib/apps'
import { prefetchApp } from '@/lib/queries'
import { useWindows } from '@/lib/window-store'
import { cn } from '@/lib/cn'
import type { AppId } from '@/lib/content'

/** Desktop shortcuts, top-right, the way a tidy desk keeps them. */
export function DesktopIcons() {
  const [selected, setSelected] = useState<AppId | null>(null)
  const open = useWindows((s) => s.open)
  const queryClient = useQueryClient()

  const shortcuts = APP_ORDER.filter((id) => apps[id].onDesktop)

  return (
    <div
      className="absolute left-5 top-[38px] z-[1] flex flex-col gap-1"
      onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
    >
      {shortcuts.map((id, i) => (
        <motion.button
          key={id}
          type="button"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onPointerEnter={() => prefetchApp(queryClient, id)}
          onClick={() => setSelected(id)}
          onDoubleClick={() => open(id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open(id)}
          className={cn(
            'group flex w-[92px] flex-col items-center gap-1.5 rounded-lg px-1.5 pb-1.5 pt-2 text-center outline-none transition-colors',
            selected === id ? 'bg-accent/22' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]',
          )}
        >
          <AppIcon id={id} className="h-12 w-12 drop-shadow-[0_2px_6px_rgba(0,0,0,.22)]" />
          <span
            className={cn(
              'rounded px-1 text-[11.5px] leading-tight tracking-[-0.005em]',
              selected === id
                ? 'bg-accent text-white'
                : 'text-white [text-shadow:0_1px_4px_rgb(0_0_0/.85)]',
            )}
          >
            {apps[id].name}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
