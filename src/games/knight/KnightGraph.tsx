import type { KnightBfsState } from '../../algorithms/knight-bfs.ts'
import { GRAPH_HEIGHT, GRAPH_WIDTH, type GraphNode } from './graph-layout.ts'

const QUEUE_SLOTS = 6

interface KnightGraphProps {
  nodes: GraphNode[]
  state: KnightBfsState
}

export function KnightGraph({ nodes, state }: KnightGraphProps) {
  const bySq = new Map(nodes.map((n) => [n.sq, n]))
  const kindOf = (sq: string) => state.cells[sq]?.kind
  const levels = Math.max(...nodes.map((n) => n.level), 0)
  const slots = Math.max(QUEUE_SLOTS, state.queue.length)

  return (
    <div className="board-panel graph-panel">
      <div className="graph-caption">
        <span>Grafo</span>
        <span>
          nivel {Array.from({ length: levels + 1 }, (_, i) => i).join(' · ')}
        </span>
      </div>

      <div
        className="graph"
        role="img"
        aria-label="Árbol de búsqueda en anchura"
      >
        <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} aria-hidden="true">
          {nodes
            .filter((n) => n.parent)
            .map((n) => {
              const p = bySq.get(n.parent!)!
              const kind = kindOf(n.sq)
              return (
                <line
                  key={n.sq}
                  className="edge"
                  data-kind={kind === 'goal' ? undefined : kind}
                  data-path={
                    (kind === 'path' && kindOf(p.sq) === 'path') || undefined
                  }
                  x1={p.x}
                  y1={p.y}
                  x2={n.x}
                  y2={n.y}
                />
              )
            })}
        </svg>
        {nodes.map((n) => {
          const mark = state.cells[n.sq]
          return (
            <div
              key={n.sq}
              className="node mark"
              data-kind={mark?.kind ?? 'unknown'}
              style={{
                left: `${(n.x / GRAPH_WIDTH) * 100}%`,
                top: `${(n.y / GRAPH_HEIGHT) * 100}%`,
              }}
            >
              <span className="node-label">{mark ? n.label : '?'}</span>
              {mark && <span className="node-square">{n.sq}</span>}
              {mark?.dist !== undefined && (
                <span className="node-dist">{mark.dist}</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="graph-caption">
        <span className="accent">← sale · dequeue</span>
        <span>Cola FIFO</span>
        <span className="accent">entra · enqueue →</span>
      </div>
      <div className="queue-tube">
        {Array.from({ length: slots }, (_, i) => {
          const sq = state.queue[i]
          return sq ? (
            <div key={sq} className="slot mark" data-kind={kindOf(sq)}>
              {bySq.get(sq)?.label}
              <span>{sq}</span>
            </div>
          ) : (
            <div key={`empty-${i}`} className="slot" data-empty />
          )
        })}
      </div>
    </div>
  )
}
