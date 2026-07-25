/**
 * ─────────────────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT.
 *
 *  Everything the site renders comes from here. It is served through
 *  /api/* route handlers and consumed with TanStack Query, so you can later
 *  swap this module for a CMS, a database, or MDX without touching any UI.
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
  location: string
  avatar: string
  signature: string
  resumeUrl: string
  email: string
  /** Rotating subtitles under the name in About / Letter header. */
  titles: string[]
  socials: { label: string; href: string; icon: SocialIcon }[]
}

export type SocialIcon =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'mail'
  | 'resume'
  | 'leetcode'
  | 'codechef'
  | 'codeforces'

export const profile: Profile = {
  name: 'Bishakh Neogi',
  handle: 'ne0gi02',
  role: 'Software Engineer',
  location: 'Kolkata, India',
  avatar: '/assets/bisakhpng.png',
  signature: '/assets/sign.png',
  resumeUrl:
    'https://drive.google.com/file/d/1A4EeEkMIh0E2SIVDm8qxhn7rUNGuCyia/view?usp=drive_link',
  email: 'bneogi102002@gmail.com',
  titles: [
    'Software Engineer at CosX AI',
    'Building VectorDrop',
    'Fullstack Developer',
    'Hackathon Enthusiast',
    'Competitive Programmer',
  ],
  socials: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/bishakh-neogi-387815205/',
      icon: 'linkedin',
    },
    { label: 'GitHub', href: 'https://github.com/bishakhne0gi', icon: 'github' },
    { label: 'Instagram', href: 'https://www.instagram.com/bishakh.neogi/', icon: 'instagram' },
    { label: 'LeetCode', href: 'https://leetcode.com/ne0gi02/', icon: 'leetcode' },
    { label: 'CodeChef', href: 'https://www.codechef.com/users/ne0gi02', icon: 'codechef' },
    { label: 'Codeforces', href: 'https://codeforces.com/profile/ne0gi02', icon: 'codeforces' },
  ],
}

/* ───────────────────────────── the letter ─────────────────────────────
 *
 *  The narrative spine of the site. Each block renders as one paragraph of
 *  a formal letter, revealed as the reader scrolls.
 *
 *  In `body`, wrap text in [[…|target]] to turn it into an inline
 *  attachment link that opens another window:
 *      [[Tenderflow|projects]]  → opens Projects.app
 *      [[the timeline|timeline]] → opens Timeline.app
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
  place: 'Kolkata, India',
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
    body: `I am writing to introduce myself. My name is **Bishakh Neogi** — most of the internet knows me as *ne0gi02* — and I build software for the web. This letter is my portfolio. I could have given you a grid of cards and a scroll bar, but a letter felt more honest: it has a beginning, it asks for your attention, and it ends with a signature.`,
  },
  {
    id: 'origin',
    kind: 'paragraph',
    marginNote: '02 · where it began',
    body: `I started the way most of us do — a text editor, a browser, and far too many tabs. Somewhere between the first div that refused to center and the first server that actually responded, it stopped being homework and started being the thing I did on weekends. That trajectory is laid out plainly in [[the timeline|timeline]], if you would like to see the receipts.`,
  },
  {
    id: 'craft',
    kind: 'paragraph',
    marginNote: '03 · what I do',
    body: `My work sits across the whole stack. On the front, React and Next.js, and a stubbornness about how interfaces should feel under the cursor. On the back, Node, Spring Boot, and databases that I try very hard not to over-normalise. The complete inventory is available in [[the terminal|terminal]] — I keep it there because a list of skills should look like what it is: output.`,
  },
  {
    id: 'now',
    kind: 'paragraph',
    marginNote: '04 · where I am',
    body: `At present I am at **CosX AI**, building production-grade agents, workflows and platforms — the unglamorous plumbing that decides whether a company's AI actually compounds or merely demos well. Alongside it I ship **VectorDrop**, an image-to-SVG converter that runs entirely in the browser, free and without an account, because the existing options all wanted one.`,
  },
  {
    id: 'proof',
    kind: 'paragraph',
    marginNote: '05 · the evidence',
    body: `Claims are cheap, so here is the evidence. A shipped product and five projects, most of the latter built inside 36-hour hackathon windows, several of which came home with something. [[Open the attachments|projects]] and judge them yourself — the source is public, the demos are live, and I have not hidden the rough edges.`,
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
    body: `None of it happened alone. Hackathons are won by teams that can argue at 3 a.m. and still ship by nine. There are photographs — badly lit, entirely sincere — in [[the gallery|gallery]]. They are the part of this letter I am least able to summarise.`,
  },
  {
    id: 'ask',
    kind: 'paragraph',
    marginNote: '07 · the ask',
    body: `So: I am looking for work where the craft matters, on a team that reviews each other honestly. If that describes where you are, I would very much like to talk. The fastest route is [[a reply|contact]] — the compose window is already open.`,
  },
  {
    id: 'thanks',
    kind: 'signoff',
    body: 'Thanking you for your time and consideration,',
  },
]

/* ───────────────────────────── projects ───────────────────────────── */

