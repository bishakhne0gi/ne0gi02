/**
 * ─────────────────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT.
 *
 *  Everything the site renders comes from here. It is served through
 *  /api/* route handlers and consumed with TanStack Query, so you can later
 *  swap this module for a CMS, a database, or MDX without touching any UI.
 *
 *  Sourced from Resume_July_2026, linkedin.com/in/bishakh-neogi-387815205
 *  and x.com/ne0gi02.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type AppId =
  | 'letter'
  | 'projects'
  | 'timeline'
  | 'terminal'
  | 'gallery'
  | 'about'
  | 'contact'

/* ───────────────────────────── profile ───────────────────────────── */

export interface Profile {
  name: string
  handle: string
  role: string
  company: string
  location: string
  origin: string
  avatar: string
  banner: string
  signature: string
  resumeUrl: string
  email: string
  /** Rotating subtitles under the name in About. */
  titles: string[]
  socials: { label: string; href: string; icon: SocialIcon }[]
}

export type SocialIcon =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'x'
  | 'mail'
  | 'resume'
  | 'leetcode'
  | 'globe'

export const profile: Profile = {
  name: 'Bishakh Neogi',
  handle: 'ne0gi02',
  role: 'Founding Engineer',
  company: 'CosX AI',
  location: 'Bengaluru, India',
  origin: 'Kolkata, West Bengal',
  avatar: '/assets/avatar.png',
  /** The CosX desk, from the LinkedIn cover — used as the About banner. */
  banner: '/assets/cosx-desk.jpg',
  signature: '/assets/sign.png',
  resumeUrl:
    'https://drive.google.com/file/d/1A4EeEkMIh0E2SIVDm8qxhn7rUNGuCyia/view?usp=drive_link',
  email: 'neogibishakh@gmail.com',
  titles: [
    'Founding Engineer at CosX AI',
    'Forward Deployed Engineer',
    'Building VectorDrop',
    'LeetCode Knight — top 5.42%',
    '3× MLH Hackathon Winner',
  ],
  socials: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/bishakh-neogi-387815205/',
      icon: 'linkedin',
    },
    { label: 'GitHub', href: 'https://github.com/bishakhne0gi', icon: 'github' },
    { label: 'X', href: 'https://x.com/ne0gi02', icon: 'x' },
    { label: 'LeetCode', href: 'https://leetcode.com/ne0gi02/', icon: 'leetcode' },
    { label: 'VectorDrop', href: 'https://vectordrop.co.in', icon: 'globe' },
    { label: 'Instagram', href: 'https://www.instagram.com/bishakh.neogi/', icon: 'instagram' },
  ],
}

/* ───────────────────────────── the letter ─────────────────────────────
 *
 *  The narrative spine of the site, rendered inside Notes.app.
 *
 *  In `body`, wrap text in [[…|target]] to turn it into an inline
 *  attachment link that opens another window:
 *      [[VectorDrop|projects]]   → opens Attachments
 *      [[the timeline|timeline]] → opens Curriculum
 *  Valid targets are AppId values.
 */

export interface LetterBlock {
  id: string
  /** `salutation` and `signoff` get the serif display treatment. */
  kind: 'salutation' | 'paragraph' | 'aside' | 'signoff'
  /** Small caps label in the left margin, e.g. "01 · the opening". */
  marginNote?: string
  body: string
}

export const letterMeta = {
  subject: 'An application, submitted from a desk',
  recipient: 'Sir / Ma’am',
  place: 'Bengaluru, India',
  date: 'the present day',
}

