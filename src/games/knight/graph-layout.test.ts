import { describe, expect, it } from 'vitest'
import { knightBfs, knightMoves } from '../../algorithms/knight-bfs.ts'
import { graphNodeSize, layoutKnightGraph } from './graph-layout.ts'

const layout = (start: string, goal: string) =>
  layoutKnightGraph([...knightBfs(start, goal)].map((s) => s.state))

describe('layoutKnightGraph', () => {
  it('b1 → e4: árbol en orden natural, cortado al encontrar la meta', () => {
    const nodes = layout('b1', 'e4')
    expect(nodes[0]).toMatchObject({ sq: 'b1', label: 'A', level: 0 })
    expect(nodes.filter((n) => n.level === 1).map((n) => n.sq)).toEqual([
      'a3',
      'c3',
      'd2',
    ])
    // Primero los hijos de a3, luego los de c3; d2 nunca se procesa.
    const level2 = nodes
      .filter((n) => n.level === 2)
      .map((n) => `${n.parent}>${n.sq}`)
    expect(level2).toEqual([
      'a3>b5',
      'a3>c2',
      'a3>c4',
      'c3>a2',
      'c3>a4',
      'c3>d1',
      'c3>d5',
      'c3>e2',
      'c3>e4',
    ])
  })

  it('cada arista es un salto legal y el nivel es el del padre + 1', () => {
    const nodes = layout('a1', 'e5')
    const bySq = new Map(nodes.map((n) => [n.sq, n]))
    for (const n of nodes.filter((n) => n.parent)) {
      expect(knightMoves(n.parent!)).toContain(n.sq)
      expect(n.level).toBe(bySq.get(n.parent!)!.level + 1)
    }
  })

  it('los nodos de un mismo nivel no se enciman', () => {
    for (const [start, goal] of [
      ['b1', 'e4'],
      ['a1', 'e5'],
    ]) {
      const nodes = layout(start, goal)
      const size = graphNodeSize(nodes)
      for (const a of nodes) {
        for (const b of nodes) {
          if (a !== b && a.level === b.level) {
            expect(Math.abs(a.x - b.x)).toBeGreaterThanOrEqual(size)
          }
        }
      }
    }
  })
})
