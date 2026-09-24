import type { StepPlayer } from '../player/use-step-player.ts'

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
)

export function PlayerControls<S>({ player }: { player: StepPlayer<S> }) {
  const { index, total, playing } = player
  const last = index >= total - 1

  return (
    <nav className="step-nav" aria-label="Controles de reproducción">
      <button
        className="nav-round"
        onClick={player.prev}
        disabled={index === 0}
        aria-label="Paso anterior"
      >
        <Chevron dir="left" />
      </button>
      {/* ponytail: un punto por paso; con decenas de pasos cambiar a barra de progreso */}
      <div className="dots" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            data-done={i <= index || undefined}
            data-current={i === index || undefined}
          />
        ))}
      </div>
      <button
        className="nav-round"
        onClick={playing ? player.pause : player.play}
        aria-label={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <button className="nav-next" onClick={last ? player.reset : player.next}>
        {last ? 'Reiniciar' : 'Siguiente'}
        <Chevron dir="right" />
      </button>
    </nav>
  )
}
