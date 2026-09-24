import { useState } from 'react'
import type { KnightBfsState } from '../../algorithms/knight-bfs.ts'
import { PlayerControls } from '../../components/PlayerControls.tsx'
import { Pseudocode } from '../../components/Pseudocode.tsx'
import type { StepPlayer } from '../../player/use-step-player.ts'
import { KnightBoard } from './KnightBoard.tsx'
import { PHASES, PSEUDOCODE } from './knight-content.ts'

type Tab = 'code' | 'game' | 'general'
type Lang = 'en' | 'es'

const TABS: { id: Tab; label: string }[] = [
  { id: 'code', label: 'Pseudocódigo' },
  { id: 'game', label: 'En el juego' },
  { id: 'general', label: 'En general' },
]

const LEGEND = [
  ['visited', 'visitado'],
  ['discovered', 'descubierto'],
  ['active', 'en proceso'],
  ['goal', 'objetivo'],
] as const

export function KnightBfsScene({
  player,
}: {
  player: StepPlayer<KnightBfsState>
}) {
  const [tab, setTab] = useState<Tab>('code')
  const [lang, setLang] = useState<Lang>('es')
  const { step } = player
  if (!step) return null

  const { state, caption } = step
  const phase = PHASES[state.phase]

  return (
    <section className="frame">
      <header className="frame-header">
        <span className="eyebrow">BFS · El salto del caballo</span>
        <span className="counter">
          {player.index + 1} / {player.total}
        </span>
      </header>
      <h1 className="step-title">{phase.title}</h1>

      <KnightBoard state={state} />

      <div className="queue">
        <span className="eyebrow">Cola</span>
        {state.queue.length === 0 ? (
          <span className="chip" data-empty>
            vacía
          </span>
        ) : (
          state.queue.map((sq) => (
            <span key={sq} className="chip">
              {sq}
            </span>
          ))
        )}
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        {tab === 'code' && (
          <div className="lang-toggle">
            {(['en', 'es'] as const).map((l) => (
              <button
                key={l}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tab-panel">
        {tab === 'code' && (
          <Pseudocode lines={PSEUDOCODE[lang]} highlight={phase.lines} />
        )}
        {tab === 'game' && (
          <div className="game-text">
            <p aria-live="polite">{caption}</p>
            <ul className="legend">
              {LEGEND.map(([kind, text]) => (
                <li key={kind} data-kind={kind}>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'general' && (
          <div className="general-text">
            <span className="eyebrow">En cualquier grafo</span>
            <p>{phase.general}</p>
          </div>
        )}
      </div>

      <PlayerControls player={player} />
    </section>
  )
}
