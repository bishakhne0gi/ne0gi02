'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from '@/hooks'

const DURATION = 2200

/** Boots once per tab. Decided during render, not in an effect. */
function shouldBoot() {
  try {
    if (sessionStorage.getItem('booted') === '1') return false
    sessionStorage.setItem('booted', '1')
  } catch {
    /* private mode — boot every time, which is harmless */
  }
  return true
}

/**
 * The cold boot, staged like a Mac starting up: pure black, a centred mark,
 * and the thin determinate bar underneath it. Always black regardless of
 * theme — a machine powering on has no appearance preference yet.
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
          // The desktop fades up through the black, the way a Mac hands off.
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black"
        >
          {/* mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="grid h-[84px] w-[84px] place-items-center"
          >
            <Seal />
          </motion.div>

          {/* the determinate bar, at the distance macOS puts it */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-[72px] h-[5px] w-[212px] overflow-hidden rounded-full bg-white/16"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.45,
                duration: (DURATION - 700) / 1000,
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

/**
 * The boot mark. A wax seal rather than a fruit — this is a letter's
 * machine, and borrowing Apple's actual logo would be someone else's mark.
 */
function Seal() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-label="Booting" role="img">
      <defs>
        <radialGradient id="seal-face" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#F2F0EB" />
          <stop offset="100%" stopColor="#C9C4BA" />
        </radialGradient>
      </defs>

      {/* the pressed wax edge */}
      <path
        d="M50 4c6 0 8-3.4 13.6-1.9C69.2 3.6 69.6 8 74 11c4.4 3 8.6 1.6 11.6 6s.5 8 2.3 13.6C89.7 36.2 94 37 94 43.5c0 6.5-4.3 7.3-6.1 12.9-1.8 5.6.7 9.6-2.3 14s-7.2 3-11.6 6c-4.4 3-4.8 7.4-10.4 8.9C58 86.8 56 83.4 50 83.4c-6 0-8 3.4-13.6 1.9C30.8 83.8 30.4 79.4 26 76.4c-4.4-3-8.6-1.6-11.6-6s-.5-8-2.3-13.6C10.3 51.2 6 50.4 6 43.9c0-6.5 4.3-7.3 6.1-12.9 1.8-5.6-.7-9.6 2.3-14s7.2-3 11.6-6c4.4-3 4.8-7.4 10.4-8.9C42 .6 44 4 50 4Z"
        fill="url(#seal-face)"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="38"
        fontFamily="ui-serif, 'New York', Georgia, serif"
        fill="#14161A"
      >
        b
      </text>
    </svg>
  )
}
