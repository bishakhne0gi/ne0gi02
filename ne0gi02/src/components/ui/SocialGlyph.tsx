'use client'

import {
  Binary,
  ChefHat,
  Envelope,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  ReadCvLogo,
  Trophy,
  type Icon,
} from '@phosphor-icons/react'
import type { SocialIcon } from '@/lib/content'

/**
 * Phosphor, at one weight, so every mark carries the same optical weight.
 * The competitive-programming sites have no brand glyph in the set, so they
 * take the nearest semantic one rather than breaking the family with a
 * differently-drawn logo — and CodeChef gets the hat it was asking for.
 */
const REGISTRY: Record<SocialIcon, Icon> = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  mail: Envelope,
  resume: ReadCvLogo,
  leetcode: Binary,
  codechef: ChefHat,
  codeforces: Trophy,
}

export function SocialGlyph({ icon, size = 20 }: { icon: SocialIcon; size?: number }) {
  const Glyph = REGISTRY[icon]
  return <Glyph size={size} weight="duotone" aria-hidden />
}
