'use client'

import {
  Binary,
  Envelope,
  GithubLogo,
  Globe,
  InstagramLogo,
  LinkedinLogo,
  ReadCvLogo,
  XLogo,
  type Icon,
} from '@phosphor-icons/react'
import type { SocialIcon } from '@/lib/content'

/**
 * Phosphor at one weight, so every mark carries the same optical weight.
 *
 * This set stays on Phosphor while the rest of the app moved to Lucide:
 * Lucide 1.0 removed all brand marks upstream, so GitHub, LinkedIn, Instagram
 * and X have no equivalent there. Splitting the row across two icon families
 * would be more visible than keeping the whole row on one.
 */
const REGISTRY: Record<SocialIcon, Icon> = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  x: XLogo,
  mail: Envelope,
  resume: ReadCvLogo,
  // LeetCode has no brand glyph in the set; it takes the nearest semantic one
  // rather than breaking the family with a differently-drawn logo.
  leetcode: Binary,
  globe: Globe,
}

export function SocialGlyph({ icon, size = 20 }: { icon: SocialIcon; size?: number }) {
  const Glyph = REGISTRY[icon]
  return <Glyph size={size} weight="duotone" aria-hidden />
}
