'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Sparkles, SquareArrowOutUpRight } from 'lucide-react'
// Lucide 1.0 removed every brand mark upstream, so the GitHub logo stays on
// Phosphor rather than being swapped for a semantically-wrong stand-in.
import { GithubLogo } from '@phosphor-icons/react'
import { ProjectCover } from '@/components/ui/ProjectCover'
import { ErrorState, Loading } from '@/components/ui/Loading'
import { projectsQuery } from '@/lib/queries'
import { cn } from '@/lib/cn'
import type { Project, ProjectCategory } from '@/lib/content'

type Filter = 'all' | ProjectCategory

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Attachments' },
  { id: 'product', label: 'My Products' },
  { id: 'client', label: 'Client Work' },
]

/** A Finder for the work: sidebar, grid of items, and a detail view. */
export function ProjectsApp({ fullscreen = false }: { fullscreen?: boolean }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<Project | null>(null)

  const { data, isPending, isError, refetch } = useQuery(projectsQuery)

  const visible = useMemo(
    () =>
      !data
        ? []
        : filter === 'all'
          ? data.projects
          : data.projects.filter((p) => p.category === filter),
    [data, filter],
  )

  if (isPending) return <Loading label="reading the attachments" lines={4} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="@container flex h-full">
      {/* ── sidebar ── */}
      {!fullscreen && (
        <aside className="scroll-area hidden w-[196px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-line bg-sidebar p-2.5 backdrop-blur-xl @[700px]:flex">
          <p className="px-2.5 pb-1.5 pt-1 text-[10.5px] uppercase tracking-[0.16em] text-faint">
            Enclosed
          </p>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id)
                setOpen(null)
              }}
              className={cn(
                'rounded-md px-2.5 py-[6px] text-left text-[13px] transition-colors',
                filter === f.id ? 'bg-accent text-white' : 'text-ink hover:bg-ink/[0.07]',
              )}
            >
              {f.label}
            </button>
          ))}

          <div className="my-3 h-px bg-line" />

          <p className="px-2.5 pb-1.5 text-[10.5px] uppercase tracking-[0.16em] text-faint">
            Earlier: hackathons
          </p>
          <ul className="space-y-px">
            {data.experiments.map((e) => (
              <li key={e.title}>
                <a
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md px-2.5 py-1.5 transition-colors hover:bg-ink/[0.07]"
                >
                  <span className="block truncate text-[12.5px] text-ink">{e.title}</span>
                  <span className="block truncate text-[11px] text-faint">{e.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* ── main ── */}
      <div className="scroll-area @container min-w-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key={open.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
              <Detail project={open} onBack={() => setOpen(null)} />
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${filter}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 @[560px]:p-6"
            >
              <div className="grid grid-cols-1 gap-4 @[540px]:grid-cols-2 @[880px]:grid-cols-3">
                {visible.map((project, i) => (
                  <Card
                    key={project.id}
                    project={project}
                    index={i}
                    onOpen={() => setOpen(project)}
                  />
                ))}
              </div>

              {fullscreen && (
                <div className="mt-8 border-t border-line pt-5">
                  <p className="pb-2 text-[10.5px] uppercase tracking-[0.16em] text-faint">
                    Earlier: hackathons
                  </p>
                  <ul className="space-y-2">
                    {data.experiments.map((e) => (
                      <li key={e.title}>
                        <a href={e.href} target="_blank" rel="noopener noreferrer" className="block">
                          <span className="block text-[13.5px] text-ink">{e.title}</span>
                          <span className="block text-[11.5px] text-faint">{e.note}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ───────────────────────────── card ───────────────────────────── */

function Card({
  project,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className={cn(
        'group overflow-hidden rounded-panel bg-raised text-left ring-[0.5px] ring-line transition-shadow duration-300 hover:shadow-window-idle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        project.featured && '@[540px]:col-span-2',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          project.featured ? 'aspect-[16/10] @[540px]:aspect-[24/9]' : 'aspect-[16/10]',
        )}
      >
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]">
          <ProjectCover
            title={project.title}
            id={project.id}
            tone={project.tone}
            compact={!project.featured}
          />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2 py-[3px] text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      <div className="space-y-1.5 p-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-[17px] font-semibold leading-none tracking-[-0.022em] text-ink">
            {project.title}
          </h3>
          <span className="shrink-0 font-mono text-[11px] text-faint">{project.year}</span>
        </div>
        <p className="text-[13px] leading-snug text-muted">{project.blurb}</p>

        {project.metrics.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5">
            {project.metrics.slice(0, 3).map((m) => (
              <span key={m.label} className="text-[11.5px] leading-tight">
                <span className="font-semibold text-ink">{m.value}</span>{' '}
                <span className="text-faint">{m.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  )
}

/* ───────────────────────────── detail ───────────────────────────── */

function Detail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <article className="p-5 @[560px]:p-7">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1 text-[12.5px] text-muted transition-colors hover:bg-sunken hover:text-ink"
      >
        <ArrowLeft size={14} strokeWidth={2.4} aria-hidden /> All attachments
      </button>

      <div className="relative aspect-[21/9] overflow-hidden rounded-panel ring-[0.5px] ring-line">
        <ProjectCover title={project.title} id={project.id} tone={project.tone} />
      </div>

      <header className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-[clamp(1.6rem,4cqi,2.1rem)] font-bold leading-none tracking-[-0.035em] text-ink">
          {project.title}
        </h2>
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-faint">
          {project.category} · {project.year}
        </span>
      </header>

      {project.metrics.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3 border-y border-line py-4">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <p className="text-[clamp(1.2rem,3cqi,1.6rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
                {m.value}
              </p>
              <p className="mt-1 text-[11.5px] leading-tight text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-5 max-w-[64ch] text-[14.5px] leading-[1.65] text-muted">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-sunken px-2.5 py-1 font-mono text-[11.5px] text-muted ring-[0.5px] ring-line"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.accolades.length > 0 && (
        <ul className="mt-6 space-y-1.5 border-t border-line pt-5">
          {project.accolades.map((a) => (
            <li key={a} className="flex items-start gap-2.5 text-[13.5px] text-ink">
              <Sparkles
                size={15}
                fill="currentColor"
                className="mt-[3px] shrink-0 text-flame"
                aria-hidden
              />
              {a}
            </li>
          ))}
        </ul>
      )}

      {(project.live || project.github) && (
        <div className="mt-7 flex flex-wrap gap-2.5">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-surface-solid transition-opacity hover:opacity-85"
            >
              View it live
              <SquareArrowOutUpRight size={15} strokeWidth={2.4} aria-hidden />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-[13px] text-ink transition-colors hover:bg-sunken"
            >
              <GithubLogo size={15} weight="fill" aria-hidden />
              Source
            </a>
          )}
        </div>
      )}
    </article>
  )
}
