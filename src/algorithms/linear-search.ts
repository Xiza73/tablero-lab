import type { Step } from '../player/step.ts'

export interface LinearSearchState {
  values: readonly number[]
  current: number // -1 cuando ya no hay nada que comparar
  found: number | null
}

export function* linearSearch(
  values: readonly number[],
  target: number,
): Generator<Step<LinearSearchState>> {
  for (let i = 0; i < values.length; i++) {
    if (values[i] === target) {
      yield {
        state: { values, current: i, found: i },
        caption: `¡Encontrado! ${target} está en la posición ${i}`,
      }
      return
    }
    yield {
      state: { values, current: i, found: null },
      caption: `Comparo ${values[i]} con ${target}: no es`,
    }
  }
  yield {
    state: { values, current: -1, found: null },
    caption: `${target} no está en la lista`,
  }
}
