'use client'

import { useCallback, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  AirdropGlyph,
  BluetoothGlyph,
  BrightnessGlyph,
  FocusGlyph,
  VolumeGlyph,
  WifiGlyph,
} from '@/components/os/SystemGlyphs'
import { cn } from '@/lib/cn'

/**
 * Control Centre. The toggles are real state, and brightness genuinely
 * dims the desktop, because a control that does nothing is worse than no control.
 */
export function ControlCentre({
  brightness,
  onBrightness,
}: {
  brightness: number
  onBrightness: (value: number) => void
}) {
  const [wifi, setWifi] = useState(true)
  const [bluetooth, setBluetooth] = useState(true)
  const [airdrop, setAirdrop] = useState(false)
  const [focus, setFocus] = useState(false)
  const [stage, setStage] = useState(false)
  const [volume, setVolume] = useState(64)

  return (
    <div className="w-[302px] space-y-2.5 p-2.5">
      {/* ── connectivity block ── */}
      <div className="glass-tile grid grid-cols-2 gap-x-3 gap-y-2.5 rounded-[15px] p-3">
        <div className="col-span-2 space-y-2.5">
          <Toggle
            on={wifi}
            onClick={() => setWifi((v) => !v)}
            icon={<WifiGlyph size={17} level={wifi ? 3 : 0} />}
            label="Wi-Fi"
            value={wifi ? 'ne0gi-5G' : 'Off'}
          />
          <Toggle
            on={bluetooth}
            onClick={() => setBluetooth((v) => !v)}
            icon={<BluetoothGlyph />}
            label="Bluetooth"
            value={bluetooth ? 'On' : 'Off'}
          />
          <Toggle
            on={airdrop}
            onClick={() => setAirdrop((v) => !v)}
            icon={<AirdropGlyph />}
            label="AirDrop"
            value={airdrop ? 'Everyone' : 'Off'}
          />
        </div>
      </div>

      {/* ── focus + appearance ── */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setFocus((v) => !v)}
          className={cn(
            'glass-tile flex flex-col justify-between rounded-[15px] p-3 text-left transition-colors',
            focus && 'bg-accent/85',
          )}
        >
          <span className={cn('grid h-7 w-7 place-items-center rounded-full', focus ? 'bg-white/25 text-white' : 'bg-ink/10 text-ink')}>
            <FocusGlyph size={15} />
          </span>
          <span className={cn('mt-3 block text-[12.5px] font-medium', focus ? 'text-white' : 'text-ink')}>
            Focus
          </span>
          <span className={cn('text-[11px]', focus ? 'text-white/75' : 'text-muted')}>
            {focus ? 'Do Not Disturb' : 'Off'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStage((v) => !v)}
          className={cn(
            'glass-tile flex flex-col justify-between rounded-[15px] p-3 text-left transition-colors',
            stage && 'bg-accent/85',
          )}
        >
          <span
            className={cn(
              'grid h-7 w-7 place-items-center rounded-full text-[13px]',
              stage ? 'bg-white/25 text-white' : 'bg-ink/10 text-ink',
            )}
          >
            ▣
          </span>
          <span className={cn('mt-3 block text-[12.5px] font-medium', stage ? 'text-white' : 'text-ink')}>
            Stage Manager
          </span>
          <span className={cn('text-[11px]', stage ? 'text-white/75' : 'text-muted')}>
            {stage ? 'On' : 'Off'}
          </span>
        </button>
      </div>

      {/* ── sliders ── */}
      <div className="glass-tile space-y-3 rounded-[15px] p-3">
        <Slider
          label="Display"
          value={brightness}
          onChange={onBrightness}
          icon={<BrightnessGlyph />}
        />
        <Slider
          label="Sound"
          value={volume}
          onChange={setVolume}
          icon={<VolumeGlyph muted={volume === 0} />}
        />
      </div>
    </div>
  )
}

/* ───────────────────────────── parts ───────────────────────────── */

function Toggle({
  on,
  onClick,
  icon,
  label,
  value,
}: {
  on: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="flex w-full items-center gap-2.5 text-left"
    >
      <span
        className={cn(
          'grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full transition-colors duration-200',
          on ? 'bg-accent text-white' : 'bg-ink/12 text-muted',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-medium leading-tight text-ink">{label}</span>
        <span className="block truncate text-[11px] leading-tight text-muted">{value}</span>
      </span>
    </button>
  )
}

/** macOS slider: the icon rides inside the filled track. */
function Slider({
  label,
  value,
  onChange,
  icon,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  icon: React.ReactNode
}) {
  const track = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const set = useCallback(
    (clientX: number) => {
      const box = track.current?.getBoundingClientRect()
      if (!box) return
      onChange(Math.round(Math.max(0, Math.min(1, (clientX - box.left) / box.width)) * 100))
    },
    [onChange],
  )

  return (
    <div>
      <p className="mb-1.5 text-[12.5px] font-medium text-ink">{label}</p>
      <div
        ref={track}
        role="slider"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') onChange(Math.min(100, value + 5))
          if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 5))
        }}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          set(e.clientX)
        }}
        onPointerMove={(e) => dragging.current && set(e.clientX)}
        onPointerUp={(e) => {
          dragging.current = false
          e.currentTarget.releasePointerCapture(e.pointerId)
        }}
        className="relative h-[26px] w-full cursor-pointer touch-none overflow-hidden rounded-full bg-ink/12 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-white"
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 700, damping: 50 }}
        />
        <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-ink/55 mix-blend-luminosity">
          {icon}
        </span>
      </div>
    </div>
  )
}
