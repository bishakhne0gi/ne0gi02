/**
 * The system glyphs that live in the menu bar and control centre.
 *
 * Where Lucide carries a faithful equivalent of the macOS mark, we use it, so
 * the chrome sits on a real, maintained icon set at one stroke weight. Four
 * marks stay hand-drawn because Lucide can't express them:
 *
 *   - AppleLogo, ControlCentreGlyph — brand marks; Lucide 1.0 removed all of
 *     these upstream and won't accept new ones.
 *   - BatteryGlyph — needs a continuous percentage fill; Lucide only ships
 *     discrete full/medium/low states.
 *   - AirdropGlyph — no equivalent in the set.
 *
 * Lucide draws on a 24×24 grid at strokeWidth 2. We pull it to 1.8 to match
 * the optical weight of the hand-drawn marks it sits beside.
 */

import {
  Bluetooth,
  Moon,
  Search,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  WifiHigh,
  WifiLow,
  WifiZero,
} from 'lucide-react'

/** Menu-bar stroke weight, shared by every Lucide mark in the chrome. */
const STROKE = 1.8

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

/** Lucide ships one mark per bar count, which maps 1:1 onto our level. */
const WIFI_BY_LEVEL = [WifiZero, WifiLow, WifiHigh, Wifi] as const

export function WifiGlyph({ size = 15, level = 3 }: { size?: number; level?: 0 | 1 | 2 | 3 }) {
  const Mark = WIFI_BY_LEVEL[level]
  return <Mark size={size} strokeWidth={STROKE} aria-hidden />
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
  return <Search size={size} strokeWidth={STROKE} aria-hidden />
}

/** Volume, used by the control centre slider cap. */
export function VolumeGlyph({ size = 14, muted = false }: { size?: number; muted?: boolean }) {
  const Mark = muted ? VolumeX : Volume2
  return <Mark size={size} strokeWidth={STROKE} aria-hidden />
}

export function BrightnessGlyph({ size = 14 }: { size?: number }) {
  return <Sun size={size} strokeWidth={STROKE} aria-hidden />
}

export function BluetoothGlyph({ size = 17 }: { size?: number }) {
  return <Bluetooth size={size} strokeWidth={STROKE} aria-hidden />
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
  return <Moon size={size} strokeWidth={STROKE} fill="currentColor" aria-hidden />
}
