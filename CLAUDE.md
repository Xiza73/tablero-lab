# tablero-lab

## 1. Contexto del proyecto

Visualizador de algoritmos sobre escenarios de **juegos de mesa** (y vistas genéricas de grid).
El objetivo es mostrar, paso a paso, cómo "piensa" un algoritmo (BFS, backtracking, minimax,
A*...) sobre un tablero real, con una estética cuidada para **grabar la pantalla y publicar el
resultado como contenido didáctico en redes sociales**.

El problema que resuelve: los algoritmos se explican con diagramas abstractos y aburridos.
Aquí se explican sobre tableros que la gente ya conoce (ajedrez, sudoku, tres en raya...).

## 2. Usuarios y alcance (MVP)

- **Usuario principal**: el creador de contenido (graba la pantalla con OBS u otra herramienta).
- **Audiencia final**: gente que ve los videos en redes; tono didáctico, no infantil.
- **Plataforma**: web (SPA), escritorio. No hay backend.

MVP, un escenario por categoría:

| Categoría            | Ejemplos                                              |
| -------------------- | ----------------------------------------------------- |
| Ajedrez              | Caballo con BFS, N-Reinas con backtracking            |
| Sudoku / puzzles     | Backtracking, propagación de restricciones            |
| Juegos adversariales | Tres en raya / Conecta 4 con minimax y poda alfa-beta |
| Grid genérico        | BFS, DFS, Dijkstra, A\* sobre grilla                  |

Requisitos transversales de cada visualización:

- Controles: play / pausa / paso a paso / reinicio / velocidad.
- Formatos de encuadre para grabar: **9:16**, **1:1** y **16:9**.
- Después del MVP: juegos de mesa menos conocidos, reutilizando el grid genérico.

Fuera de alcance por ahora: exportar video/GIF, login, persistencia, backend.

## 3. Stack y herramientas

- **Runtime / package manager**: Bun (`bun install`, `bun add`, `bunx`). NO usar npm, yarn ni pnpm.
- **Lenguaje**: TypeScript en modo `strict`.
- **UI**: React 19 + Vite.
- **Testing**: Vitest (+ Testing Library para componentes cuando haga falta).
- **Lint / formato**: oxlint (config en `.oxlintrc.json`) + Prettier (sin `;`, comillas simples).

## 4. Comandos clave

```bash
bun install          # instalar dependencias
bun run dev          # servidor de desarrollo (vite)
bun run build        # tsc -b && vite build → dist/
bun run test         # vitest run (una pasada; para watch: bunx vitest)
bun run lint         # oxlint
bun run format       # prettier --write .
```

## 5. Convenciones de código

- **Separación estricta lógica / render**: los algoritmos son funciones puras en TypeScript,
  SIN React ni DOM. Cada algoritmo es un **generador** que emite pasos (`yield`) describiendo
  qué pasó (visitar celda, encolar, retroceder, podar...). La UI solo consume esos pasos.
- Contrato de paso: `Step<S> = { state, caption }` (`src/player/step.ts`). `state` es una foto
  lista para dibujar y DEBE ser una copia nueva en cada `yield` (nunca mutar y re-emitir el mismo
  objeto). `caption` es el texto didáctico en español que aparece en el video.
- Reproducción: `collectSteps(generador)` → `useStepPlayer(steps)` → `<PlayerControls />`.
- Todo algoritmo tiene tests en Vitest sobre los pasos que emite y el resultado final.
- Orden natural: si el algoritmo admite varios órdenes válidos (vecinos, candidatos), usar el
  orden de lectura del tablero (columna a → h, fila 1 → 8), explicarlo en el caption y fijarlo
  con un test. Optimizaciones solo si siguen siendo el mismo algoritmo (ej. cortar al descubrir
  la meta en BFS); variantes como BFS bidireccional o A\* son escenarios aparte.
- Componentes React: `PascalCase.tsx`, un componente por archivo, exports nombrados.
- Resto de archivos: `kebab-case.ts`.
- Nada de `any`; usar `unknown` y acotar. Tipos de dominio explícitos (`Cell`, `Board`, `Step`).
- React 19 (sin React Compiler): no usar `useMemo` / `useCallback` salvo que se mida un problema.
  Datos derivados de constantes se calculan a nivel de módulo, no en el render.
- Estilos: tomar como referencia visual los archivos de `design/` (NO copiar su lógica).
  Sistema "Organic" (Caprasimo + Figtree, terracota y salvia); tokens CSS en `src/index.css`.
  Estados visuales con atributos `data-*` (`data-kind`, `data-active`...), no estilos inline.
  Los colores por estado viven en `.mark[data-kind=...]` y los comparten casillas, nodos y cola.
- Controles del creador (vista, velocidad) van FUERA del marco para no salir en la grabación.
- Cada escenario separa: algoritmo (fases semánticas) → contenido didáctico por fase
  (`*-content.ts`: título, líneas de pseudocódigo, texto general) → escena React.
- Textos de la UI y documentación en **español neutro**; código (identificadores) en inglés.

## 6. Estructura del repositorio

```
src/
  algorithms/   # generadores puros: bfs.ts, backtracking.ts, minimax.ts...  (+ *.test.ts)
  player/       # Step, collectSteps, reducer puro del reproductor y hook useStepPlayer
  games/        # un escenario por carpeta: knight/ (contenido, tablero, grafo, escena)
  components/   # UI compartida: PlayerControls, Pseudocode...
  index.css     # tokens del diseño y estilos
design/         # referencia visual exportada de Claude Design (no se importa en el build)
.claude/        # commands, skills, agents y settings del equipo
```

## 7. Integraciones externas

Ninguna por ahora. Si aparece una, documentarla aquí antes de usarla.

## 8. Reglas de trabajo con Claude

**Hacer**

- Flujo git según los skills `git-flow`, `delivery-handoff` y `github-pr`:
  - Rama de integración: `dev` (rama por defecto). `master` solo recibe PRs desde `dev`.
  - Ramas de trabajo: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`...
  - Conventional Commits: `<type>(<scope>): <subject>`, ≤ 50 caracteres ideal, 72 máximo.
  - Merge siempre con merge commit (`gh pr merge --merge --delete-branch`). Nunca squash ni rebase.
  - Antes de commitear: `bun run lint` y `bun run test` en verde.
  - Proponer el mensaje de commit (y el cuerpo del PR con casos de prueba) y ESPERAR el OK.
- Escribir primero el algoritmo y su test; después la vista.
- Español neutro en textos y documentación (sin regionalismos).

**NO hacer**

- No ejecutar `bun run build` después de cada cambio; el usuario lo corre cuando lo necesita.
- No agregar dependencias sin preguntar (`bun add` requiere aprobación).
- No agregar atribución de IA en commits, PRs ni docs (sin `Co-Authored-By`, sin footers).
- No mezclar lógica del algoritmo dentro de componentes React.
- No hacer push a `master` ni `--force` en ninguna rama compartida.
