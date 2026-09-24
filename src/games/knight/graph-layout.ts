import type { KnightBfsState, Square } from '../../algorithms/knight-bfs.ts'

export const GRAPH_WIDTH = 320
export const GRAPH_HEIGHT = 196
const PAD_X = 20
const PAD_Y = 26

export interface GraphNode {
  sq: Square
  label: string
  parent?: Square
  level: number
  x: number
  y: number
}

const activeOf = (s: KnightBfsState) =>
  Object.keys(s.cells).find((sq) => s.cells[sq]?.kind === 'active')

/**
 * Posiciones fijas para toda la ejecución: cada nodo aparece la primera vez que el BFS
 * lo toca (como candidato o descubierto) y no se mueve en los pasos siguientes.
 * ponytail: niveles por filas y reparto uniforme; con más de ~12 nodos por nivel se
 * enciman. Si un escenario crece, agrupar hijos bajo su padre o hacer zoom por nivel.
 */
export function layoutKnightGraph(states: KnightBfsState[]): GraphNode[] {
  const found = new Map<Square, { parent?: Square; level: number }>()

  for (const s of states) {
    const active = activeOf(s)
    for (const [sq, mark] of Object.entries(s.cells)) {
      if (!mark || mark.kind === 'goal' || found.has(sq)) continue
      const parent = s.parents[sq] ?? (sq === active ? undefined : active)
      const level = parent ? (found.get(parent)?.level ?? 0) + 1 : 0
      found.set(sq, { parent, level })
    }
  }

  const levels = Math.max(...[...found.values()].map((n) => n.level), 0)
  const perLevel = new Map<number, Square[]>()
  for (const [sq, { level }] of found) {
    perLevel.set(level, [...(perLevel.get(level) ?? []), sq])
  }

  return [...found].map(([sq, { parent, level }], i) => {
    const row = perLevel.get(level)!
    const col = row.indexOf(sq)
    return {
      sq,
      label: i < 26 ? String.fromCharCode(65 + i) : String(i + 1),
      parent,
      level,
      x: PAD_X + ((GRAPH_WIDTH - 2 * PAD_X) * (col + 1)) / (row.length + 1),
      y:
        levels === 0
          ? GRAPH_HEIGHT / 2
          : PAD_Y + ((GRAPH_HEIGHT - 2 * PAD_Y) * level) / levels,
    }
  })
}
