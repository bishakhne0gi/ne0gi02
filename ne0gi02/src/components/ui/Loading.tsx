'use client'

/** Shared skeleton: a few settling hairlines, never a spinner. */
export function Loading({ lines = 5, label }: { lines?: number; label?: string }) {
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-10 py-12" aria-busy="true">
      {label && (
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-faint">{label}</p>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-[10px] animate-pulse rounded-full bg-sunken"
          style={{ width: `${58 + ((i * 37) % 40)}%`, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid h-full place-items-center px-10 text-center">
      <div className="max-w-[34ch] space-y-3">
        <p className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          The page came back blank.
        </p>
        <p className="text-[13.5px] leading-relaxed text-muted">
          Something interrupted the request. It is almost certainly the network and not you.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-line-strong px-4 py-1.5 text-[13px] text-ink transition-colors hover:bg-sunken"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