export type ProjectCategory = 'hackathon' | 'product' | 'open-source' | 'experiment'

export interface Project {
  id: string
  title: string
  year: string
  category: ProjectCategory
  blurb: string
  description: string
  stack: string[]
  accolades: string[]
  /** Screenshots. Leave empty and a typographic cover is generated instead. */
  images: string[]
  github?: string
  live?: string
  /** Marks the headline piece — pinned first, shown wide in the grid. */
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'vectordrop',
    title: 'VectorDrop',
    year: '2026',
    category: 'product',
    featured: true,
    blurb: 'Turn any image into editable vectors.',
    description:
      'A browser-based converter that turns raster images — PNG, JPG, WebP — into clean, editable SVG. Intelligent path tracing keeps anchor points to a minimum while holding the curves, so the output drops straight into Figma or Illustrator. Free, no account, nothing to install. An AI icon generator that learns a design system’s style is next.',
    stack: ['Next.js', 'TypeScript', 'Canvas', 'SVG', 'Path tracing'],
    accolades: [
      'Shipped and live at vectordrop.co.in',
      'Built as an alternative to Vector Magic and Illustrator’s Image Trace',
    ],
    images: [],
    live: 'https://vectordrop.co.in',
  },
  {
    id: 'tenderflow',
    title: 'Tenderflow',
    year: '2023',
    category: 'hackathon',
    blurb: 'Tender awards, made tamper-proof.',
    description:
      'A blockchain-powered DApp on FLOW that enforces fairness in public tendering through NFTs — removing manipulation and bias from an process that badly needed both removed. Built for transparent, merit-based awards in public and government sectors.',
    stack: ['React', 'Cadence', 'Filecoin', 'GCP', 'Node.js', 'Docker'],
    accolades: [
      'Winner — Postman track, Hack4Bengal 2.0',
      'Runners-up — Google Cloud track',
      'Second Runners-up — Flow track',
    ],
    images: [
      '/assets/projects/tenderflow/t1.jpeg',
      '/assets/projects/tenderflow/t2.png',
      '/assets/projects/tenderflow/t3.png',
    ],
    github: 'https://github.com/bishakhne0gi/TenderFloww',
    live: 'https://devfolio.co/projects/tenderflow-4af7',
  },
  {
    id: 'ledged',
    title: 'Ledged',
    year: '2023',
    category: 'hackathon',
    blurb: 'Ledgers that cannot be quietly edited.',
    description:
      'Customisable, tamper-proof ledgers written to decentralised chains, with Filecoin/IPFS file attachment and systematic previews. Built to address information manipulation across public and private record-keeping.',
    stack: ['React', '5ire', 'Filecoin', 'Metamask', 'CSS'],
    accolades: ['Best Project on 5ire — Diversion 2k23 (MLH)', 'Best GoDaddy domain name'],
    images: [
      '/assets/projects/ledged/led(1).jpeg',
      '/assets/projects/ledged/led(2).jpeg',
      '/assets/projects/ledged/led(3).jpeg',
    ],
    github: 'https://github.com/bishakhne0gi/Ledged',
    live: 'https://bugbyteledger.netlify.app/',
  },
  {
    id: 'hypethehike',
    title: 'HypeTheHike',
    year: '2023',
    category: 'hackathon',
    blurb: 'Community tourism with proof-of-presence.',
    description:
      'A DApp for community-driven tourism. Join events through Arcana Auth, connect with local communities, and mint NFT identity proofs via Metamask and the ThirdWeb SDK. Imagery pinned to IPFS through Lighthouse.',
    stack: ['React', 'Arcana', 'Thirdweb', 'Polygon', 'Lighthouse', 'CSS'],
    accolades: [
      'Best Project on Arcana — HackTheMountains 3.0 (MLH)',
      'Best Project on Lighthouse',
    ],
    images: [
      '/assets/projects/hype/H1.jpg',
      '/assets/projects/hype/H2.png',
      '/assets/projects/hype/H3.png',
    ],
    github: 'https://github.com/bishakhne0gi/Hype-The-Hike',
    live: 'https://github.com/bishakhne0gi/Hype-The-Hike',
  },
  {
    id: 'linkhub',
    title: 'Linkhub',
    year: '2022',
    category: 'product',
    blurb: 'Every dev link, one tap away.',
    description:
      'A React Native app that puts the links you paste forty times a week behind a single tap, with clipboard integration and Firebase email auth for a per-device library.',
    stack: ['React Native', 'Expo', 'Firebase'],
    accolades: ['Shipped to 15+ daily users'],
    images: [
      '/assets/projects/linkhub/l1.jpg',
      '/assets/projects/linkhub/l2.jpg',
      '/assets/projects/linkhub/l3.jpg',
    ],
    github: 'https://github.com/bishakhne0gi/Linkhub',
    live: 'https://github.com/bishakhne0gi/Linkhub/releases',
  },
  {
    id: 'solguide',
    title: 'Solguide',
    year: '2022',
    category: 'product',
    blurb: 'Realtime answers for stuck programmers.',
    description:
      'A realtime problem-solving web app by ByteBug. Built on React and Appwrite, it grows an active community where users post, solve, and share coding challenges as they happen.',
    stack: ['Appwrite', 'React', 'Reactstrap', 'CSS'],
    accolades: ['Top 50 — Appwrite Hackathon'],
    images: [
      '/assets/projects/solguide/sol(1).webp',
      '/assets/projects/solguide/sol(2).webp',
      '/assets/projects/solguide/sol(3).webp',
    ],
    github: 'https://github.com/bishakhne0gi/Appwrite-1',
    live: 'https://dev.to/arnab2001/solguid-realtime-solutions-for-your-coding-quations-22ie',
  },
]

