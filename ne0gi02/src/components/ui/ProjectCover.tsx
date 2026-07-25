/**
 * Cover art for projects with no screenshots. Rather than a grey placeholder
 * box, it draws a typographic plate — the title over a field derived from the
 * project's own id, so every cover is distinct but the set stays coherent.
 */
export function ProjectCover({ title, id }: { title: string; id: string }) {
  // Deterministic hue per project, spread across the warm-to-cool arc.
  const seed = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const hue = seed % 360

  return (
    <div
      className="relative flex h-full w-full items-end overflow-hidden p-4"
      style={{
        background: `linear-gradient(152deg,
          oklch(0.74 0.09 ${hue}) 0%,
          oklch(0.56 0.11 ${(hue + 38) % 360}) 100%)`,
      }}
    >
      {/* the mark, bled off the top-right corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-9 font-serif text-[8.5rem] leading-none text-white/22"
      >
        {title.charAt(0)}
      </span>

      {/* fine rule grid, for the plate texture */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 14px)',
        }}
      />

      <span className="relative font-serif text-[1.6rem] leading-none tracking-[-0.02em] text-white drop-shadow-sm">
        {title}
      </span>
    </div>
  )
}
