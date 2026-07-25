'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowSquareOut, EnvelopeSimple } from '@phosphor-icons/react'
import { SocialGlyph } from '@/components/ui/SocialGlyph'
import { Loading } from '@/components/ui/Loading'
import { profileQuery } from '@/lib/queries'
import { useWindows } from '@/lib/window-store'
import { useReducedMotion } from '@/hooks'

/** "About This Mac", for a person. Spec sheet, portrait, one primary action. */
export function AboutApp() {
  const { data, isPending } = useQuery(profileQuery)
  const open = useWindows((s) => s.open)
  const reduced = useReducedMotion()
  const [titleAt, setTitleAt] = useState(0)

  const titles = data?.titles ?? []

  useEffect(() => {
    if (reduced || titles.length < 2) return
    const timer = setInterval(() => setTitleAt((i) => (i + 1) % titles.length), 2600)
    return () => clearInterval(timer)
  }, [reduced, titles.length])

  if (isPending || !data) return <Loading label="reading the plate" lines={4} />

  const specs: [string, string][] = [
    ['Role', `${data.role}, ${data.company}`],
    ['Based in', data.location],
    ['From', data.origin],
    ['Known as', data.handle],
    ['Writes', 'TypeScript, Rust, Python'],
  ]

  return (
    <div className="@container grid min-h-full place-items-center px-7 py-9">
      <div className="w-full max-w-[26rem] text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto h-[104px] w-[104px] overflow-hidden rounded-full bg-sunken ring-[0.5px] ring-line-strong"
        >
          <Image
            src={data.avatar}
            alt={data.name}
            width={208}
            height={208}
            className="h-full w-full object-cover object-top"
            priority
          />
        </motion.div>

        <h2 className="mt-5 font-serif text-[clamp(1.7rem,5cqi,2.2rem)] leading-none tracking-[-0.025em] text-ink">
          {data.name}
        </h2>

        <div className="mt-2 h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={titles[titleAt]}
              initial={reduced ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? undefined : { y: -14, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="text-[13.5px] text-muted"
            >
              {titles[titleAt]}
            </motion.p>
          </AnimatePresence>
        </div>

        <dl className="mt-7 space-y-0 text-left">
          {specs.map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-line py-2 last:border-0"
            >
              <dt className="text-[12.5px] text-faint">{label}</dt>
              <dd className="text-[13px] text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => open('letter')}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-surface-solid transition-opacity hover:opacity-85"
          >
            <EnvelopeSimple size={15} weight="fill" aria-hidden />
            Read the letter
          </button>
          <a
            href={data.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-[13px] text-ink transition-colors hover:bg-sunken"
          >
            Résumé
            <ArrowSquareOut size={14} weight="bold" aria-hidden />
          </a>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-1 border-t border-line pt-5">
          {data.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="grid h-9 w-9 place-items-center rounded-full text-muted transition-all duration-200 hover:-translate-y-0.5 hover:bg-sunken hover:text-ink"
            >
              <SocialGlyph icon={social.icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
