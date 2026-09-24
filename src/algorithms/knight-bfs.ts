import type { Step } from '../player/step.ts'

/** Casilla en notación algebraica: 'a1'…'h8'. */
export type Square = string

export type CellKind =
  | 'visited'
  | 'discovered'
  | 'active'
  | 'candidate'
  | 'goal'
  | 'goalFound'
  | 'path'

export interface CellMark {
  kind: CellKind
  dist?: number
}

export type KnightBfsPhase =
  | 'problem'
  | 'init'
  | 'dequeue'
  | 'expand'
  | 'enqueue'
  | 'found'
  | 'result'
  | 'unreachable'

export interface KnightBfsState {
  phase: KnightBfsPhase
  knight: Square
  cells: Partial<Record<Square, CellMark>>
  queue: Square[]
  /** Quién descubrió a cada casilla (árbol BFS hasta este paso). */
  parents: Partial<Record<Square, Square>>
  result?: { dist: number; path: Square[] }
}

const FILES = 'abcdefgh'
const JUMPS = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
] as const

export function isSquare(sq: string): boolean {
  return /^[a-h][1-8]$/.test(sq)
}

export function knightMoves(sq: Square): Square[] {
  const f = FILES.indexOf(sq[0])
  const r = Number(sq[1]) - 1
  return JUMPS.map(([df, dr]) => [f + df, r + dr] as const)
    .filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8)
    .map(([x, y]) => `${FILES[x]}${y + 1}`)
}

const jumps = (n: number) => (n === 1 ? '1 salto' : `${n} saltos`)
const list = (sqs: Square[]) => sqs.join(', ')

export function* knightBfs(
  start: Square,
  goal: Square,
): Generator<Step<KnightBfsState>> {
  if (!isSquare(start) || !isSquare(goal)) {
    throw new Error(`Casilla inválida: ${start} → ${goal}`)
  }

  const dist = new Map<Square, number>()
  const parent = new Map<Square, Square>()
  const queue: Square[] = []

  // Foto nueva en cada paso: nada de lo que se emite comparte estado mutable.
  const snap = (
    phase: KnightBfsPhase,
    overrides: Partial<Record<Square, CellMark>> = {},
    knight = start,
  ): KnightBfsState => {
    const cells: Partial<Record<Square, CellMark>> = {}
    for (const [sq, d] of dist) cells[sq] = { kind: 'visited', dist: d }
    Object.assign(cells, overrides)
    // La meta va al final: el orden de las claves es el orden de descubrimiento.
    cells[goal] ??= { kind: 'goal' }
    return {
      phase,
      knight,
      queue: [...queue],
      parents: Object.fromEntries(parent),
      cells,
    }
  }

  const result = (): Step<KnightBfsState> => {
    const path = [goal]
    while (path[0] !== start) path.unshift(parent.get(path[0])!)
    const d = path.length - 1
    const onPath = Object.fromEntries(
      path.map((sq, i) => [sq, { kind: 'path', dist: i } as const]),
    )
    queue.length = 0
    return {
      state: { ...snap('result', onPath, goal), result: { dist: d, path } },
      caption: `Respuesta: ${jumps(d)}. Camino: ${path.join(' → ')}.`,
    }
  }

  yield {
    state: snap('problem'),
    caption: `El caballo está en ${start} y quiere llegar a ${goal}. ¿Cuántos saltos necesita como mínimo?`,
  }

  dist.set(start, 0)
  if (start === goal) {
    yield result()
    return
  }

  queue.push(start)
  yield {
    state: snap('init', { [start]: { kind: 'discovered', dist: 0 } }),
    caption: `Ponemos ${start} en la cola, lo marcamos como visitado y anotamos distancia 0.`,
  }

  while (queue.length > 0) {
    const cell = queue.shift()!
    const d = dist.get(cell)!
    const active = { [cell]: { kind: 'active', dist: d } as const }

    yield {
      state: snap('dequeue', active),
      caption: `Sacamos ${cell} de la cola (distancia ${d}) y lo exploramos.`,
    }

    const moves = knightMoves(cell)
    const fresh = moves.filter((m) => !dist.has(m))
    const candidates = Object.fromEntries(
      fresh.map((m) => [m, { kind: 'candidate' } as const]),
    )
    yield {
      state: snap('expand', { ...active, ...candidates }),
      caption:
        fresh.length === 0
          ? `Desde ${cell} hay ${moves.length} saltos, pero todos ya fueron visitados.`
          : `Desde ${cell} hay ${moves.length} saltos dentro del tablero. Nuevos: ${list(fresh)}.`,
    }
    if (fresh.length === 0) continue

    const discovered: Partial<Record<Square, CellMark>> = {}
    for (const m of fresh) {
      dist.set(m, d + 1)
      parent.set(m, cell)
      if (m === goal) {
        yield {
          state: snap('found', {
            ...active,
            ...discovered,
            [m]: { kind: 'goalFound', dist: d + 1 },
          }),
          caption: `Descubrimos ${m} desde ${cell}: ¡es el objetivo! Su distancia es ${d + 1}.`,
        }
        yield result()
        return
      }
      queue.push(m)
      discovered[m] = { kind: 'discovered', dist: d + 1 }
    }

    yield {
      state: snap('enqueue', { ...active, ...discovered }),
      caption: `Marcamos ${list(fresh)} como visitados con distancia ${d + 1} y los encolamos.`,
    }
  }

  // ponytail: en un 8×8 el caballo siempre llega; queda por si el tablero cambia.
  yield {
    state: snap('unreachable'),
    caption: `La cola se vació: no hay camino de ${start} a ${goal}.`,
  }
}
