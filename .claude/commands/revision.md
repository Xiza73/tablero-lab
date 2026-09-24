---
description: Revisión de código de los cambios actuales (o de un PR) según las convenciones del proyecto
argument-hint: "[número de PR | rama] (opcional)"
allowed-tools: Read, Grep, Glob, Bash(git diff*), Bash(git log*), Bash(gh pr diff*), Bash(bun run lint*), Bash(bun run test*)
---

Revisa los cambios de: $ARGUMENTS (si está vacío, `git diff dev...HEAD` más los cambios sin commitear).

Delega la revisión al subagente `code-reviewer` y valida contra CLAUDE.md:

1. Lógica de algoritmos separada del render (generadores puros en `src/algorithms/`).
2. Cada algoritmo nuevo o modificado tiene tests en Vitest.
3. TypeScript estricto: sin `any`, tipos de dominio explícitos.
4. `bun run lint` y `bun run test` en verde.
5. Textos de UI en español neutro.

Formato de salida: lista ordenada por severidad (CRÍTICO / ADVERTENCIA / SUGERENCIA),
cada punto con `archivo:línea`, el problema y la corrección propuesta. No apliques cambios.
