import { describe, expect, it } from 'vitest'
import { knightBfs, knightMoves, type KnightBfsState } from './knight-bfs.ts'

const run = (start: string, goal: string): KnightBfsState[] =>
  [...knightBfs(start, goal)].map((s) => s.state)

const finalResult = (start: string, goal: string) =>
  run(start, goal).at(-1)?.result

describe('knightMoves', () => {
  it('en una esquina solo hay 2 saltos', () => {
    expect(knightMoves('a1').sort()).toEqual(['b3', 'c2'])
  })

  it('en el centro hay 8 saltos', () => {
    expect(knightMoves('d4')).toHaveLength(8)
  })
})

describe('knightBfs', () => {
  it('encuentra el mínimo de saltos y un camino válido', () => {
    const result = finalResult('b1', 'e4')
    expect(result?.dist).toBe(2)
    expect(result?.path[0]).toBe('b1')
    expect(result?.path.at(-1)).toBe('e4')
    const path = result?.path ?? []
    for (let i = 1; i < path.length; i++) {
      expect(knightMoves(path[i - 1])).toContain(path[i])
    }
  })

  it('distancias conocidas: esquina a esquina y a la diagonal vecina', () => {
    expect(finalResult('a1', 'h8')?.dist).toBe(6)
    expect(finalResult('a1', 'b2')?.dist).toBe(4)
  })

  it('origen igual a meta: 0 saltos', () => {
    expect(finalResult('d4', 'd4')).toEqual({ dist: 0, path: ['d4'] })
  })

  it('la cola es FIFO: se procesa en el orden en que se encoló', () => {
    const states = run('a1', 'h8')
    const dequeued = states
      .filter((s) => s.phase === 'dequeue')
      .map((s) =>
        Object.keys(s.cells).find((k) => s.cells[k]?.kind === 'active'),
      )
    const enqueued = ['a1']
    for (const s of states.filter(
      (s) => s.phase === 'enqueue' || s.phase === 'init',
    )) {
      for (const [sq, mark] of Object.entries(s.cells)) {
        if (mark?.kind === 'discovered' && !enqueued.includes(sq))
          enqueued.push(sq)
      }
    }
    expect(dequeued).toEqual(enqueued.slice(0, dequeued.length))
  })

  it('las distancias nunca bajan al sacar de la cola (recorrido por niveles)', () => {
    const dists = run('a1', 'h8')
      .filter((s) => s.phase === 'dequeue')
      .map(
        (s) =>
          Object.values(s.cells).find((m) => m?.kind === 'active')?.dist ?? -1,
      )
    expect(dists).toEqual([...dists].sort((a, b) => a - b))
  })

  it('cada paso es una foto independiente', () => {
    const states = run('b1', 'e4')
    const init = states.find((s) => s.phase === 'init')
    expect(Object.keys(init?.cells ?? {}).sort()).toEqual(['b1', 'e4'])
    expect(init?.queue).toEqual(['b1'])
  })

  it('rechaza casillas inválidas', () => {
    expect(() => run('z9', 'a1')).toThrow('Casilla inválida')
  })
})
