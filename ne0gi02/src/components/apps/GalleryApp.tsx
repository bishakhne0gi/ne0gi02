'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ErrorState, Loading } from '@/components/ui/Loading'
import { galleryQuery } from '@/lib/queries'

/** Hall of Fame: a contact sheet, with a lightbox. */
export function GalleryApp() {
  const { data, isPending, isError, refetch } = useQuery(galleryQuery)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const count = data?.photos.length ?? 0

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => ((i ?? 0) + 1) % count)
      if (e.key === 'ArrowLeft') setLightbox((i) => ((i ?? 0) - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, count])

  if (isPending) return <Loading label="developing the prints" lines={4} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="@container relative h-full overflow-hidden">
      <div className="scroll-area h-full overflow-y-auto p-5 @[560px]:p-7">
        <header className="mb-6 border-b border-line pb-5">
          <p className="font-serif text-[clamp(1.4rem,4cqi,1.9rem)] leading-tight tracking-[-0.02em] text-ink">
            “{data.caption.quote}”
          </p>
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-flame">
            — {data.caption.attribution}
          </p>
        </header>

        <div className="columns-2 gap-3 @[560px]:columns-3 [&>*]:mb-3">
          {data.photos.map((photo, i) => (
            <motion.button
              key={photo.src}
              type="button"
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.035, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative block w-full overflow-hidden rounded-panel bg-sunken ring-[0.5px] ring-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 560px) 50vw, 300px"
                className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-left text-[11.5px] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {photo.caption}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightbox(null)}
            className="absolute inset-0 z-20 grid place-items-center bg-black/82 p-6 backdrop-blur-md"
          >
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-full w-full max-w-[42rem]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-11 right-0 flex gap-1">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => setLightbox((i) => ((i ?? 0) - 1 + count) % count)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/22"
                >
                  <ChevronLeft size={16} strokeWidth={2.4} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => setLightbox((i) => ((i ?? 0) + 1) % count)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/22"
                >
                  <ChevronRight size={16} strokeWidth={2.4} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setLightbox(null)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/22"
                >
                  <X size={16} strokeWidth={2.4} aria-hidden />
                </button>
              </div>
              <Image
                src={data.photos[lightbox].src}
                alt={data.photos[lightbox].caption}
                width={data.photos[lightbox].width}
                height={data.photos[lightbox].height}
                className="h-auto max-h-[70vh] w-full rounded-panel object-contain"
              />
              <figcaption className="mt-3 flex items-center justify-between text-[12.5px] text-white/75">
                <span>{data.photos[lightbox].caption}</span>
                <span className="font-mono text-[11px]">
                  {lightbox + 1} / {count}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
