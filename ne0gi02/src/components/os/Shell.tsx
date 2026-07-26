'use client'

import { Desktop } from '@/components/os/Desktop'
import { Handheld } from '@/components/os/Handheld'
import { useIsClient, useIsHandheld } from '@/hooks'

/**
 * Picks the scene. Renders nothing on the server; the crawlable copy lives
 * in the server component alongside this, so an empty first paint costs no
 * SEO and avoids a desktop-shaped flash on phones.
 */
export function Shell() {
  const isClient = useIsClient()
  const handheld = useIsHandheld()

  if (!isClient) return null
  return handheld ? <Handheld /> : <Desktop />
}
