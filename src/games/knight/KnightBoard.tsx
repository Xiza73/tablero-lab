import type { CellMark, KnightBfsState } from '../../algorithms/knight-bfs.ts'

const FILES = 'abcdefgh'
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1]

function label(mark: CellMark | undefined): string {
  if (!mark) return ''
  if (mark.kind === 'candidate') return '?'
  if (mark.kind === 'goal') return '◎'
  return String(mark.dist ?? '')
}

export function KnightBoard({ state }: { state: KnightBfsState }) {
  return (
    <div className="board-panel">
      <div className="board" role="img" aria-label="Tablero de ajedrez">
        {RANKS.map((rank) =>
          [...FILES].map((file, f) => {
            const sq = `${file}${rank}`
            const mark = state.cells[sq]
            const isKnight = state.knight === sq
            return (
              <div
                key={sq}
                className="square mark"
                data-dark={(rank - 1 + f) % 2 === 0 || undefined}
                data-kind={mark?.kind}
                data-knight={isKnight || undefined}
              >
                {f === 0 && <span className="rank">{rank}</span>}
                {rank === 1 && <span className="file">{file}</span>}
                <span className="piece">{isKnight ? '♞' : label(mark)}</span>
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}
