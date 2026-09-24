import { SPEEDS, type StepPlayer } from '../player/use-step-player.ts'

interface PlayerControlsProps<S> {
  player: StepPlayer<S>
}

export function PlayerControls<S>({ player }: PlayerControlsProps<S>) {
  const { index, total, playing, speed } = player

  return (
    <div className="player-controls">
      <p className="caption" aria-live="polite">
        {player.step?.caption ?? 'Sin pasos'}
      </p>
      <div className="buttons">
        <button onClick={player.reset}>⏮ Reiniciar</button>
        <button onClick={player.prev} disabled={index === 0}>
          ◀ Anterior
        </button>
        <button onClick={playing ? player.pause : player.play}>
          {playing ? '⏸ Pausa' : '▶ Reproducir'}
        </button>
        <button onClick={player.next} disabled={index >= total - 1}>
          Siguiente ▶
        </button>
        <label>
          Velocidad{' '}
          <select
            value={speed}
            onChange={(e) => player.setSpeed(Number(e.target.value))}
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>
        <span>
          Paso {total === 0 ? 0 : index + 1} / {total}
        </span>
      </div>
    </div>
  )
}
