'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppleLogo } from '@/components/os/SystemGlyphs'
import { useReducedMotion } from '@/hooks'

const DURATION = 2400

/** Boots once per tab. Decided during render, not in an effect. */
function shouldBoot() {
  try {
    if (sessionStorage.getItem('booted') === '1') return false
    sessionStorage.setItem('booted', '1')
  } catch {
    /* private mode, so it boots every time, which is harmless */
  }
  return true
}

/**
 * The cold boot, staged exactly like a Mac starting up: pure black, the
 * mark centred and slightly above middle, the thin determinate bar beneath.
 * Always black regardless of theme, because a machine powering on has no
 * appearance preference yet.
 *
 * The mark arrives via a mask wipe rather than a fade, so it reads as
 * being lit rather than faded in.
 *
 * Skippable with any key or click, and bypassed under reduced-motion.
 */
export function BootSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [booting, setBooting] = useState(() => !reduced && shouldBoot())

  useEffect(() => {
    if (!booting) {
      onDone()
      return
    }

    const finish = () => {
      setBooting(false)
      onDone()
    }

    const timer = setTimeout(finish, DURATION)
    const skip = () => {
      clearTimeout(timer)
      finish()
    }

    window.addEventListener('keydown', skip, { once: true })
    window.addEventListener('pointerdown', skip, { once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
    // `booting` only ever flips true → false, and the cleanup covers that.
  }, [booting, onDone])

  return (
    <AnimatePresence>
      {booting && (
        <motion.div
          key="boot"
          // The desktop comes up through the black, the way a Mac hands off.
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black"
        >
          {/* the mark, wiped in from below */}
          <div className="h-[76px] w-[66px] overflow-hidden">
            <motion.div
              initial={{ y: '104%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-full w-full items-center justify-center text-white"
            >
              <AppleLogo size={62} />
            </motion.div>
          </div>

          {/* the determinate bar, at the distance macOS puts it */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.45 }}
            className="mt-[68px] h-[5px] w-[212px] overflow-hidden rounded-full bg-white/[0.17]"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.7,
                duration: (DURATION - 950) / 1000,
                // Slower through the middle, like a real progress estimate.
                ease: [0.32, 0.12, 0.2, 1],
              }}
              style={{ transformOrigin: 'left' }}
              className="h-full w-full rounded-full bg-white"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
