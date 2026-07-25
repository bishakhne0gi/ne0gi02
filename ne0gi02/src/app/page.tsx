import { Wallpaper } from '@/components/os/Wallpaper'
import { Shell } from '@/components/os/Shell'
import { letter, profile, projects, timeline } from '@/lib/content'

/** Strip the letter's inline syntax down to plain prose. */
function plain(text: string) {
  return text
    .replace(/\[\[([^\]|]+)\|[^\]]+\]\]/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
}

export default function Home() {
  return (
    <>
      <Wallpaper />
      <Shell />

      {/*
        The interface is a client-side desktop, so the substance is mirrored
        here as ordinary semantic HTML: crawlable, readable without JS, and
        the whole letter in reading order for screen readers that would
        rather not drive a window manager.
      */}
      <div className="sr-only">
        <h1>
          {profile.name} — {profile.role} at {profile.company}
        </h1>
        <p>
          {profile.handle} · {profile.location} ·{' '}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>

        <article>
          <h2>A letter</h2>
          {letter.map((block) => (
            <p key={block.id}>{plain(block.body)}</p>
          ))}
          <p>Yours faithfully, {profile.name}</p>
        </article>

        <section>
          <h2>Projects</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <h3>
                  {project.title} ({project.year})
                </h3>
                <p>{project.description}</p>
                <p>{project.metrics.map((m) => `${m.value} ${m.label}`).join(' · ')}</p>
                <p>Built with {project.stack.join(', ')}.</p>
                {project.accolades.map((a) => (
                  <p key={a}>{a}</p>
                ))}
                {project.github && <a href={project.github}>Source</a>}
                {project.live && <a href={project.live}>Live</a>}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Curriculum vitae</h2>
          <ul>
            {timeline.map((entry) => (
              <li key={entry.id}>
                <h3>
                  {entry.year} — {entry.title}, {entry.org}
                </h3>
                {entry.detail && <p>{entry.detail}</p>}
                {entry.bullets?.map((b) => <p key={b}>{b}</p>)}
              </li>
            ))}
          </ul>
        </section>

        <nav>
          <h2>Elsewhere</h2>
          <ul>
            {profile.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href}>{social.label}</a>
              </li>
            ))}
            <li>
              <a href={profile.resumeUrl}>Résumé</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
