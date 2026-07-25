'use client'

import { create } from 'zustand'

interface SystemStore {
  /** 0–100. Drives a real dimming overlay across the desktop. */
  brightness: number
  setBrightness: (value: number) => void
  /** Which menu-bar popover is open, if any. */
  popover: string | null
  setPopover: (id: string | null) => void
}

export const useSystem = create<SystemStore>((set) => ({
  brightness: 100,
  setBrightness: (brightness) => set({ brightness }),
  popover: null,
  setPopover: (popover) => set({ popover }),
}))