export const letter: LetterBlock[] = [
  {
    id: 'salutation',
    kind: 'salutation',
    body: 'Dear Sir/Ma’am,',
  },
  {
    id: 'intro',
    kind: 'paragraph',
    marginNote: '01 · the opening',
    body: `I am writing to introduce myself. My name is **Bishakh Neogi** — most of the internet knows me as *ne0gi02* — and I am the founding engineer at **CosX AI**. This letter is my portfolio. I could have given you a grid of cards and a scroll bar, but a letter felt more honest: it has a beginning, it asks for your attention, and it ends with a signature.`,
  },
  {
    id: 'origin',
    kind: 'paragraph',
    marginNote: '02 · where it began',
    body: `I started the way most of us do — a text editor, a browser, and far too many tabs. Somewhere between the first div that refused to centre and the first server that actually responded, it stopped being homework and started being the thing I did on weekends. Four years later that habit had turned into a **Knight badge on LeetCode** — top 5.42% of 545,539, nine hundred problems deep — and three MLH hackathon wins. The full ledger is in [[the timeline|timeline]].`,
  },
  {
    id: 'now',
    kind: 'paragraph',
    marginNote: '03 · what I actually do',
    body: `At CosX I am a founding and forward-deployed engineer, which in practice means I am handed a client, a deadline, and a problem nobody has scoped yet. **Ten production applications** so far, across retail, fintech, healthcare and manufacturing. I took Signzy's platform from a Lighthouse score of **72 to 95** for a four-million-user base. I built an on-chain staking and vesting app on Aptos that sat at **#1 on Petra Wallet two months running** at 100K MAU. And I own a national NGO donation platform that now moves **₹4,00,000+ a month in recurring donations with zero payment failures** — which is the number I am proudest of, because nobody notices it working.`,
  },
  {
    id: 'range',
    kind: 'paragraph',
    marginNote: '04 · the range',
    body: `The work does not sit in one language. There is **Rust** for a DeFi client's portfolio and wallet-aggregation services; **Python and FastAPI** automating GST e-invoicing for Thomas Scott, parsing purchase orders into NIC IRP v1.1-compliant JSON and saving them **₹2,00,000 a month** of manual work; and a multi-tenant retail analytics product in React with virtualised infinite-scroll grids, RBAC, and AI SKU tooling for Thomas Scott and Manyavar. The complete inventory is in [[the terminal|terminal]] — a list of skills should look like what it is: output.`,
  },
  {
    id: 'mine',
    kind: 'paragraph',
    marginNote: '05 · the one that is mine',
    body: `On my own time I built and shipped **VectorDrop**, now serving 500+ users. It turns any image into an editable vector in seconds — colour quantisation, mask tracing and path assembly, with content-hash caching so a repeat upload costs nothing. It has an in-browser path editor, a programmatic SEO layer, Claude-backed icon generation, SVG sanitisation against XSS, and a test suite. Solo, end to end. [[Open the attachments|projects]] and judge it yourself.`,
  },
  {
    id: 'aside',
    kind: 'aside',
    body: `A confession: my favourite part of any project is the hour after it works, when it is fast but not yet pretty, and every decision left is a taste decision.`,
  },
  {
    id: 'people',
    kind: 'paragraph',
    marginNote: '06 · the people',
    body: `None of it happened alone. Hackathons are won by teams that can argue at 3 a.m. and still ship by nine, and I have since been on the other side of the table — the youngest mentor and judge at IISER Kolkata, judging 400+ teams. There are photographs, badly lit and entirely sincere, in [[the gallery|gallery]].`,
  },
  {
    id: 'ask',
    kind: 'paragraph',
    marginNote: '07 · the ask',
    body: `So: I am looking for work where the craft matters, on a team that reviews each other honestly, and where somebody cares whether the donation actually went through. If that describes where you are, I would very much like to talk. The fastest route is [[a reply|contact]] — the compose window is already open.`,
  },
  {
    id: 'thanks',
    kind: 'signoff',
    body: 'Thanking you for your time and consideration,',
  },
]

/* ───────────────────────────── projects ─────────────────────────────
 *
 *  `images` is intentionally empty across the board — each project gets a
 *  generated cover keyed to its `tone`, which reads as one designed set
 *  rather than a wall of mismatched screenshots.
 */

export type ProjectCategory = 'product' | 'client' | 'hackathon'

