import { describe, expect, it } from 'vitest'
import { collectSteps, type Step } from './step.ts'

function* countTo(n: number): Generator<Step<number>> {
  for (let i = 1; i <= n; i++) yield { state: i, caption: `${i}` }
}

describe('collectSteps', () => {
  it('guarda todos los pasos si caben', () => {
    const { steps, truncated } = collectSteps(countTo(3))
    expect(steps.map((s) => s.state)).toEqual([1, 2, 3])
    expect(truncated).toBe(false)
  })

  it('corta en el tope y lo avisa', () => {
    const { steps, truncated } = collectSteps(countTo(Infinity), 5)
    expect(steps).toHaveLength(5)
    expect(truncated).toBe(true)
  })

  it('exactamente el tope no cuenta como truncado', () => {
    expect(collectSteps(countTo(5), 5).truncated).toBe(false)
  })
})
