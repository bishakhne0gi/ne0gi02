'use client'

import { useCallback, useRef, useState } from 'react'
import {
  AirdropGlyph,
  BluetoothGlyph,
  BrightnessGlyph,
  FocusGlyph,
  VolumeGlyph,
  WifiGlyph,
} from '@/components/os/SystemGlyphs'
import { useSystem } from '@/lib/system-store'
import { haptic } from '@/lib/haptics'
import { cn } from '@/lib/cn'

/**
 * Control Centre as iOS lays it out: a connectivity pod, a pair of vertical
 * sliders, and a field of round tiles. Brightness is wired to the wallpaper
 * dim, because a control that does nothing is worse than no control.
 */
export function ControlCentreIos() {
  const brightness = useSystem((s) => s.brightness)
  const setBrightness = useSystem((s) => s.setBrightness)

  const [volume, setVolume] = useState(64)
  const [wifi, setWifi] = useState(true)
  const [bluetooth, setBluetooth] = useState(true)
  const [airplane, setAirplane] = useState(false)
  const [airdrop, setAirdrop] = useState(false)
  const [focus, setFocus] = useState(false)
  const [lock, setLock] = useState(false)
  const [lowPower, setLowPower] = useState(false)

  return (
    <div
      className="flex h-full flex-col px-5 pb-4"
      style={{ paddingTop: 'calc(max(0.75rem, env(safe-area-inset-top)) + 34px)' }}
    >
      {/* iOS lays Control Centre out on one grid: pods two cells square,
          sliders one cell wide and three tall, everything else a round. */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridAutoRows: '74px' }}
      >
        <div className="col-span-2 row-span-2 grid grid-cols-2 gap-2.5 rounded-[30px] bg-white/12 p-3 backdrop-blur-2xl">
          <Round
            on={airplane}
            onClick={() => {
              setAirplane((v) => !v)
              haptic()
            }}
            label="Aeroplane mode"
            tint="#FF9F0A"
          >
            <AeroplaneGlyph />
          </Round>
          <Round
            on={!airplane}
            onClick={() => setAirplane((v) => !v)}
            label="Mobile data"
            tint="#30D158"
          >
            <SignalGlyph />
          </Round>
          <Round
            on={wifi && !airplane}
            onClick={() => setWifi((v) => !v)}
            label="Wi-Fi"
            tint="#0A84FF"
          >
            <WifiGlyph size={19} level={wifi && !airplane ? 3 : 0} />
          </Round>
          <Round
            on={bluetooth && !airplane}
            onClick={() => setBluetooth((v) => !v)}
            label="Bluetooth"
            tint="#0A84FF"
          >
            <BluetoothGlyph />
          </Round>
        </div>

        <Tile
          className="col-span-2 row-span-2 flex-col items-start justify-center gap-2"
          onClick={() => setFocus((v) => !v)}
          active={focus}
          icon={<FocusGlyph size={17} />}
          title="Focus"
          detail={focus ? 'Do Not Disturb' : 'Off'}
        />

        <Round
          on={lock}
          onClick={() => setLock((v) => !v)}
          label="Rotation lock"
          tint="#FF453A"
          plate
        >
          <LockGlyph />
        </Round>
        <Round on={false} onClick={() => haptic()} label="Torch" tint="#FFD60A" plate>
          <TorchGlyph />
        </Round>
        <Round on={false} onClick={() => haptic()} label="Timer" tint="#FF9F0A" plate>
          <TimerGlyph />
        </Round>
        <Round on={false} onClick={() => haptic()} label="Calculator" tint="#FF9F0A" plate>
          <span className="text-[16px] font-semibold">=</span>
        </Round>

        <div className="row-span-3">
          <VerticalSlider
            label="Brightness"
            value={brightness}
            onChange={setBrightness}
            icon={<BrightnessGlyph size={17} />}
          />
        </div>
        <div className="row-span-3">
          <VerticalSlider
            label="Volume"
            value={volume}
            onChange={setVolume}
            icon={<VolumeGlyph size={17} muted={volume === 0} />}
          />
        </div>

        <Tile
          className="col-span-2"
          onClick={() => setAirdrop((v) => !v)}
          active={airdrop}
          icon={<AirdropGlyph />}
          title="AirDrop"
          detail={airdrop ? 'Everyone' : 'Receiving off'}
        />
        <Tile
          className="col-span-2"
          onClick={() => setLowPower((v) => !v)}
          active={lowPower}
          icon={<BatteryTileGlyph />}
          title="Low Power"
          detail={lowPower ? 'On' : 'Off'}
        />
        <Tile
          className="col-span-2"
          onClick={() => setAirdrop((v) => !v)}
          active={false}
          icon={<ScreenGlyph />}
          title="Screen Mirroring"
          detail="No devices"
        />
      </div>

      <p className="mt-auto pt-4 text-center text-[12px] text-white/35">Swipe up to close</p>
    </div>
  )
}