export interface Project {
  id: string
  title: string
  year: string
  category: ProjectCategory
  /** Drives the generated cover's palette. */
  tone: 'violet' | 'amber' | 'teal' | 'rose' | 'indigo' | 'lime'
  blurb: string
  description: string
  /** Headline numbers. Rendered as a stat row on the detail view. */
  metrics: { value: string; label: string }[]
  stack: string[]
  accolades: string[]
  images: string[]
  github?: string
  live?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'vectordrop',
    title: 'VectorDrop',
    year: '2026',
    category: 'product',
    tone: 'violet',
    featured: true,
    blurb: 'Any image into an editable vector, in seconds.',
    description:
      'Built and shipped solo. A colour-quantisation, mask-tracing and path-assembly pipeline (sharp, potrace, SVGO) that returns editable, low-anchor-count vectors in seconds, with content-hash caching so a repeat upload costs nothing. Ships an in-browser path and layer editor and a programmatic SEO layer across four templated route families. The backend is built around Clerk auth with a webhook-driven dev-to-prod user remap, Postgres, Redis rate limiting, and Claude-backed image analysis and icon generation — hardened with SVG sanitisation against XSS and a strict CSP, covered by Vitest unit and Playwright end-to-end tests.',
    metrics: [
      { value: '500+', label: 'users' },
      { value: 'seconds', label: 'per conversion' },
      { value: 'solo', label: 'end to end' },
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Postgres',
      'Redis',
      'Anthropic API',
      'Clerk',
      'Playwright',
    ],
    accolades: ['Shipped solo, live at vectordrop.co.in'],
    images: [],
    live: 'https://vectordrop.co.in',
  },
  {
    id: 'aptos-staking',
    title: 'On-chain Staking on Aptos',
    year: '2025',
    category: 'client',
    tone: 'teal',
    blurb: '#1 on Petra Wallet, two months running.',
    description:
      'A staking, voting and vesting application built and launched on Aptos. It held the number one application slot on Petra Wallet for two consecutive months, serving a 100K monthly-active user base.',
    metrics: [
      { value: '#1', label: 'on Petra Wallet' },
      { value: '2 months', label: 'consecutive' },
      { value: '100K', label: 'MAU' },
    ],
    stack: ['Aptos', 'Move', 'React', 'TypeScript', 'Petra Wallet'],
    accolades: ['Ranked #1 application on Petra Wallet for 2 consecutive months'],
    images: [],
  },
  {
    id: 'ngo-donations',
    title: 'National NGO Donation Platform',
    year: '2025',
    category: 'client',
    tone: 'rose',
    blurb: '₹4,00,000+ a month, zero payment failures.',
    description:
      'Owned end to end. A national donation platform processing over ₹400,000 per month in recurring donations with zero payment failures, through Razorpay mandates and a Worldline gateway, with OTP auth and gateway failure-state recovery. I authored the design spec that moved the highest-intent page from a client-only island to server-rendered content, making it crawler-indexable with zero visual regression.',
    metrics: [
      { value: '₹4L+', label: 'monthly recurring' },
      { value: 'zero', label: 'payment failures' },
      { value: 'end to end', label: 'ownership' },
    ],
    stack: ['Next.js', 'React', 'Sanity', 'Razorpay', 'Worldline'],
    accolades: ['Zero payment failures in production'],
    images: [],
  },
  {
    id: 'signzy',
    title: 'Signzy Platform Performance',
    year: '2024',
    category: 'client',
    tone: 'indigo',
    blurb: 'Lighthouse 72 → 95, for 4M monthly users.',
    description:
      'Refactored and optimised Signzy’s platform, raising the Lighthouse performance score from 72 to 95 and cutting load time across a four-million monthly-active user base.',
    metrics: [
      { value: '72 → 95', label: 'Lighthouse' },
      { value: '4M', label: 'MAU' },
    ],
    stack: ['React', 'Next.js', 'Performance', 'Web Vitals'],
    accolades: [],
    images: [],
  },
  {
    id: 'gst-automation',
    title: 'GST e-Invoicing Automation',
    year: '2025',
    category: 'client',
    tone: 'amber',
    blurb: '₹2,00,000 a month of manual work, removed.',
    description:
      'Automated dispatch and GST e-invoicing for Thomas Scott in Python and FastAPI over Postgres — parsing purchase orders and packing lists into a four-sheet workbook and NIC IRP v1.1-compliant e-invoice JSON. It replaced roughly ₹200,000 per month of manual operations.',
    metrics: [
      { value: '₹2L', label: 'saved monthly' },
      { value: 'v1.1', label: 'NIC IRP compliant' },
    ],
    stack: ['Python', 'FastAPI', 'Postgres', 'openpyxl'],
    accolades: [],
    images: [],
  },
  {
    id: 'retail-analytics',
    title: 'Multi-tenant Retail Analytics',
    year: '2025',
    category: 'client',
    tone: 'lime',
    blurb: 'Virtualised grids and AI SKU tooling at catalogue scale.',
    description:
      'A multi-tenant retail analytics product in React and TanStack Query, with virtualised infinite-scroll grids over very large catalogues, RBAC, and CSV/XLSX export — plus AI SKU and trend-heatmap tooling that drove inventory decisions from product performance and material-cost constraints. Delivered for Thomas Scott and Manyavar.',
    metrics: [
      { value: 'multi-tenant', label: 'architecture' },
      { value: 'virtualised', label: 'at catalogue scale' },
    ],
    stack: ['React', 'TanStack Query', 'RBAC', 'Virtualisation'],
    accolades: [],
    images: [],
  },
]

