import type { KnightBfsState, Square } from '../../algorithms/knight-bfs.ts'

export const GRAPH_WIDTH = 320
export const GRAPH_HEIGHT = 196
const PAD_X = 12
const PAD_Y = 26
const MAX_NODE = 32
const NODE_FILL = 0.88 // parte de la celda que ocupa el nodo; el resto es aire

export interface GraphNode {
  sq: Square
  label: string
  parent?: Square
  level: number
  x: number
  y: number
}

const cellWidth = (nodesInRow: number) => (GRAPH_WIDTH - 2 * PAD_X) / nodesInRow

/** Diámetro del nodo (unidades del viewBox) para que el nivel más poblado no se encime. */
export function graphNodeSize(nodes: GraphNode[]): number {
  const counts = new Map<number, number>()
  for (const n of nodes) counts.set(n.level, (counts.get(n.level) ?? 0) + 1)
  const widest = Math.max(1, ...counts.values())
  return Math.min(MAX_NODE, cellWidth(widest) * NODE_FILL)
}

const activeOf = (s: KnightBfsState) =>
  Object.keys(s.cells).find((sq) => s.cells[sq]?.kind === 'active')

/**
 * Posiciones fijas para toda la ejecución: cada nodo aparece la primera vez que el BFS
 * lo toca (como candidato o descubierto) y no se mueve en los pasos siguientes.
 * ponytail: niveles por filas y reparto uniforme; los nodos se achican con el nivel más
 * poblado (ver graphNodeSize). Con ~15+ por nivel ya no se leen: agrupar o hacer zoom.
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
      x: PAD_X + cellWidth(row.length) * (col + 0.5),
      y:
        levels === 0
          ? GRAPH_HEIGHT / 2
          : PAD_Y + ((GRAPH_HEIGHT - 2 * PAD_Y) * level) / levels,
    }
  })
}
