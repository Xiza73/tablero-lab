import { describe, expect, it } from 'vitest'
import { linearSearch } from './linear-search.ts'

const run = (values: number[], target: number) =>
  [...linearSearch(values, target)].map((s) => s.state)

describe('linearSearch', () => {
  it('recorre hasta encontrar y se detiene', () => {
    const states = run([4, 7, 1, 7], 7)
    expect(states.map((s) => s.current)).toEqual([0, 1])
    expect(states.at(-1)?.found).toBe(1)
  })

  it('recorre todo y termina sin encontrar', () => {
    const states = run([4, 7], 9)
    expect(states.map((s) => s.current)).toEqual([0, 1, -1])
    expect(states.every((s) => s.found === null)).toBe(true)
  })

  it('lista vacía emite solo el paso final', () => {
    expect(run([], 3)).toEqual([{ values: [], current: -1, found: null }])
  })
})
