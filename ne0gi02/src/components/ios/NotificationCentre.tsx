'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppIcon } from '@/components/os/AppIcon'
import { apps } from '@/lib/apps'
import { profile, timeline, writing } from '@/lib/content'
import { useClock } from '@/hooks'
import type { AppId } from '@/lib/content'

interface Note {
  id: string
  app: AppId
  when: string
  title: string
  body: string
}

/** Every notification is a real thing in the content, addressed to the reader. */
const NOTES: Note[] = [
  {
    id: 'letter',
    app: 'letter',
    when: 'now',
    title: 'A Letter',
    body: 'Dear Sir/Ma’am, I am writing to introduce myself. Tap to read it in full.',
  },
  {
    id: 'mail',
    app: 'contact',
    when: '1m ago',
    title: 'Draft ready',
    body: `A reply to ${profile.name} is already composed. It only needs your half.`,
  },
  {
    id: 'writing',
    app: 'writing',
    when: writing[0].date,
    title: writing[0].title,
    body: writing[0].excerpt,
  },
  {
    id: 'timeline',
    app: 'timeline',
    when: timeline[2].year,
    title: timeline[2].title,
    body: `${timeline[2].org} · ${timeline[2].detail ?? ''}`,
  },
  {
    id: 'projects',
    app: 'projects',
    when: '2h ago',
    title: 'VectorDrop',
    body: '500+ users. Any image into an editable vector, in seconds.',
  },
]

/**
 * Notification Centre, pulled down from the left of the notch. It is the
 * lock screen: clock, date, and a stack of cards that each open something.
 */
export function NotificationCentre({ onOpen }: { onOpen: (id: AppId) => void }) {
  const now = useClock()
  const [cleared, setCleared] = useState<string[]>([])
  const notes = NOTES.filter((note) => !cleared.includes(note.id))

  return (
    <div className="flex h-full flex-col px-5 pb-6" style={{ paddingTop: 'calc(max(0.75rem, env(safe-area-inset-top)) + 34px)' }}>
      <div className="shrink-0 pb-6 pt-4 text-center">
        <p suppressHydrationWarning className="text-[15px] font-medium text-white/70">
          {now
            ? now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
            : ' '}
        </p>
        <p
          suppressHydrationWarning
          className="mt-1 text-[74px] font-light leading-none tracking-[-0.04em] text-white tabular-nums"
        >
          {now ? now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ' '}
        </p>
      </div>

      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex items-center justify-between px-1 pb-2">
          <p className="text-[12.5px] font-medium uppercase tracking-[0.12em] text-white/50">
            Notification Centre
          </p>
          {notes.length > 0 && (
            <button
              type="button"
              onClick={() => setCleared(NOTES.map((note) => note.id))}
              className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white"
            >
              Clear all
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 38 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.7, right: 0.02 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -90) setCleared((ids) => [...ids, note.id])
              }}
              className="mb-2.5 overflow-hidden rounded-[20px] bg-white/14 backdrop-blur-2xl"
            >
              <button
                type="button"
                onClick={() => onOpen(note.app)}
                className="flex w-full gap-3 p-3.5 text-left active:bg-white/10"
              >
                <AppIcon id={note.app} className="h-9 w-9 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12px] uppercase tracking-[0.08em] text-white/55">
                      {apps[note.app].name}
                    </span>
                    <span className="shrink-0 text-[11.5px] text-white/45">{note.when}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[14.5px] font-semibold text-white">
                    {note.title}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-white/70">
                    {note.body}
                  </span>
                </span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <p className="pt-8 text-center text-[13.5px] text-white/45">No older notifications.</p>
        )}

        <p className="pb-2 pt-4 text-center text-[12px] text-white/35">
          Swipe a card left to clear it. Swipe up to go back.
        </p>
      </div>
    </div>
  )
}
