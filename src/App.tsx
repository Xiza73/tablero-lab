import { linearSearch } from './algorithms/linear-search.ts'
import { PlayerControls } from './components/PlayerControls.tsx'
import { collectSteps } from './player/step.ts'
import { useStepPlayer } from './player/use-step-player.ts'

// ponytail: demo fija para probar el reproductor; se reemplaza con el primer escenario real.
const demo = collectSteps(linearSearch([8, 3, 5, 1, 9, 6, 2], 9))

export function App() {
  const player = useStepPlayer(demo.steps)
  const state = player.step?.state

  return (
    <main>
      <h1>tablero-lab</h1>
      <p>Búsqueda lineal: encontrar el 9.</p>
      <ol className="cells">
        {state?.values.map((value, i) => (
          <li
            key={i}
            data-current={i === state.current || undefined}
            data-found={i === state.found || undefined}
          >
            {value}
          </li>
        ))}
      </ol>
      <PlayerControls player={player} />
    </main>
  )
}