/** Student-era hackathon builds. Kept for the record, shown as a compact list. */
export const experiments: { title: string; note: string; href: string }[] = [
  {
    title: 'Tenderflow',
    note: 'Winner — Postman · Hack4Bengal 2.0',
    href: 'https://github.com/bishakhne0gi/TenderFloww',
  },
  {
    title: 'Ledged',
    note: 'Winner — 5ire · Diversion 2k23',
    href: 'https://github.com/bishakhne0gi/Ledged',
  },
  {
    title: 'HypeTheHike',
    note: 'Winner — Arcana · Hack The Mountains 3.0',
    href: 'https://github.com/bishakhne0gi/Hype-The-Hike',
  },
  {
    title: 'Solguide',
    note: 'Top 50 — Appwrite Hackathon',
    href: 'https://github.com/bishakhne0gi/Appwrite-1',
  },
  {
    title: 'Linkhub',
    note: 'React Native · 15+ daily users',
    href: 'https://github.com/bishakhne0gi/Linkhub',
  },
  {
    title: 'Emotion Detector',
    note: 'Live demo',
    href: 'https://getemotions.netlify.app/',
  },
]

/* ───────────────────────────── timeline ───────────────────────────── */

export interface TimelineEntry {
  id: string
  year: string
  kind: 'work' | 'education' | 'recognition'
  title: string
  org: string
  detail?: string
  bullets?: string[]
  href?: string
}

export const timeline: TimelineEntry[] = [
  {
    id: 'cosx',
    year: 'Apr 2024 — Present',
    kind: 'work',
    title: 'Founding Engineer · Forward Deployed Engineer',
    org: 'CosX AI — Bengaluru',
    bullets: [
      'Shipped 10 production applications across retail, fintech, healthcare and manufacturing.',
      'Raised Signzy’s Lighthouse performance from 72 to 95 for a 4M MAU user base.',
      '#1 application on Petra Wallet for 2 consecutive months — on-chain staking, voting and vesting on Aptos, 100K MAU.',
      'Owned a national NGO donation platform processing ₹400,000+ per month with zero payment failures.',
      'Automated GST e-invoicing in Python/FastAPI, saving ₹200,000 per month of manual operations.',
      'Wrote Rust services for a DeFi trading client — portfolio aggregation, IAM lifecycle, webhook observability.',
    ],
    href: 'https://cosx.ai',
  },
  {
    id: 'vectordrop',
    year: '2026',
    kind: 'work',
    title: 'Building VectorDrop',
    org: 'vectordrop.co.in',
    detail: 'An image-to-SVG converter, built and shipped solo. 500+ users.',
    href: 'https://vectordrop.co.in',
  },
  {
    id: 'leetcode',
    year: '2025',
    kind: 'recognition',
    title: 'Knight Badge — top 5.42%',
    org: 'LeetCode',
    detail: 'Among 545,539 participants. 900 problems solved.',
    href: 'https://leetcode.com/ne0gi02/',
  },
  {
    id: 'cardiocare',
    year: 'Jan 2023 — Dec 2023',
    kind: 'work',
    title: 'Frontend Developer',
    org: 'Cardiocare & VNG — Remote',
    detail:
      'Led frontend development of 3 web apps in Next.js and Firebase, driving a 25% increase in user engagement and 15% revenue growth.',
  },
  {
    id: 'mlh',
    year: '2023',
    kind: 'recognition',
    title: '3× MLH Hackathon Winner',
    org: 'Hack4Bengal 2.0 · Diversion 2k23 · Hack The Mountains 3.0',
    detail:
      'Winner of the Postman, Google Cloud and Flow Blockchain tracks at Hack4Bengal 2.0 — the largest East India hackathon — among 300+ teams.',
  },
  {
    id: 'iiser',
    year: '2023',
    kind: 'recognition',
    title: 'Youngest Mentor and Judge',
    org: 'IISER Kolkata',
    detail: 'Judged 400+ teams.',
  },
  {
    id: 'hackwithinfy',
    year: '2022',
    kind: 'recognition',
    title: 'Top 74 at HackWithInfy ’22',
    org: 'Infosys — among 20,000 participants',
    detail: 'Selected as Campus Ambassador, May 2022 — May 2023.',
  },
  {
    id: 'aot',
    year: 'Jul 2020 — Jul 2024',
    kind: 'education',
    title: 'B.Tech, Computer Science and Technology',
    org: 'Academy of Technology — West Bengal',
    detail: 'CGPA 9.33',
  },
]

