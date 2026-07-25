'use client'

import { Fragment } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useWindows } from '@/lib/window-store'
import type { AppId } from '@/lib/content'

/**
 * The letter's inline syntax. Deliberately tiny — three rules, no dependency:
 *
 *   **bold**            → semibold
 *   *italic*            → italic
 *   [[label|appId]]     → an "attachment": clicking opens that window
 */
const TOKEN = /(\[\[[^\]]+\]\]|\*\*[^*]+\*\*|\*[^*]+\*)/g

export function RichText({ text }: { text: string }) {
  const open = useWindows((s) => s.open)

  return (
    <>
      {text.split(TOKEN).map((chunk, i) => {
        if (!chunk) return null

        if (chunk.startsWith('[[')) {
          const [label, target] = chunk.slice(2, -2).split('|')
          return (
            <button
              key={i}
              type="button"
              onClick={() => open(target as AppId)}
              className="group/link relative inline cursor-pointer font-medium text-accent underline decoration-accent/35 decoration-1 underline-offset-[3px] transition-colors hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {label}
              <ArrowUpRight
                size="0.72em"
                strokeWidth={2.4}
                aria-hidden
                className="ml-[2px] inline-block translate-y-[-0.08em] opacity-55 transition-transform duration-200 group-hover/link:translate-x-[1px] group-hover/link:translate-y-[-0.16em]"
              />
            </button>
          )
        }

        if (chunk.startsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {chunk.slice(2, -2)}
            </strong>
          )
        }

        if (chunk.startsWith('*')) {
          return (
            <em key={i} className="italic">
              {chunk.slice(1, -1)}
            </em>
          )
        }

        return <Fragment key={i}>{chunk}</Fragment>
      })}
    </>
  )
}
