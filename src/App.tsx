import { useState } from 'react'
import { knightBfs } from './algorithms/knight-bfs.ts'
import { layoutKnightGraph } from './games/knight/graph-layout.ts'
import {
  KnightBfsScene,
  type KnightView,
} from './games/knight/KnightBfsScene.tsx'
import { collectSteps } from './player/step.ts'
import { useShortcuts } from './player/use-shortcuts.ts'
import { SPEEDS, useStepPlayer } from './player/use-step-player.ts'

const knight = collectSteps(knightBfs('b1', 'e4'))
const knightGraph = layoutKnightGraph(knight.steps.map((s) => s.state))

const VIEWS: { id: KnightView; label: string }[] = [
  { id: 'board', label: 'Tablero' },
  { id: 'graph', label: 'Grafo' },
]

export function App() {
  const player = useStepPlayer(knight.steps)
  const [view, setView] = useState<KnightView>('board')

  useShortcuts({
    ' ': player.playing ? player.pause : player.play,
    arrowright: player.next,
    arrowleft: player.prev,
    home: player.reset,
    v: () => setView((v) => (v === 'board' ? 'graph' : 'board')),
  })

  return (
    <main className="stage">
      <KnightBfsScene player={player} view={view} graph={knightGraph} />
      {/* Fuera del marco: no aparece en la grabación. */}
      <div className="toolbar">
        <div className="segmented" role="group" aria-label="Vista">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <label>
          Velocidad{' '}
          <select
            value={player.speed}
            onChange={(e) => player.setSpeed(Number(e.target.value))}
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="shortcuts-hint">
        <kbd>Espacio</kbd> reproducir · <kbd>←</kbd> <kbd>→</kbd> pasos ·{' '}
        <kbd>Inicio</kbd> reiniciar · <kbd>V</kbd> vista
      </p>
    </main>
  )
}
