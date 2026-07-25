'use client'

import { create } from 'zustand'

import type { AppId } from '@/lib/content'

interface SystemStore {
  /**
   * Screen position of each dock icon, reported by the dock itself.
   * Windows read it so minimising can travel to the right icon rather
   * than to a guessed point.
   */
  dockSlots: Partial<Record<AppId, { x: number; y: number }>>
  setDockSlot: (id: AppId, slot: { x: number; y: number }) => void

  /** 0–100. Drives a real dimming overlay across the desktop. */
  brightness: number
  setBrightness: (value: number) => void
  /** Which menu-bar popover is open, if any. */
  popover: string | null
  setPopover: (id: string | null) => void
}

export const useSystem = create<SystemStore>((set) => ({
  dockSlots: {},
  setDockSlot: (id, slot) =>
    set((state) => {
      const current = state.dockSlots[id]
      // Only write when it actually moved, or every dock re-render loops.
      if (current && Math.abs(current.x - slot.x) < 1 && Math.abs(current.y - slot.y) < 1) {
        return state
      }
      return { dockSlots: { ...state.dockSlots, [id]: slot } }
    }),
  brightness: 100,
  setBrightness: (brightness) => set({ brightness }),
  popover: null,
  setPopover: (popover) => set({ popover }),
}))
