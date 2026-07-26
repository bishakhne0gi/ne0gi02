import type { AppId } from '@/lib/content'

/**
 * App icons drawn in Apple's icon language rather than imported: a
 * superellipse plate, a vertical gradient, a specular highlight across the
 * top third, and a hairline edge. Each one quotes the macOS app it stands
 * in for: Notes, Finder, Calendar, Terminal, Photos, Contacts, Mail.
 */

const SQUIRCLE =
  'M50 0C88 0 100 12 100 50C100 88 88 100 50 100C12 100 0 88 0 50C0 12 12 0 50 0Z'

function Plate({
  id,
  from,
  to,
  children,
  flat,
}: {
  id: string
  from: string
  to: string
  children: React.ReactNode
  /** Skip the gloss, for icons that are mostly white paper. */
  flat?: boolean
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
        {!flat && <path d="M0 0h100v30C72 46 28 46 0 30Z" fill="#fff" opacity="0.16" />}
      </g>

      {/* hairline edge + inner top highlight, the way macOS icons catch light */}
      <path d={SQUIRCLE} fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="0.9" />
      <path
        d="M50 1.2C86.5 1.2 98.8 13 98.8 50"
        fill="none"
        stroke="rgba(255,255,255,.45)"
        strokeWidth="1.1"
      />
    </>
  )
}

/* ── Notes: the letter lives here ── */
function NotesIcon() {
  return (
    <Plate id="ic-notes" from="#FFE082" to="#FCC419" flat>
      {/* the paper */}
      <rect x="0" y="22" width="100" height="78" fill="#FFFDF4" />
      {/* header band */}
      <rect x="0" y="0" width="100" height="22" fill="#FFF3C4" />
      <rect x="0" y="21" width="100" height="1.4" fill="rgba(0,0,0,.07)" />
      {/* ruled lines */}
      <g stroke="#E7DCC0" strokeWidth="2" strokeLinecap="round">
        <path d="M14 36h72" />
        <path d="M14 50h72" />
        <path d="M14 64h72" />
        <path d="M14 78h48" />
      </g>
      {/* the one ink mark, a single flick */}
      <path
        d="M58 82c6-4 11-2 14 1"
        fill="none"
        stroke="#E2603D"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </Plate>
  )
}

/* ── Finder: the attachments ── */
function FinderIcon() {
  return (
    <Plate id="ic-finder" from="#37B4F6" to="#0E7FD4">
      {/* the split face: lighter left half */}
      <path d="M0 0h50v100H0Z" fill="#DCEEFB" opacity="0.95" />
      {/* eyes */}
      <g fill="#1F2933">
        <rect x="27" y="30" width="6.5" height="17" rx="3.25" />
        <rect x="66" y="30" width="6.5" height="17" rx="3.25" />
      </g>
      {/* the smile, crossing the seam */}
      <path
        d="M26 62c8 9 40 9 48 0"
        fill="none"
        stroke="#1F2933"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M50 62v9" stroke="#1F2933" strokeWidth="4" strokeLinecap="round" />
    </Plate>
  )
}

/* ── Calendar: the curriculum ── */
function CalendarIcon() {
  return (
    <Plate id="ic-cal" from="#FFFFFF" to="#EDEDF0" flat>
      <rect x="0" y="0" width="100" height="26" fill="#F4463C" />
      <text
        x="50"
        y="19"
        textAnchor="middle"
        fontSize="15"
        fontWeight="600"
        letterSpacing="1"
        fontFamily="var(--font-sans)"
        fill="#fff"
      >
        CV
      </text>
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fontSize="52"
        fontWeight="300"
        fontFamily="var(--font-sans)"
        fill="#1F2933"
      >
        9
      </text>
    </Plate>
  )
}

