import type { AppId } from '@/lib/content'

export interface AppMeta {
  id: AppId
  /** Shown in the menu bar when focused, and in the dock tooltip. */
  name: string
  /** Window title bar. */
  title: string
  defaultSize: { w: number; h: number }
  minSize: { w: number; h: number }
  /** Appears in the dock. */
  inDock: boolean
  /** Appears as an icon on the desktop. */
  onDesktop: boolean
  /** Menu-bar menu titles for this app. */
  menus: string[]
}

export const apps: Record<AppId, AppMeta> = {
  letter: {
    id: 'letter',
    name: 'Notes',
    title: 'A Letter',
    defaultSize: { w: 900, h: 640 },
    minSize: { w: 420, h: 340 },
    inDock: true,
    onDesktop: true,
    menus: ['File', 'Edit', 'Format', 'View', 'Window'],
  },
  projects: {
    id: 'projects',
    name: 'Finder',
    title: 'Attachments',
    defaultSize: { w: 960, h: 640 },
    minSize: { w: 420, h: 340 },
    inDock: true,
    onDesktop: true,
    menus: ['File', 'Edit', 'View', 'Go', 'Window'],
  },
  timeline: {
    id: 'timeline',
    name: 'Calendar',
    title: 'Curriculum Vitae',
    defaultSize: { w: 760, h: 640 },
    minSize: { w: 380, h: 320 },
    inDock: true,
    onDesktop: false,
    menus: ['File', 'View'],
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    title: 'ne0gi02 — zsh — 92×30',
    defaultSize: { w: 700, h: 480 },
    minSize: { w: 360, h: 260 },
    inDock: true,
    onDesktop: false,
    menus: ['Shell', 'Edit', 'View', 'Window'],
  },
  gallery: {
    id: 'gallery',
    name: 'Photos',
    title: 'Photos — Hall of Fame',
    defaultSize: { w: 880, h: 600 },
    minSize: { w: 380, h: 320 },
    inDock: true,
    onDesktop: false,
    menus: ['File', 'Edit', 'View'],
  },
  about: {
    id: 'about',
    name: 'Contacts',
    title: 'About This Developer',
    defaultSize: { w: 620, h: 660 },
    minSize: { w: 360, h: 380 },
    inDock: true,
    onDesktop: false,
    menus: ['File'],
  },
  writing: {
    id: 'writing',
    name: 'Writing',
    title: 'Writing — from x.com/ne0gi02',
    defaultSize: { w: 900, h: 620 },
    minSize: { w: 380, h: 340 },
    inDock: true,
    onDesktop: false,
    menus: ['File', 'Edit', 'View', 'Window'],
  },
  contact: {
    id: 'contact',
    name: 'Mail',
    title: 'New Message',
    defaultSize: { w: 640, h: 520 },
    minSize: { w: 360, h: 380 },
    inDock: true,
    onDesktop: true,
    menus: ['File', 'Edit'],
  },
}

/** Dock order, left to right. `contact` is separated to the right group. */
export const APP_ORDER: AppId[] = [
  'letter',
  'projects',
  'timeline',
  'terminal',
  'gallery',
  'writing',
  'about',
  'contact',
]

export const DOCK_LEFT: AppId[] = [
  'letter',
  'projects',
  'writing',
  'timeline',
  'terminal',
  'gallery',
]
export const DOCK_RIGHT: AppId[] = ['about', 'contact']
