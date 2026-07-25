'use client'

import Image from 'next/image'
import { useSystem } from '@/lib/system-store'

/**
 * The desk — literally. The wallpaper is a photograph of the desk this was
 * written at, with VectorDrop open on the monitor, which is as close as a
 * portfolio gets to showing its own working.
 *
 * Over it sit a scrim (so chrome stays legible against a busy photograph),
 * a grain pass, a vignette, and the brightness dim driven by Control Centre.
 */
export function Wallpaper() {
  const brightness = useSystem((s) => s.brightness)

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black" aria-hidden="true">
      <Image
        src="/assets/wallpaper/desk.jpg"
        alt=""
        fill
        priority
        quality={78}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* legibility scrim — heavier in dark, barely there in light */}
      <div className="absolute inset-0 bg-black/22" />

      {/* the warm bloom from the desk lamp, pushed further */}
      <div
        className="drift absolute -right-[10%] top-[18%] h-[62vmax] w-[62vmax] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #FFB870 0%, transparent 62%)',
          animationDelay: '-6s',
        }}
      />
      {/* the cool key from the monitor */}
      <div
        className="drift absolute -left-[14%] top-[6%] h-[58vmax] w-[58vmax] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #7B6BFF 0%, transparent 64%)',
          animationDelay: '-19s',
        }}
      />

      <div className="grain-layer absolute inset-0 opacity-[0.14]" />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(128% 96% at 50% 44%, transparent 38%, rgb(0 0 0 / 0.5) 100%)',
        }}
      />

      {/* Control Centre brightness — a real dim, not a decoration. */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: (100 - brightness) / 145 }}
      />
    </div>
  )
}