/* ───────────────────────────── parts ───────────────────────────── */

function Round({
  on,
  onClick,
  label,
  tint,
  plate,
  children,
}: {
  on: boolean
  onClick: () => void
  label: string
  tint: string
  /** Standing on the grid rather than inside a pod, so it carries its own glass. */
  plate?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className={cn(
        'grid h-full w-full place-items-center rounded-full transition-colors duration-200',
        plate && 'backdrop-blur-2xl',
        on ? 'text-white' : 'bg-white/16 text-white/80',
      )}
      style={on ? { background: tint } : undefined}
    >
      {children}
    </button>
  )
}

function Tile({
  onClick,
  active,
  icon,
  title,
  detail,
  className,
}: {
  onClick: () => void
  active: boolean
  icon: React.ReactNode
  title: string
  detail: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center gap-3 overflow-hidden rounded-[30px] p-3.5 text-left backdrop-blur-2xl transition-colors',
        active ? 'bg-white/25' : 'bg-white/12',
        className,
      )}
    >
      <span
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-full',
          active ? 'bg-white text-black' : 'bg-white/20 text-white',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-medium text-white">{title}</span>
        <span className="block truncate text-[11.5px] text-white/60">{detail}</span>
      </span>
    </button>
  )
}

/** The iOS slider: the whole track is the control, and it fills from the bottom. */
function VerticalSlider({
  label,
  value,
  onChange,
  icon,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  icon: React.ReactNode
}) {
  const track = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const set = useCallback(
    (clientY: number) => {
      const box = track.current?.getBoundingClientRect()
      if (!box) return
      const next = Math.round((1 - (clientY - box.top) / box.height) * 100)
      onChange(Math.max(0, Math.min(100, next)))
    },
    [onChange],
  )

  return (
    <div
      ref={track}
      role="slider"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowUp') onChange(Math.min(100, value + 5))
        if (event.key === 'ArrowDown') onChange(Math.max(0, value - 5))
      }}
      onPointerDown={(event) => {
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        set(event.clientY)
      }}
      onPointerMove={(event) => dragging.current && set(event.clientY)}
      onPointerUp={(event) => {
        dragging.current = false
        event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      className="relative h-full w-full touch-none overflow-hidden rounded-[30px] bg-white/12 backdrop-blur-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <div
        className="absolute inset-x-0 bottom-0 bg-white transition-[height] duration-100"
        style={{ height: `${value}%` }}
      />
      <span
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-4 grid place-items-center transition-colors',
          value > 14 ? 'text-black/70' : 'text-white/70',
        )}
      >
        {icon}
      </span>
    </div>
  )
}

/* ───────────────────────────── glyphs ───────────────────────────── */

function AeroplaneGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 15.5v-2l-8-4.5V4a1.5 1.5 0 0 0-3 0v5l-8 4.5v2l8-2.4V17l-2.4 1.7v1.6L11.5 19l3.9 1.3v-1.6L13 17v-3.9Z" />
    </svg>
  )
}

function SignalGlyph() {
  return (
    <svg width="19" height="14" viewBox="0 0 20 14" fill="currentColor" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5} y={13 - (i + 1) * 3} width="3.4" height={(i + 1) * 3} rx="1.2" />
      ))}
    </svg>
  )
}

function LockGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="3" fill="currentColor" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function TorchGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 2h8v3.5l-2 2.5v12a2 2 0 0 1-4 0V8L8 5.5Z" />
    </svg>
  )
}

function TimerGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="13.5" r="7.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 9.5v4.5M9.5 2.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ScreenGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="12" rx="2.4" stroke="currentColor" strokeWidth="1.9" />
      <path d="M8.5 20h7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function BatteryTileGlyph() {
  return (
    <svg width="19" height="12" viewBox="0 0 26 13" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="21" height="11.5" rx="3.4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2.6" y="2.6" width="12" height="7.8" rx="2" fill="currentColor" />
      <path d="M23.4 4.6v3.8c1.1-.3 1.6-1 1.6-1.9s-.5-1.6-1.6-1.9Z" fill="currentColor" />
    </svg>
  )
}
