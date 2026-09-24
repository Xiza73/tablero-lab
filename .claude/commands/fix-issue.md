---
description: Flujo para resolver un bug o issue de GitHub, de la reproducción al PR contra dev
argument-hint: '<número de issue | descripción del bug>'
allowed-tools: Read, Edit, Grep, Glob, Bash(gh issue view*), Bash(git checkout -b *), Bash(git switch *), Bash(git status*), Bash(git diff*), Bash(bun run test*), Bash(bun run lint*), Bash(bunx vitest *)
---

Resuelve: $ARGUMENTS

1. **Entender**: si es un número, `gh issue view $ARGUMENTS`. Resume el bug esperado vs. actual.
2. **Rama**: `git switch dev` y `git checkout -b fix/<slug>` (skill `git-flow`).
3. **Reproducir**: escribe primero un test en Vitest que falle y demuestre el bug.
4. **Corregir**: el cambio mínimo que ponga el test en verde. Si el bug está en un algoritmo,
   corrige en `src/algorithms/`, no en el componente.
5. **Validar**: `bun run test` y `bun run lint` en verde.
6. **Entregar**: sigue el skill `delivery-handoff` (stage → proponer commit y PR con casos de
   prueba → esperar OK → commit + PR a `dev` + merge). Incluye `Closes #<n>` en el PR si aplica.
