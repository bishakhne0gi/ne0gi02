'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loading } from '@/components/ui/Loading'
import { skillsQuery } from '@/lib/queries'
import { useWindows } from '@/lib/window-store'
import { useReducedMotion } from '@/hooks'
import { profile, type AppId, type SkillGroup } from '@/lib/content'
import { apps } from '@/lib/apps'
import { cn } from '@/lib/cn'

type Tone = 'out' | 'dim' | 'accent' | 'cmd' | 'warn'
interface Line {
  id: number
  text: string
  tone: Tone
}

const TONE: Record<Tone, string> = {
  out: 'text-[#D7DCE3]',
  dim: 'text-[#6C7480]',
  accent: 'text-[#7BE08A]',
  cmd: 'text-[#E8EDF3]',
  warn: 'text-[#F5A97F]',
}

const LEVEL_MARK: Record<string, string> = {
  core: '●●●',
  working: '●●○',
  familiar: '●○○',
}

/**
 * Skills, presented as what they are: output. The shell is real enough to
 * reward poking at — `help` lists everything it understands.
 */
export function TerminalApp() {
  const { data, isPending } = useQuery(skillsQuery)
  const open = useWindows((s) => s.open)
  const reduced = useReducedMotion()

  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyAt, setHistoryAt] = useState(-1)

  const nextId = useRef(0)
  const scroller = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)

  const push = useCallback((entries: [string, Tone][]) => {
    setLines((prev) => [
      ...prev,
      ...entries.map(([text, tone]) => ({ id: nextId.current++, text, tone })),
    ])
  }, [])

  /* ── boot output ── */
  useEffect(() => {
    if (!data) return

    const boot: [string, Tone][] = [
      [`Last login: today on ttys001`, 'dim'],
      ['', 'out'],
      [`$ whoami`, 'cmd'],
      [`${profile.handle} — ${profile.role}, ${profile.location}`, 'out'],
      ['', 'out'],
      [`$ skills --all`, 'cmd'],
      ...data.flatMap(groupToLines),
      ['', 'out'],
      [`Type 'help' for what else this shell knows.`, 'dim'],
    ]

    if (reduced) {
      push(boot)
      return
    }

    let i = 0
    const timer = setInterval(() => {
      if (i >= boot.length) return clearInterval(timer)
      push([boot[i++]])
    }, 34)

    return () => clearInterval(timer)
    // Boot runs once, when the payload lands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  /* keep the prompt in view */
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      push([[`$ ${cmd}`, 'cmd']])
      if (!cmd) return

      setHistory((h) => [...h, cmd])
      setHistoryAt(-1)

      const [head, ...rest] = cmd.toLowerCase().split(/\s+/)
      const arg = rest.join(' ')

      switch (head) {
        case 'help':
          push([
            ['Available commands', 'accent'],
            ['  skills [frontend|backend|foundations]   list what I work with', 'out'],
            ['  open <letter|projects|timeline|gallery|about|contact>', 'out'],
            ['  whoami                                  who is typing', 'out'],
            ['  contact                                 how to reach me', 'out'],
            ['  clear                                   wipe the screen', 'out'],
          ])
          break

        case 'skills':
          if (!data) break
          if (!arg) {
            push(data.flatMap(groupToLines))
          } else {
            const group = data.find((g) => g.command === arg || g.id === arg)
            if (group) push(groupToLines(group))
            else push([[`skills: no such group '${arg}'`, 'warn']])
          }
          break

        case 'whoami':
          push([[`${profile.handle} — ${profile.role}, ${profile.location}`, 'out']])
          break

        case 'contact':
          push([
            [profile.email, 'accent'],
            ...profile.socials.map((s) => [`${s.label.padEnd(11)} ${s.href}`, 'out'] as [string, Tone]),
          ])
          break

        case 'open': {
          if (arg in apps) {
            open(arg as AppId)
            push([[`opening ${apps[arg as AppId].name}…`, 'accent']])
          } else {
            push([[`open: unknown application '${arg}'`, 'warn']])
          }
          break
        }

        case 'clear':
          setLines([])
          break

        case 'sudo':
          push([[`${profile.handle} is not in the sudoers file. This incident will be reported.`, 'warn']])
          break

        default:
          push([[`zsh: command not found: ${head}`, 'warn'], [`try 'help'`, 'dim']])
      }
    },
    [data, open, push],
  )

  if (isPending) return <Loading label="starting a shell" lines={4} />

  return (
    <div
      ref={scroller}
      onClick={() => field.current?.focus()}
      className="scroll-area h-full overflow-y-auto bg-[#0B0C0E] p-4 font-mono text-[12.5px] leading-[1.62]"
    >
      {lines.map((line) => (
        <p key={line.id} className={cn('whitespace-pre-wrap break-words', TONE[line.tone])}>
          {line.text || ' '}
        </p>
      ))}

      {/* prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(input)
          setInput('')
        }}
        className="mt-1 flex items-center gap-2"
      >
        <span className="shrink-0 text-[#7BE08A]" aria-hidden="true">
          ❯
        </span>
        <input
          ref={field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              const at = historyAt < 0 ? history.length - 1 : Math.max(0, historyAt - 1)
              if (history[at] !== undefined) {
                setHistoryAt(at)
                setInput(history[at])
              }
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              const at = historyAt + 1
              if (at >= history.length) {
                setHistoryAt(-1)
                setInput('')
              } else {
                setHistoryAt(at)
                setInput(history[at])
              }
            }
          }}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
          className="w-full bg-transparent text-[#E8EDF3] caret-[#7BE08A] outline-none placeholder:text-[#4A515C]"
          placeholder="help"
        />
      </form>
    </div>
  )
}

function groupToLines(group: SkillGroup): [string, Tone][] {
  return [
    ['', 'out'],
    [`── ${group.label} ${'─'.repeat(Math.max(0, 34 - group.label.length))}`, 'accent'],
    ...group.items.map(
      (item) => [`  ${LEVEL_MARK[item.level]}  ${item.name}`, 'out'] as [string, Tone],
    ),
  ]
}