/** Small builds. Rendered as a compact list under the project grid. */
export const experiments: { title: string; github: string; live?: string }[] = [
  {
    title: 'Emotion Detector',
    github: 'https://github.com/bishakhne0gi/emotion_detecter',
    live: 'https://getemotions.netlify.app/',
  },
  { title: 'Spring CRUD', github: 'https://github.com/bishakhne0gi/Spring-Crud' },
  {
    title: 'Food-N-Fun',
    github: 'https://github.com/bishakhne0gi/FoodNFun-for-HackTheMountains2.0',
    live: 'https://devfolio.co/projects/food-n-fun-9225',
  },
  {
    title: 'URL Shortener',
    github: 'https://github.com/bishakhne0gi/urlshortener',
  },
  {
    title: 'Dashboard UI',
    github: 'https://github.com/bishakhne0gi/DashboardUI',
    live: 'https://dashboardclone1.netlify.app/',
  },
  {
    title: 'Envelope Animation',
    github: 'https://github.com/bishakhne0gi/envelop-animation',
    live: 'https://enevelope-animation.netlify.app/',
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
  logo?: string
  href?: string
}

export const timeline: TimelineEntry[] = [
  {
    id: 'cosx',
    year: 'Present',
    kind: 'work',
    title: 'Software Engineer',
    org: 'CosX AI',
    detail:
      'Building production-grade AI agents, workflows and platforms — the systems that turn a company’s operations into something that compounds.',
    logo: '/assets/job.png',
    href: 'https://cosx.ai',
  },
  {
    id: 'vectordrop',
    year: '2026',
    kind: 'work',
    title: 'Building VectorDrop',
    org: 'vectordrop.co.in',
    detail: 'An image-to-SVG converter, shipped and running in the browser.',
    logo: '/assets/dev.png',
    href: 'https://vectordrop.co.in',
  },
  {
    id: 'ibs',
    year: '2024',
    kind: 'work',
    title: 'Software Engineer',
    org: 'IBS Software',
    logo: '/assets/job.png',
    href: 'https://www.linkedin.com/in/bishakh-neogi-387815205/',
  },
  {
    id: 'aot',
    year: '2020 — 2024',
    kind: 'education',
    title: 'B.Tech, Computer Science & Engineering',
    org: 'Academy of Technology',
    detail: 'CGPA 9.3 through the sixth semester.',
    logo: '/assets/aot.png',
  },
  {
    id: 'cardiocare',
    year: 'Jan — May 2023',
    kind: 'work',
    title: 'Full-stack Developer Intern',
    org: 'Cardiocare & VNG',
    logo: '/assets/intern.png',
    href: 'https://www.linkedin.com/in/bishakh-neogi-387815205/',
  },
  {
    id: 'infosys',
    year: 'May 2022 — May 2023',
    kind: 'recognition',
    title: 'Campus Ambassador · Top 74 in HackWithInfy ’22',
    org: 'Infosys',
    logo: '/assets/dev.png',
    href: 'https://www.linkedin.com/in/bishakh-neogi-387815205/',
  },
  {
    id: 'celebrare',
    year: 'Sep — Oct 2021',
    kind: 'work',
    title: 'Full-stack Developer Intern',
    org: 'Celebrare',
    logo: '/assets/dev.png',
    href: 'https://www.linkedin.com/in/bishakh-neogi-387815205/',
  },
  {
    id: 'isc',
    year: '2020',
    kind: 'education',
    title: 'Indian School Certificate (Class XII)',
    org: 'Don Bosco School, Bandel',
    detail: '91%',
    logo: '/assets/isc.png',
  },
  {
    id: 'icse',
    year: '2018',
    kind: 'education',
    title: 'Indian Certificate of Secondary Education (Class X)',
    org: 'Don Bosco School, Bandel',
    detail: '92%',
    logo: '/assets/icse.png',
  },
  {
    id: 'school',
    year: '2008 — 2020',
    kind: 'education',
    title: 'Schooling',
    org: 'Don Bosco School, Bandel',
    logo: '/assets/dbb.png',
  },
]

/* ───────────────────────────── skills ───────────────────────────── */

export interface SkillGroup {
  id: string
  label: string
  /** Rendered as `$ ls ./<command>` in Terminal.app */
  command: string
  items: { name: string; level: 'core' | 'working' | 'familiar' }[]
}

export const skills: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    command: 'frontend',
    items: [
      { name: 'JavaScript', level: 'core' },
      { name: 'TypeScript', level: 'core' },
      { name: 'React', level: 'core' },
      { name: 'Next.js', level: 'core' },
      { name: 'React Native', level: 'working' },
      { name: 'HTML', level: 'core' },
      { name: 'CSS / Tailwind', level: 'core' },
      { name: 'Pug', level: 'familiar' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    command: 'backend',
    items: [
      { name: 'Node.js', level: 'core' },
      { name: 'Express', level: 'core' },
      { name: 'MongoDB', level: 'working' },
      { name: 'MySQL', level: 'working' },
      { name: 'Socket.io', level: 'working' },
      { name: 'Spring Boot', level: 'working' },
      { name: 'Docker', level: 'familiar' },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations & Tools',
    command: 'foundations',
    items: [
      { name: 'C', level: 'working' },
      { name: 'C++', level: 'core' },
      { name: 'Java', level: 'working' },
      { name: 'Git', level: 'core' },
      { name: 'Figma', level: 'working' },
      { name: 'Bash', level: 'working' },
      { name: 'Web Hosting', level: 'working' },
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

export const gallery: Photo[] = [
  { src: '/assets/hof/1.jpg', caption: 'Hack4Bengal 2.0', width: 800, height: 600 },
  { src: '/assets/hof/2.jpg', caption: 'Diversion 2k23', width: 1600, height: 1000 },
  { src: '/assets/hof/3.jpg', caption: 'HackTheMountains 3.0', width: 800, height: 600 },
  { src: '/assets/hof/4.jpg', caption: 'The team, mid-build', width: 900, height: 1000 },
  { src: '/assets/hof/5.jpg', caption: 'Demo day', width: 800, height: 600 },
  { src: '/assets/hof/6.jpg', caption: 'BugByte', width: 600, height: 600 },
  { src: '/assets/hof/7.jpg', caption: 'Stage time', width: 800, height: 600 },
  { src: '/assets/hof/8.jpg', caption: 'Winners’ table', width: 800, height: 600 },
  { src: '/assets/hof/9.jpg', caption: 'The long night', width: 800, height: 600 },
]
