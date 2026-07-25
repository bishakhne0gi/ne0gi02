/**
 * The desk surface. Four drifting radial fields over a base wash, plus a
 * grain pass and a vignette — composited in CSS so it costs no JS and
 * survives `prefers-reduced-motion` by simply standing still.
 */
export function Wallpaper() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(168deg, var(--wall-1) 0%, var(--wall-2) 52%, var(--wall-3) 100%)',
        }}
      />

      {/* warm key light, upper left */}
      <div
        className="drift absolute -left-[18%] -top-[26%] h-[78vmax] w-[78vmax] rounded-full opacity-70 blur-[64px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--wall-glow) 0%, transparent 62%)',
          animationDelay: '-4s',
        }}
      />

      {/* cool fill, lower right */}
      <div
        className="drift absolute -bottom-[30%] -right-[16%] h-[70vmax] w-[70vmax] rounded-full opacity-45 blur-[72px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 34%, transparent) 0%, transparent 64%)',
          animationDelay: '-17s',
        }}
      />

      {/* the one warm accent bloom */}
      <div
        className="drift absolute right-[22%] top-[6%] h-[38vmax] w-[38vmax] rounded-full opacity-[0.18] blur-[80px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--flame) 0%, transparent 66%)',
          animationDelay: '-9s',
        }}
      />

      {/* grain */}
      <div className="grain-layer absolute inset-0 opacity-[0.16] dark:opacity-[0.22]" />

      {/* vignette — pulls focus to the centre of the desk */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, transparent 40%, rgb(0 0 0 / 0.16) 100%)',
        }}
      />
    </div>
  )
}
