import { describe, expect, it } from 'vitest'
import { knightBfs, knightMoves } from '../../algorithms/knight-bfs.ts'
import { layoutKnightGraph } from './graph-layout.ts'

const layout = (start: string, goal: string) =>
  layoutKnightGraph([...knightBfs(start, goal)].map((s) => s.state))

describe('layoutKnightGraph', () => {
  it('b1 → e4: raíz, 3 hijos y los candidatos de c3 en el nivel 2', () => {
    const nodes = layout('b1', 'e4')
    expect(nodes[0]).toMatchObject({ sq: 'b1', label: 'A', level: 0 })
    expect(nodes.filter((n) => n.level === 1).map((n) => n.sq)).toEqual([
      'c3',
      'd2',
      'a3',
    ])
    const level2 = nodes.filter((n) => n.level === 2)
    expect(level2.every((n) => n.parent === 'c3')).toBe(true)
    // Etiquetas en orden de descubrimiento: d5 sale antes que e4.
    expect(level2.slice(0, 2).map((n) => n.sq)).toEqual(['d5', 'e4'])
  })

  it('cada arista es un salto legal y el nivel es el del padre + 1', () => {
    const nodes = layout('a1', 'e5')
    const bySq = new Map(nodes.map((n) => [n.sq, n]))
    for (const n of nodes.filter((n) => n.parent)) {
      expect(knightMoves(n.parent!)).toContain(n.sq)
      expect(n.level).toBe(bySq.get(n.parent!)!.level + 1)
    }
  })

  it('no hay dos nodos en la misma posición', () => {
    const nodes = layout('a1', 'e5')
    const positions = new Set(nodes.map((n) => `${n.x},${n.y}`))
    expect(positions.size).toBe(nodes.length)
  })
})