/* ───────────────────────────── skills ───────────────────────────── */

export interface SkillGroup {
  id: string
  label: string
  /** Rendered as `$ skills <command>` in Terminal.app */
  command: string
  items: { name: string; level: 'core' | 'working' | 'familiar' }[]
}

export const skills: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    command: 'frontend',
    items: [
      { name: 'TypeScript', level: 'core' },
      { name: 'JavaScript', level: 'core' },
      { name: 'React 18/19', level: 'core' },
      { name: 'Next.js', level: 'core' },
      { name: 'React Native', level: 'working' },
      { name: 'TanStack Query', level: 'core' },
      { name: 'Zustand', level: 'core' },
      { name: 'Tailwind', level: 'core' },
      { name: 'Three.js', level: 'working' },
      { name: 'HTML / CSS', level: 'core' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend and Data',
    command: 'backend',
    items: [
      { name: 'Rust', level: 'working' },
      { name: 'FastAPI', level: 'core' },
      { name: 'Django REST', level: 'working' },
      { name: 'Fastify', level: 'working' },
      { name: 'Node.js', level: 'core' },
      { name: 'PostgreSQL (pgvector)', level: 'core' },
      { name: 'Redis', level: 'working' },
      { name: 'Supabase', level: 'working' },
    ],
  },
  {
    id: 'infra',
    label: 'Infra, Testing and Tools',
    command: 'infra',
    items: [
      { name: 'Docker', level: 'working' },
      { name: 'AWS', level: 'working' },
      { name: 'Vercel', level: 'core' },
      { name: 'GitHub Actions', level: 'working' },
      { name: 'Vitest', level: 'core' },
      { name: 'Playwright', level: 'core' },
      { name: 'pytest', level: 'working' },
      { name: 'Sentry', level: 'working' },
      { name: 'Clerk / Auth0', level: 'working' },
      { name: 'Mixpanel', level: 'familiar' },
    ],
  },
]

/* ───────────────────────────── gallery ───────────────────────────── */

export interface Photo {
  src: string
  caption: string
  width: number
  height: number
}

export const galleryCaption = {
  quote: '5 bug busters & codermen',
  attribution: 'BugByte',
}

/**
 * Drop newer photographs into /public/assets/hof and list them here —
 * the grid sizes itself from the width/height you give it.
 */
export const gallery: Photo[] = [
  { src: '/assets/hof/1.jpg', caption: 'Hack4Bengal 2.0', width: 800, height: 600 },
  { src: '/assets/hof/2.jpg', caption: 'Diversion 2k23', width: 1600, height: 1000 },
  { src: '/assets/hof/3.jpg', caption: 'Hack The Mountains 3.0', width: 800, height: 600 },
  { src: '/assets/hof/4.jpg', caption: 'The team, mid-build', width: 900, height: 1000 },
  { src: '/assets/hof/5.jpg', caption: 'Demo day', width: 800, height: 600 },
  { src: '/assets/hof/6.jpg', caption: 'BugByte', width: 600, height: 600 },
  { src: '/assets/hof/7.jpg', caption: 'Judging at IISER Kolkata', width: 800, height: 600 },
  { src: '/assets/hof/8.jpg', caption: 'Winners’ table', width: 800, height: 600 },
  { src: '/assets/hof/9.jpg', caption: 'The long night', width: 800, height: 600 },
]

/* ───────────────────────────── widgets ───────────────────────────── */

/** The stat widget on the desktop. Keep it to three, keep them true. */
export const highlights: { value: string; label: string; sub: string }[] = [
  { value: '10', label: 'production apps', sub: 'retail · fintech · health · mfg' },
  { value: '900', label: 'problems solved', sub: 'LeetCode Knight, top 5.42%' },
  { value: '₹4L+', label: 'monthly donations', sub: 'zero payment failures' },
]
