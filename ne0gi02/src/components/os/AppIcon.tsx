import type { AppId } from '@/lib/content'

/**
 * Hand-drawn app icons. No icon library — these are the identity of the OS,
 * so they are authored, not imported.
 *
 * Every icon is a 100×100 superellipse ("squircle") with a vertical gradient,
 * a 1px inner top highlight and a hairline edge, matching how macOS icons
 * catch light.
 */

const SQUIRCLE =
  'M50 0C88 0 100 12 100 50C100 88 88 100 50 100C12 100 0 88 0 50C0 12 12 0 50 0Z'

function Shell({
  id,
  from,
  to,
  children,
}: {
  id: string
  from: string
  to: string
  children: React.ReactNode
}) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id}-bg)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {children}
        {/* light catch along the top edge */}
        <path d="M0 0h100v34C74 20 26 20 0 34Z" fill="#fff" opacity="0.12" />
      </g>
      <path d={SQUIRCLE} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="1" />
    </>
  )
}

/* ── Letter.app — cream paper, folded, with a vermillion wax seal ── */
function LetterIcon() {
  return (
    <Shell id="ic-letter" from="#FFFDF7" to="#E8DFC9">
      <rect x="18" y="14" width="64" height="76" rx="4" fill="#FFFEFA" />
      <rect x="18" y="14" width="64" height="76" rx="4" fill="none" stroke="rgba(0,0,0,.1)" />
      <g stroke="#B9AE95" strokeWidth="2.6" strokeLinecap="round">
        <path d="M29 32h30" />
        <path d="M29 43h42" />
        <path d="M29 52h42" />
        <path d="M29 61h34" />
      </g>
      {/* wax seal — the one wildcard accent */}
      <circle cx="63" cy="74" r="12" fill="#E2603D" />
      <circle cx="63" cy="74" r="12" fill="none" stroke="rgba(0,0,0,.16)" />
      <path
        d="M58 74h10M63 69v10"
        stroke="rgba(255,255,255,.72)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </Shell>
  )
}

/* ── Attachments.app — a folder holding a paperclip ── */
function ProjectsIcon() {
  return (
    <Shell id="ic-proj" from="#8FC3F2" to="#3D7FD4">
      <path
        d="M12 32a6 6 0 0 1 6-6h20l7 8h37a6 6 0 0 1 6 6v6H12Z"
        fill="#fff"
        opacity="0.34"
      />
      <path d="M12 40h76v34a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6Z" fill="#fff" opacity="0.9" />
      <path
        d="M58 50v18a9 9 0 0 1-18 0V48a5.5 5.5 0 0 1 11 0v18a2.5 2.5 0 0 1-5 0V52"
        fill="none"
        stroke="#2F62A8"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Shell>
  )
}

/* ── Curriculum.app — a spine of milestones ── */
function TimelineIcon() {
  return (
    <Shell id="ic-time" from="#F6C97A" to="#D98A2B">
      <path d="M30 20v60" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <g fill="#fff">
        <circle cx="30" cy="28" r="7" />
        <circle cx="30" cy="50" r="7" />
        <circle cx="30" cy="72" r="7" />
      </g>
      <g stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.9">
        <path d="M46 28h28" />
        <path d="M46 50h22" />
        <path d="M46 72h30" />
      </g>
    </Shell>
  )
}

/* ── Terminal.app — near-black with a prompt ── */
function TerminalIcon() {
  return (
    <Shell id="ic-term" from="#3A3D45" to="#101215">
      <rect x="10" y="10" width="80" height="80" rx="14" fill="#0B0C0E" />
      <rect x="10" y="10" width="80" height="17" rx="8" fill="#2A2D34" />
      <g>
        <circle cx="22" cy="18.5" r="3" fill="#FF5F57" />
        <circle cx="33" cy="18.5" r="3" fill="#FEBC2E" />
        <circle cx="44" cy="18.5" r="3" fill="#28C840" />
      </g>
      <path
        d="M24 44l12 10-12 10"
        fill="none"
        stroke="#7BE08A"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M44 66h22" stroke="#7BE08A" strokeWidth="5" strokeLinecap="round" />
    </Shell>
  )
}

/* ── Gallery.app — overlapping prints ── */
function GalleryIcon() {
  return (
    <Shell id="ic-gal" from="#F3F1EC" to="#CFC8BA">
      <g stroke="rgba(0,0,0,.12)">
        <rect x="20" y="24" width="52" height="44" rx="4" fill="#fff" transform="rotate(-8 46 46)" />
        <rect x="28" y="30" width="52" height="44" rx="4" fill="#fff" transform="rotate(6 54 52)" />
      </g>
      <g transform="rotate(6 54 52)">
        <rect x="28" y="30" width="52" height="44" rx="4" fill="#EAF1F6" />
        <path d="M28 62l14-14 11 11 9-8 18 17v2a4 4 0 0 1-4 4H32a4 4 0 0 1-4-4Z" fill="#5E9C6F" />
        <circle cx="44" cy="42" r="5.5" fill="#F2C14E" />
      </g>
    </Shell>
  )
}

/* ── About.app — an engraved monogram chip ── */
function AboutIcon() {
  return (
    <Shell id="ic-about" from="#C9CDD6" to="#7C8391">
      <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="3" opacity="0.85" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="34"
        fontFamily="Georgia, serif"
        fill="#fff"
        opacity="0.95"
      >
        B
      </text>
    </Shell>
  )
}

/* ── Reply.app — envelope, mid-open ── */
function ContactIcon() {
  return (
    <Shell id="ic-mail" from="#7FB6F5" to="#2C63C8">
      <rect x="16" y="28" width="68" height="46" rx="7" fill="#fff" />
      <path
        d="M18 34l30 22a4 4 0 0 0 4 0l30-22"
        fill="none"
        stroke="#2C63C8"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </Shell>
  )
}

const REGISTRY: Record<AppId, () => React.ReactElement> = {
  letter: LetterIcon,
  projects: ProjectsIcon,
  timeline: TimelineIcon,
  terminal: TerminalIcon,
  gallery: GalleryIcon,
  about: AboutIcon,
  contact: ContactIcon,
}

export function AppIcon({
  id,
  className,
  size,
}: {
  id: AppId
  className?: string
  size?: number
}) {
  const Art = REGISTRY[id]
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <Art />
    </svg>
  )
}
