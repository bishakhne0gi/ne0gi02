import { ImageResponse } from 'next/og'
import { highlights, profile } from '@/lib/content'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const INK = '#F2F3F5'
const MUTED = '#9BA1AA'
const FAINT = '#6B7280'
const LINE = 'rgba(255,255,255,0.10)'

/**
 * Satori resolves glyphs against a bundled Latin face and reaches for the
 * network on anything outside it, which a build cannot do. The rupee sign is
 * the only such glyph in this copy, so it is spelled out instead.
 */
function safe(text: string) {
  return text.replace(/₹/g, 'Rs ')
}

export interface OgOptions {
  /** Small mono label above the headline. */
  eyebrow?: string
  title?: string
  subtitle?: string
}

/**
 * The share card, drawn rather than photographed: the same window the site
 * opens with, so a link preview and the page it lands on look like one thing.
 * Rendered per request, so any window or project can title its own card.
 */
export function ogImage({ eyebrow, title, subtitle }: OgOptions = {}) {
  const headline = safe(title?.slice(0, 90) || profile.name)
  const line = safe(subtitle?.slice(0, 120) || `${profile.role} at ${profile.company}`)
  const label = safe(eyebrow?.slice(0, 40) || `${profile.handle} · ${profile.location}`)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background:
            'radial-gradient(1100px 620px at 78% 8%, #23262C 0%, #121417 46%, #0A0B0D 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 28,
            border: `1px solid ${LINE}`,
            background: 'rgba(255,255,255,0.045)',
            overflow: 'hidden',
          }}
        >
          {/* window chrome */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 22px',
              borderBottom: `1px solid ${LINE}`,
              background: 'rgba(255,255,255,0.05)',
            }}
          >
            {['#FF5F57', '#FEBC2E', '#28C840'].map((colour) => (
              <div
                key={colour}
                style={{ width: 14, height: 14, borderRadius: 999, background: colour }}
              />
            ))}
            <div
              style={{
                marginLeft: 18,
                fontSize: 20,
                color: FAINT,
                letterSpacing: 0.4,
              }}
            >
              {`${profile.handle}.dev`}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: '48px 52px 44px' }}>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: FAINT,
              }}
            >
              {label}
            </div>

            <div
              style={{
                marginTop: 22,
                fontSize: headline.length > 46 ? 62 : 78,
                lineHeight: 1.05,
                letterSpacing: -2.4,
                color: INK,
                fontWeight: 600,
              }}
            >
              {headline}
            </div>

            <div style={{ marginTop: 20, fontSize: 32, color: MUTED, lineHeight: 1.3 }}>{line}</div>

            <div
              style={{
                display: 'flex',
                gap: 44,
                marginTop: 44,
                paddingTop: 28,
                borderTop: `1px solid ${LINE}`,
              }}
            >
              {highlights.map((stat) => (
                <div key={stat.label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 40, color: INK, fontWeight: 600, letterSpacing: -1 }}>
                    {safe(stat.value)}
                  </div>
                  <div style={{ fontSize: 20, color: FAINT, marginTop: 4 }}>
                    {safe(stat.label)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
