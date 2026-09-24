import { knightBfs } from './algorithms/knight-bfs.ts'
import { KnightBfsScene } from './games/knight/KnightBfsScene.tsx'
import { collectSteps } from './player/step.ts'
import { SPEEDS, useStepPlayer } from './player/use-step-player.ts'

const knight = collectSteps(knightBfs('b1', 'e4'))

export function App() {
  const player = useStepPlayer(knight.steps)

  return (
    <main className="stage">
      <KnightBfsScene player={player} />
      {/* Fuera del marco: no aparece en la grabación. */}
      <div className="toolbar">
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
    </main>
  )
}
