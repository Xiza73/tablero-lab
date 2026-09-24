# tablero-lab

Algoritmos explicados paso a paso sobre juegos de mesa.

**Demo:** https://xiza73.github.io/tablero-lab/

Cada escenario muestra cómo "piensa" un algoritmo sobre un tablero conocido, con pseudocódigo
resaltado, explicación del paso y una vista genérica del mismo recorrido.

| Escenario            | Algoritmo                    | Estado       |
| -------------------- | ---------------------------- | ------------ |
| El salto del caballo | BFS (búsqueda en anchura)    | ✅ v0.1.0    |
| N-Reinas             | Backtracking                 | próximamente |
| Sudoku               | Backtracking + restricciones | próximamente |
| Tres en raya         | Minimax con poda alfa-beta   | próximamente |

## Controles

`Espacio` reproducir/pausar · `←` `→` paso anterior/siguiente · `Inicio` reiniciar ·
`V` alternar tablero/grafo

## Desarrollo

Requiere [Bun](https://bun.sh).

```bash
bun install
bun run dev      # http://localhost:5173
bun run test
bun run lint
```

Stack: React 19 + Vite + TypeScript, tests con Vitest.
