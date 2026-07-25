'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Copy, PaperPlaneTilt } from '@phosphor-icons/react'
import { SocialGlyph } from '@/components/ui/SocialGlyph'
import { Loading } from '@/components/ui/Loading'
import { profileQuery } from '@/lib/queries'

/**
 * A compose window. It never posts anywhere — "Send" hands the drafted
 * message to the visitor's own mail client, which is the honest thing to do
 * with a portfolio and avoids asking anyone to trust a form.
 */
export function ContactApp() {
  const { data, isPending } = useQuery(profileQuery)
  const [subject, setSubject] = useState('An opportunity worth reading about')
  const [body, setBody] = useState(
    'Hi Bishakh,\n\nI read your letter. Here is what we are building —\n\n',
  )

  if (isPending || !data) return <Loading label="opening a draft" lines={4} />

  const mailto = `mailto:${data.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`

  return (
    <div className="@container flex h-full flex-col">
      {/* headers */}
      <div className="shrink-0 border-b border-line px-5 pb-3 pt-4">
        <Field label="To">
          <span className="text-[13.5px] text-ink">
            {data.name} <span className="text-faint">&lt;{data.email}&gt;</span>
          </span>
        </Field>

        <Field label="Subject">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-label="Subject"
            className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-faint"
          />
        </Field>
      </div>

      {/* body */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        aria-label="Message"
        spellCheck
        className="scroll-area min-h-0 flex-1 resize-none bg-transparent px-5 py-4 font-serif text-[15.5px] leading-[1.65] text-ink outline-none placeholder:text-faint"
      />

      {/* footer */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-line px-5 py-3">
        <a
          href={mailto}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <PaperPlaneTilt size={15} weight="fill" aria-hidden />
          Send in your mail app
        </a>

        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(data.email)}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] text-ink transition-colors hover:bg-sunken"
        >
          <Copy size={15} aria-hidden />
          Copy address
        </button>

        <div className="ml-auto flex gap-0.5">
          {data.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink"
            >
              <SocialGlyph icon={social.icon} size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-line py-1.5 last:border-0">
      <span className="w-[58px] shrink-0 text-[12.5px] text-faint">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
