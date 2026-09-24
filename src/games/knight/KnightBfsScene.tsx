import { useState } from 'react'
import type { KnightBfsState } from '../../algorithms/knight-bfs.ts'
import { PlayerControls } from '../../components/PlayerControls.tsx'
import { Pseudocode } from '../../components/Pseudocode.tsx'
import type { StepPlayer } from '../../player/use-step-player.ts'
import type { GraphNode } from './graph-layout.ts'
import { KnightBoard } from './KnightBoard.tsx'
import { KnightGraph } from './KnightGraph.tsx'
import { PHASES, PSEUDOCODE } from './knight-content.ts'

export type KnightView = 'board' | 'graph'
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

interface KnightBfsSceneProps {
  player: StepPlayer<KnightBfsState>
  view: KnightView
  graph: GraphNode[]
}

export function KnightBfsScene({ player, view, graph }: KnightBfsSceneProps) {
  const [tab, setTab] = useState<Tab>('code')
  const [lang, setLang] = useState<Lang>('es')
  const { step } = player
  if (!step) return null

  const { state, caption } = step
  const phase = PHASES[state.phase]

  return (
    <section className="frame">
      <header className="frame-header">
        <span className="eyebrow">
          {view === 'board'
            ? 'BFS · El salto del caballo'
            : 'BFS · Búsqueda en anchura'}
        </span>
        <span className="counter">
          {player.index + 1} / {player.total}
        </span>
      </header>
      <h1 className="step-title">{phase.title}</h1>

      {/* Altura fija para ambas vistas: cambiar de vista no mueve lo de abajo.
          En la vista de grafo la cola ya se dibuja como tubo FIFO. */}
      <div className="visual">
        {view === 'graph' ? (
          <KnightGraph nodes={graph} state={state} />
        ) : (
          <>
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
          </>
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
