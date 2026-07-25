'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowSquareOut, GithubLogo, Sparkle } from '@phosphor-icons/react'
import { ProjectCover } from '@/components/ui/ProjectCover'
import { ErrorState, Loading } from '@/components/ui/Loading'
import { projectsQuery } from '@/lib/queries'
import { cn } from '@/lib/cn'
import type { Project, ProjectCategory } from '@/lib/content'

type Filter = 'all' | ProjectCategory

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Attachments' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'product', label: 'Products' },
]

/** A Finder for the work: sidebar, grid of items, and a detail view. */
export function ProjectsApp({ fullscreen = false }: { fullscreen?: boolean }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<Project | null>(null)

  const { data, isPending, isError, refetch } = useQuery(projectsQuery)

  const visible = useMemo(
    () =>
      !data ? [] : filter === 'all' ? data.projects : data.projects.filter((p) => p.category === filter),
    [data, filter],
  )

  if (isPending) return <Loading label="reading the attachments" lines={4} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="@container flex h-full">
      {/* ── sidebar ── */}
      {!fullscreen && (
        <aside className="hidden w-[186px] shrink-0 flex-col gap-0.5 border-r border-line bg-sunken/60 p-2.5 @[680px]:flex">
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
                filter === f.id
                  ? 'bg-accent text-white'
                  : 'text-ink hover:bg-black/[0.05] dark:hover:bg-white/[0.06]',
              )}
            >
              {f.label}
            </button>
          ))}

          <div className="my-3 h-px bg-line" />

          <p className="px-2.5 pb-1.5 text-[10.5px] uppercase tracking-[0.16em] text-faint">
            Smaller builds
          </p>
          <ul className="space-y-px">
            {data.experiments.map((e) => (
              <li key={e.title}>
                <a
                  href={e.live ?? e.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate rounded-md px-2.5 py-[5px] text-[12.5px] text-muted transition-colors hover:bg-black/[0.05] hover:text-ink dark:hover:bg-white/[0.06]"
                >
                  {e.title}
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
              className="p-5 @[560px]:p-7"
            >
              <div className="grid grid-cols-1 gap-4 @[560px]:grid-cols-2 @[900px]:grid-cols-3">
                {visible.map((project, i) => (
                  <Card key={project.id} project={project} index={i} onOpen={() => setOpen(project)} />
                ))}
              </div>

              {fullscreen && (
                <div className="mt-8 border-t border-line pt-5">
                  <p className="pb-2 text-[10.5px] uppercase tracking-[0.16em] text-faint">
                    Smaller builds
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {data.experiments.map((e) => (
                      <li key={e.title}>
                        <a
                          href={e.live ?? e.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate py-1 text-[13px] text-muted underline decoration-line-strong underline-offset-2"
                        >
                          {e.title}
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
        project.featured && '@[560px]:col-span-2',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-sunken',
          // A card spanning two columns needs a wider crop, or it dominates.
          project.featured ? 'aspect-[16/10] @[560px]:aspect-[24/9]' : 'aspect-[16/10]',
        )}
      >
        {project.images[0] ? (
          <Image
            src={project.images[0]}
            alt=""
            fill
            sizes="(max-width: 900px) 50vw, 300px"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]"
          />
        ) : (
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]">
            <ProjectCover title={project.title} id={project.id} />
          </div>
        )}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2 py-[3px] text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      <div className="space-y-1.5 p-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-[19px] leading-none tracking-[-0.015em] text-ink">
            {project.title}
          </h3>
          <span className="font-mono text-[11px] text-faint">{project.year}</span>
        </div>
        <p className="text-[13px] leading-snug text-muted">{project.blurb}</p>
        {project.accolades[0] && (
          <p className="flex items-start gap-1.5 pt-1 text-[11.5px] leading-snug text-flame">
            <Sparkle size={13} weight="fill" className="mt-px shrink-0" aria-hidden />
            <span className="line-clamp-1">{project.accolades[0]}</span>
          </p>
        )}
      </div>
    </motion.button>
  )
}

/* ───────────────────────────── detail ───────────────────────────── */

function Detail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [active, setActive] = useState(0)

  return (
    <article className="p-5 @[560px]:p-7">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1 text-[12.5px] text-muted transition-colors hover:bg-sunken hover:text-ink"
      >
<ArrowLeft size={14} weight="bold" aria-hidden /> All attachments
      </button>

      <div className="relative aspect-[16/9] overflow-hidden rounded-panel bg-sunken ring-[0.5px] ring-line">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {project.images[active] ? (
              <Image
                src={project.images[active]}
                alt={`${project.title}, view ${active + 1}`}
                fill
                sizes="(max-width: 900px) 100vw, 760px"
                className="object-cover"
              />
            ) : (
              <ProjectCover title={project.title} id={project.id} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {project.images.length > 1 && (
        <div className="mt-2.5 flex gap-2">
          {project.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View ${i + 1}`}
              className={cn(
                'relative h-12 w-[72px] overflow-hidden rounded-md ring-[0.5px] transition-all',
                i === active ? 'ring-2 ring-accent' : 'opacity-60 ring-line hover:opacity-100',
              )}
            >
              <Image src={src} alt="" fill sizes="72px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <header className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-serif text-[clamp(1.6rem,4cqi,2.1rem)] leading-none tracking-[-0.025em] text-ink">
          {project.title}
        </h2>
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-faint">
          {project.category} · {project.year}
        </span>
      </header>

      <p className="mt-3.5 max-w-[62ch] text-[14.5px] leading-[1.65] text-muted">
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
              <Sparkle size={15} weight="fill" className="mt-[3px] shrink-0 text-flame" aria-hidden />
              {a}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-7 flex flex-wrap gap-2.5">
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-surface-solid transition-opacity hover:opacity-85"
          >
            View it live
            <ArrowSquareOut size={15} weight="bold" aria-hidden />
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
    </article>
  )
}
