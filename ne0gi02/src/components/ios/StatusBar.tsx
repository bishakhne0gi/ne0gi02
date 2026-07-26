'use client'

import { AnimatePresence, motion } from 'motion/react'
import { BatteryGlyph, WifiGlyph } from '@/components/os/SystemGlyphs'
import { useClock } from '@/hooks'
import { cn } from '@/lib/cn'

/**
 * The iOS status bar, split around a Dynamic Island. The island is the one
 * piece of hardware in the picture, so it never moves; the activity inside
 * it does, which is exactly how the real one reads.
 */
export function StatusBar({
  activity,
  tinted,
}: {
  /** Text for the live activity, if an app is open. */
  activity?: string | null
  /** Dark glyphs, for the few surfaces that are light. */
  tinted?: boolean
}) {
  const now = useClock()

  return (
    <header
      className={cn(
        'pointer-events-none relative z-[60] flex h-[54px] shrink-0 items-start justify-between px-7 pt-3 text-[15px] font-semibold',
        tinted ? 'text-black' : 'text-white',
      )}
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
    >
      <time suppressHydrationWarning className="w-[68px] pt-0.5 text-center tabular-nums">
        {now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ' '}
      </time>

      <DynamicIsland activity={activity} />

      <span className="flex w-[68px] items-center justify-end gap-1.5 pt-1">
        <SignalGlyph />
        <WifiGlyph size={15} />
        <BatteryGlyph percent={82} width={25} />
      </span>
    </header>
  )
}

function DynamicIsland({ activity }: { activity?: string | null }) {
  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
      className="pointer-events-auto absolute left-1/2 top-2 flex h-[34px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-black"
      style={{ minWidth: 126 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {activity ? (
          <motion.span
            key={activity}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2 px-4 text-[12px] font-medium text-white/90"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-[#30D158]" />
            {activity}
          </motion.span>
        ) : (
          <motion.span key="idle" className="block h-[34px] w-[126px]" />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** The four cellular bars. Lucide has no version of this one either. */
function SignalGlyph() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 4.6}
          y={11 - (i + 1) * 2.6}
          width="3.1"
          height={(i + 1) * 2.6}
          rx="1"
          opacity={i === 3 ? 0.35 : 1}
        />
      ))}
    </svg>
  )
}
