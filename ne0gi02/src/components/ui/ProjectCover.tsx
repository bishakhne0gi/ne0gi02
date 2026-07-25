import type { Project } from '@/lib/content'

/**
 * Cover art. Every project uses one — no screenshots — so the grid reads as
 * a single designed set rather than a wall of mismatched captures.
 *
 * Each cover is a two-stop mesh in its project's tone, overlaid with a
 * generative line field whose density and angle derive from the project id.
 * Same input, same output, and no two look alike.
 */

const TONES: Record<Project['tone'], [string, string, string]> = {
  violet: ['#7C5CFF', '#4A2FD6', '#C9BBFF'],
  amber: ['#F5A524', '#C2410C', '#FFE0A8'],
  teal: ['#2CC4B5', '#0E7C82', '#B4F0E7'],
  rose: ['#F2607E', '#B32450', '#FFCEDB'],
  indigo: ['#4F73E8', '#22307F', '#C3D2FF'],
  lime: ['#9BC53D', '#3F7118', '#E1F3B8'],
}

export function ProjectCover({
  title,
  id,
  tone,
  compact,
}: {
  title: string
  id: string
  tone: Project['tone']
  /** Card size — drops the line field and shrinks the type. */
  compact?: boolean
}) {
  const [from, to, light] = TONES[tone]
  const seed = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const angle = (seed % 60) - 30
  const lines = 14 + (seed % 9)

  return (
    <div
      className="relative flex h-full w-full items-end overflow-hidden"
      style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }}
    >
      {/* the light field, rotated per project */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`glow-${id}`} cx="24%" cy="14%" r="76%">
            <stop offset="0%" stopColor={light} stopOpacity="0.72" />
            <stop offset="100%" stopColor={light} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="120" fill={`url(#glow-${id})`} />

        <g
          transform={`rotate(${angle} 100 60)`}
          stroke={light}
          strokeOpacity="0.3"
          strokeWidth="0.5"
        >
          {Array.from({ length: lines }).map((_, i) => (
            <line
              key={i}
              x1={-60 + i * (320 / lines)}
              y1="-40"
              x2={-60 + i * (320 / lines)}
              y2="160"
            />
          ))}
        </g>
      </svg>

      {/* the mark, bled off the corner */}
      <span
        aria-hidden="true"
        className={cnJoin(
          'pointer-events-none absolute font-serif leading-none text-white/16',
          compact ? '-right-2 -top-7 text-[6.5rem]' : '-right-4 -top-12 text-[11rem]',
        )}
      >
        {title.charAt(0)}
      </span>

      <span
        className={cnJoin(
          'relative font-serif tracking-[-0.02em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,.25)]',
          compact ? 'p-3.5 text-[1.35rem] leading-[1.1]' : 'p-5 text-[2rem] leading-[1.05]',
        )}
      >
        {title}
      </span>
    </div>
  )
}

function cnJoin(...parts: string[]) {
  return parts.join(' ')
}