/* ── Terminal ── */
function TerminalIcon() {
  return (
    <Plate id="ic-term" from="#4A4E57" to="#16181C" flat>
      <rect x="7" y="7" width="86" height="86" rx="13" fill="#0A0B0D" />
      <rect x="7" y="7" width="86" height="18" rx="9" fill="#33373F" />
      <rect x="7" y="16" width="86" height="9" fill="#33373F" />
      <g>
        <circle cx="19" cy="16" r="3.2" fill="#FF5F57" />
        <circle cx="30" cy="16" r="3.2" fill="#FEBC2E" />
        <circle cx="41" cy="16" r="3.2" fill="#28C840" />
      </g>
      <path
        d="M22 42l13 11-13 11"
        fill="none"
        stroke="#F2F4F7"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M43 66h24" stroke="#F2F4F7" strokeWidth="5.5" strokeLinecap="round" />
    </Plate>
  )
}

/* ── Photos: the pinwheel ── */
function PhotosIcon() {
  const petals = [
    { r: -90, c: '#F6C445' },
    { r: -45, c: '#F2913D' },
    { r: 0, c: '#E4573E' },
    { r: 45, c: '#C64FA0' },
    { r: 90, c: '#6C5CE0' },
    { r: 135, c: '#3E8FE0' },
    { r: 180, c: '#3FB7A6' },
    { r: 225, c: '#6BBF48' },
  ]
  return (
    <Plate id="ic-photos" from="#FFFFFF" to="#F0F0F2" flat>
      <g style={{ mixBlendMode: 'multiply' }}>
        {petals.map((p) => (
          <ellipse
            key={p.r}
            cx="50"
            cy="34"
            rx="12"
            ry="20"
            fill={p.c}
            opacity="0.82"
            transform={`rotate(${p.r} 50 50)`}
          />
        ))}
      </g>
    </Plate>
  )
}

/* ── Contacts: the about plate ── */
function ContactsIcon() {
  return (
    <Plate id="ic-contacts" from="#FDFBF6" to="#E6E1D6" flat>
      {/* book spine */}
      <rect x="0" y="0" width="17" height="100" fill="#C8471F" />
      <rect x="14" y="0" width="4" height="100" fill="rgba(0,0,0,.14)" />
      {/* rings */}
      <g fill="#F3EFE6">
        <rect x="4" y="20" width="9" height="5" rx="2.5" />
        <rect x="4" y="47" width="9" height="5" rx="2.5" />
        <rect x="4" y="74" width="9" height="5" rx="2.5" />
      </g>
      {/* silhouette */}
      <circle cx="58" cy="40" r="14" fill="#A9A296" />
      <path d="M34 82c0-13 11-21 24-21s24 8 24 21Z" fill="#A9A296" />
    </Plate>
  )
}

/* ── Writing: a News-style plate, the masthead over ruled columns ── */
function WritingIcon() {
  return (
    <Plate id="ic-writing" from="#FFFFFF" to="#EDEDF0" flat>
      <rect x="0" y="0" width="100" height="30" fill="#E4573E" />
      <text
        x="50"
        y="22"
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        letterSpacing="-0.4"
        fontFamily="var(--font-sans)"
        fill="#fff"
      >
        ne0
      </text>
      {/* two ruled columns of body copy */}
      <g stroke="#B9B4AA" strokeWidth="2.6" strokeLinecap="round">
        <path d="M14 44h30M14 54h30M14 64h30M14 74h20" />
        <path d="M56 44h30M56 54h30M56 64h30M56 74h22" />
      </g>
    </Plate>
  )
}

/* ── Mail ── */
function MailIcon() {
  return (
    <Plate id="ic-mail" from="#3FA9FF" to="#0A6BE0">
      <rect x="13" y="27" width="74" height="46" rx="8" fill="#FCFDFF" />
      <path
        d="M15.5 32.5 45.6 55a7 7 0 0 0 8.8 0l30.1-22.5"
        fill="none"
        stroke="#0A6BE0"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Plate>
  )
}

const REGISTRY: Record<AppId, () => React.ReactElement> = {
  letter: NotesIcon,
  projects: FinderIcon,
  timeline: CalendarIcon,
  terminal: TerminalIcon,
  gallery: PhotosIcon,
  writing: WritingIcon,
  about: ContactsIcon,
  contact: MailIcon,
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
