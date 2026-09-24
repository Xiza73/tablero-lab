import type { KnightBfsPhase } from '../../algorithms/knight-bfs.ts'
import type { PseudocodeLine } from '../../components/pseudocode-tokens.ts'

export const PSEUDOCODE: Record<'en' | 'es', readonly PseudocodeLine[]> = {
  en: [
    [0, 'function knightPath(start, goal):'],
    [1, 'queue ← [start]'],
    [1, 'visited ← {start}'],
    [1, 'dist[start] ← 0'],
    [1, 'while queue is not empty:'],
    [2, 'cell ← queue.dequeue()'],
    [2, 'for each move in knightMoves(cell):'],
    [3, 'if move on board and move ∉ visited:'],
    [4, 'visited.add(move)'],
    [4, 'dist[move] ← dist[cell] + 1'],
    [4, 'if move = goal: return dist[move]'],
    [4, 'queue.enqueue(move)'],
    [1, 'return -1'],
  ],
  es: [
    [0, 'función caminoCaballo(inicio, meta):'],
    [1, 'cola ← [inicio]'],
    [1, 'visitados ← {inicio}'],
    [1, 'dist[inicio] ← 0'],
    [1, 'mientras cola no esté vacía:'],
    [2, 'celda ← cola.desencolar()'],
    [2, 'para cada salto en saltosCaballo(celda):'],
    [3, 'si salto en tablero y salto ∉ visitados:'],
    [4, 'visitados.añadir(salto)'],
    [4, 'dist[salto] ← dist[celda] + 1'],
    [4, 'si salto = meta: devolver dist[salto]'],
    [4, 'cola.encolar(salto)'],
    [1, 'devolver -1'],
  ],
}

interface PhaseContent {
  title: string
  /** Líneas del pseudocódigo (1-based) que se resaltan. */
  lines: number[]
  /** Explicación del concepto, válida para cualquier grafo. */
  general: string
}

export const PHASES: Record<KnightBfsPhase, PhaseContent> = {
  problem: {
    title: 'El problema',
    lines: [1],
    general:
      'BFS responde a una pregunta: ¿cuál es el camino más corto en un grafo sin pesos? Aquí cada casilla es un nodo y cada salto legal, una arista.',
  },
  init: {
    title: 'Inicializar',
    lines: [2, 3, 4],
    general:
      'Tres estructuras: una cola FIFO con los nodos pendientes, un conjunto de visitados y una tabla de distancias. El origen entra con distancia 0.',
  },
  dequeue: {
    title: 'Sacar de la cola',
    lines: [5, 6],
    general:
      'Siempre sale el nodo más antiguo. Eso obliga a explorar por niveles: todo lo que está a distancia 1 antes que cualquier cosa a distancia 2.',
  },
  expand: {
    title: 'Generar saltos',
    lines: [7, 8],
    general:
      'Generamos los vecinos del nodo actual. Los que caen fuera del grafo o ya fueron visitados se descartan.',
  },
  enqueue: {
    title: 'Marcar y encolar',
    lines: [9, 10, 11, 12],
    general:
      'Cada vecino nuevo se marca visitado al descubrirlo, no al procesarlo. Así nunca entra dos veces en la cola. Hereda la distancia del padre más uno.',
  },
  found: {
    title: '¡Objetivo!',
    lines: [9, 10, 11],
    general:
      'La primera vez que descubrimos el objetivo su distancia es la mínima: si existiera un camino más corto, lo habría alcanzado un nivel anterior.',
  },
  result: {
    title: 'Resultado',
    lines: [11],
    general:
      'Coste O(V + E): cada nodo y cada arista se visitan una vez. Para reconstruir el camino, basta guardar el padre de cada nodo al descubrirlo.',
  },
  unreachable: {
    title: 'Sin camino',
    lines: [13],
    general:
      'Si la cola se vacía sin encontrar el objetivo, no existe ningún camino entre los dos nodos.',
  },
}
