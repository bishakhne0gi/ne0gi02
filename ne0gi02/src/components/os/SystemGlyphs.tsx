/**
 * The system glyphs that live in the menu bar and control centre.
 * Drawn rather than imported so they share one optical weight and sit on
 * the same 24×24 grid as everything else in the chrome.
 */

export function AppleLogo({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

/** The two stacked pills of the Control Centre icon. */
export function ControlCentreGlyph({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <rect x="3.5" y="3.6" width="17" height="7.2" rx="3.6" />
        <rect x="3.5" y="13.2" width="17" height="7.2" rx="3.6" />
      </g>
      <circle cx="16.9" cy="7.2" r="1.9" fill="currentColor" />
      <circle cx="7.1" cy="16.8" r="1.9" fill="currentColor" />
    </svg>
  )
}

export function WifiGlyph({ size = 15, level = 3 }: { size?: number; level?: 0 | 1 | 2 | 3 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="12" cy="18.4" r="1.75" opacity={level >= 1 ? 1 : 0.28} />
        <path
          d="M12 11.6c1.9 0 3.65.72 4.96 1.9l-1.9 2.02A5.4 5.4 0 0 0 12 14.1a5.4 5.4 0 0 0-3.06 1.42l-1.9-2.02A7.35 7.35 0 0 1 12 11.6Z"
          opacity={level >= 2 ? 1 : 0.28}
        />
        <path
          d="M12 5.6c3.55 0 6.8 1.37 9.2 3.6l-1.9 2.02A11.15 11.15 0 0 0 12 8.1c-2.8 0-5.36 1.02-7.3 2.72l-1.9-2.02A13.6 13.6 0 0 1 12 5.6Z"
          opacity={level >= 3 ? 1 : 0.28}
        />
      </g>
    </svg>
  )
}

export function BatteryGlyph({
  percent = 82,
  charging = false,
  width = 26,
}: {
  percent?: number
  charging?: boolean
  width?: number
}) {
  const fill = Math.max(2, Math.min(100, percent)) / 100
  const low = percent <= 20

  return (
    <svg width={width} height={(width * 13) / 26} viewBox="0 0 26 13" aria-hidden="true">
      {/* shell */}
      <rect
        x="0.6"
        y="0.6"
        width="21.4"
        height="11.8"
        rx="3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.42"
      />
      {/* nub */}
      <path
        d="M23.4 4.4c1.1.4 1.7 1.2 1.7 2.1s-.6 1.7-1.7 2.1Z"
        fill="currentColor"
        opacity="0.42"
      />
      {/* charge */}
      <rect
        x="2.1"
        y="2.1"
        width={18.4 * fill}
        height="8.8"
        rx="2.1"
        fill={low && !charging ? '#FF453A' : 'currentColor'}
      />
      {charging && (
        <path
          d="M12.2 2.4 8.4 7.2h2.7l-1 3.6 3.9-4.9h-2.7Z"
          fill="#fff"
          stroke="rgba(0,0,0,.28)"
          strokeWidth="0.5"
        />
      )}
    </svg>
  )
}

export function SearchGlyph({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <circle cx="10.6" cy="10.6" r="6.4" />
        <path d="m15.4 15.4 4.3 4.3" />
      </g>
    </svg>
  )
}

/** Volume, used by the control centre slider cap. */
export function VolumeGlyph({ size = 14, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M11.4 3.8 6.6 8.1H3.5a1 1 0 0 0-1 1v5.8a1 1 0 0 0 1 1h3.1l4.8 4.3a.8.8 0 0 0 1.34-.6V4.4a.8.8 0 0 0-1.34-.6Z"
        fill="currentColor"
      />
      {!muted && (
        <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M16.4 8.9a4.4 4.4 0 0 1 0 6.2" />
          <path d="M19.2 6.1a8.3 8.3 0 0 1 0 11.8" />
        </g>
      )}
      {muted && (
        <path
          d="m16.8 9.2 5 5.6M21.8 9.2l-5 5.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export function BrightnessGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 1.9v2.4M12 19.7v2.4M1.9 12h2.4M19.7 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
      </g>
    </svg>
  )
}

export function BluetoothGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.4v8.1l4.6-3.9L12 2.4Zm0 19.2v-8.1l4.6 3.9L12 21.6ZM7 8l10 8M17 8 7 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AirdropGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6.2 15.6a8 8 0 1 1 11.6 0" />
        <path d="M9 13.2a4.2 4.2 0 1 1 6 0" />
      </g>
      <circle cx="12" cy="18.4" r="2.1" fill="currentColor" />
    </svg>
  )
}

export function FocusGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.4 14.6A8.8 8.8 0 0 1 9.4 3.6a8.8 8.8 0 1 0 11 11Z"
        fill="currentColor"
      />
    </svg>
  )
}
