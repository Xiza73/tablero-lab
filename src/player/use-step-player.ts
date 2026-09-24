import { useEffect, useReducer, useState } from 'react'
import { initPlayer, playerReducer } from './player-reducer.ts'
import type { Step } from './step.ts'

export const BASE_STEP_MS = 600
export const SPEEDS = [0.25, 0.5, 1, 2, 4] as const

// ponytail: el largo se toma al montar; para cargar otros pasos, remontar con `key`.
export function useStepPlayer<S>(steps: Step<S>[]) {
  const [state, dispatch] = useReducer(playerReducer, steps.length, initPlayer)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    if (!state.playing) return
    const id = setInterval(
      () => dispatch({ type: 'tick' }),
      BASE_STEP_MS / speed,
    )
    return () => clearInterval(id)
  }, [state.playing, speed])

  return {
    step: steps.at(state.index),
    index: state.index,
    total: steps.length,
    playing: state.playing,
    speed,
    setSpeed,
    play: () => dispatch({ type: 'play' }),
    pause: () => dispatch({ type: 'pause' }),
    next: () => dispatch({ type: 'next' }),
    prev: () => dispatch({ type: 'prev' }),
    reset: () => dispatch({ type: 'reset' }),
  }
}

export type StepPlayer<S> = ReturnType<typeof useStepPlayer<S>>
