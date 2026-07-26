# ne0gi02 · a portfolio, written as a letter

A personal site staged as a macOS desktop. The centrepiece is **Letter.app**: the
portfolio written as an actual letter: *Dear Sir/Ma'am* → *Thanking you* →
*Yours faithfully*, with inline "attachments" that open the other windows.

```
pnpm install
pnpm dev          # http://localhost:3000
```

## Editing the content

**`src/lib/content.ts` is the only file you need to touch.** Everything the site
renders comes from it: the letter, projects, curriculum, skills, gallery and
profile. It is served through `/api/*` route handlers and read with TanStack
Query, so it can later be swapped for a CMS or database without touching any UI.

### The letter

Each entry in `letter[]` is one paragraph. Three inline rules:

| Syntax | Renders as |
|---|---|
| `**bold**` | semibold |
| `*italic*` | italic |
| `[[label\|projects]]` | an attachment link that opens that window |

Valid link targets are the `AppId` values: `letter`, `projects`, `timeline`,
`terminal`, `gallery`, `about`, `contact`.

### Projects

Leave `images: []` and a typographic cover is generated from the project's id.
no placeholder screenshots needed. Set `featured: true` to pin a project first
and give it a double-width card.

## Architecture

```
src/
  app/          route handlers (/api/*), layout, page, design tokens
  components/
    os/         the desktop itself: menu bar, dock, window manager, boot
    apps/       one component per window
    ui/         shared pieces (rich text, covers, icons, states)
  lib/          content, app registry, window store, query definitions
  hooks/        media queries, theme, clock, viewport
```

- **Window manager**: Zustand (`src/lib/window-store.ts`). Windows drag,
  resize, stack, minimise, maximise, and answer to ⌘W / ⌘M.
- **Data**: every window fetches only its own payload, prefetched on dock
  hover so content is warm before the window opens.
- **Scroll**: Lenis, scoped to the letter's own container. Never
  `scroll-behavior: smooth`.

## Design decisions worth keeping

- **Type is Apple's own**, taken from the OS rather than downloaded: SF Pro,
  New York, SF Mono. No font request, no FOUT, no CDN.
- **Two scenes, not one.** Phones get iOS, not a shrunken desktop. See below.
- **The boot screen is always black**, regardless of theme, because a machine
  powering on has no appearance preference yet.
- **Everything is mirrored as plain semantic HTML** in `page.tsx` for crawlers,
  no-JS visitors, and screen readers that would rather not drive a window
  manager.
- **`prefers-reduced-motion` is honoured everywhere**: boot is skipped,
  Lenis is not started, reveals resolve instantly.

## The phone

Under 820px the site is not a responsive desktop, it is iOS
(`components/os/Handheld.tsx` plus `components/ios/*`, state in
`lib/ios-store.ts`).

- **Home screen**: paged 4×6 icon grid with a fixed dock, page dots, and a
  Search pill. Long press the wallpaper or an icon for jiggle mode; drag an
  icon to reorder it, hold it against the right edge to turn the page, and
  keep holding past the last page to make a new one. Layouts persist to
  `localStorage` and are repacked on every change, so a page that overflows
  pushes its last tiles onto the next one rather than scrolling.
- **Widgets**: small (2×2), medium (4×2) and large (4×4). In jiggle mode each
  widget grows a corner handle that snaps between the three as you drag it,
  and tapping the handle cycles them.
- **Gestures**: apps zoom out of the icon that launched them; swipe up from
  the bottom bar or in from the left edge to leave, both tracking the finger.
  Pull down from the left of the notch for Notification Centre, from the
  right for Control Centre, and from the wallpaper for Spotlight.
- **App Library** sits one page past the last home page: category folders,
  and a search field that filters every app. Spotlight searches further, into
  projects, writing and the curriculum.
- **Control Centre toggles are real state**, and brightness genuinely dims
  the wallpaper through the same store the desktop uses.

## Search and share

- **`src/lib/seo.ts`** holds the origin, the copy every crawler reads, and the
  JSON-LD graph (Person, WebSite, ProfilePage, one CreativeWork per project and
  one BlogPosting per piece of writing). Set `NEXT_PUBLIC_SITE_URL` to point a
  deployment at its own origin; production defaults to `https://ne0gi02.dev`.
- **`src/lib/og.tsx`** draws the share card: the same window the site opens
  with, rendered by `next/og`. `/api/og?title=…&subtitle=…&eyebrow=…` renders it
  per request, so any project or window can carry its own preview;
  `app/opengraph-image.tsx` and `app/twitter-image.tsx` serve the default.
- **`robots.ts`, `sitemap.ts` and `manifest.ts`** are generated from the same
  constants, so there is one place to change the domain.

## Commands

| | |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | production build |
| `pnpm start` | serve the build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

Docker: `docker build -t ne0gi02 . && docker run -p 3000:3000 ne0gi02`.
