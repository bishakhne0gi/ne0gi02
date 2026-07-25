# ne0gi02 — a portfolio, written as a letter

A personal site staged as a macOS desktop. The centrepiece is **Letter.app**: the
portfolio written as an actual letter — *Dear Sir/Ma'am* → *Thanking you* →
*Yours faithfully* — with inline "attachments" that open the other windows.

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

Leave `images: []` and a typographic cover is generated from the project's id —
no placeholder screenshots needed. Set `featured: true` to pin a project first
and give it a double-width card.

## Architecture

```
src/
  app/          route handlers (/api/*), layout, page, design tokens
  components/
    os/         the desktop itself — menu bar, dock, window manager, boot
    apps/       one component per window
    ui/         shared pieces (rich text, covers, icons, states)
  lib/          content, app registry, window store, query definitions
  hooks/        media queries, theme, clock, viewport
```

- **Window manager** — Zustand (`src/lib/window-store.ts`). Windows drag,
  resize, stack, minimise, maximise, and answer to ⌘W / ⌘M.
- **Data** — every window fetches only its own payload, prefetched on dock
  hover so content is warm before the window opens.
- **Scroll** — Lenis, scoped to the letter's own container. Never
  `scroll-behavior: smooth`.

## Design decisions worth keeping

- **Type is Apple's own**, taken from the OS rather than downloaded: SF Pro,
  New York, SF Mono. No font request, no FOUT, no CDN.
- **Two scenes, not one.** Phones get a fullscreen app with a tab bar
  (`Handheld.tsx`), not a shrunken desktop.
- **The boot screen is always black**, regardless of theme — a machine
  powering on has no appearance preference yet.
- **Everything is mirrored as plain semantic HTML** in `page.tsx` for crawlers,
  no-JS visitors, and screen readers that would rather not drive a window
  manager.
- **`prefers-reduced-motion` is honoured everywhere** — boot is skipped,
  Lenis is not started, reveals resolve instantly.

## Commands

| | |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | production build |
| `pnpm start` | serve the build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

Docker: `docker build -t ne0gi02 . && docker run -p 3000:3000 ne0gi02`.
