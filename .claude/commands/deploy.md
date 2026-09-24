---
description: Pasos de despliegue del build estático de Vite (release dev → master)
argument-hint: '[versión semver, ej. v0.1.0]'
allowed-tools: Read, Bash(git status*), Bash(git log*), Bash(bun install), Bash(bun run test*), Bash(bun run lint*), Bash(bun run build), Bash(gh pr *)
---

Despliega la versión: $ARGUMENTS

Sigue el skill `deploy` del proyecto. Resumen:

1. Confirma que estás en `dev`, limpio y actualizado.
2. Gate: `bun install`, `bun run lint`, `bun run test`, `bun run build` (aquí sí se construye).
3. PR `dev` → `master` (skill `git-flow`), espera el OK del usuario antes de mergear.
4. Tras el merge: tag `$ARGUMENTS` y push del tag.
5. Publica `dist/` en el hosting elegido (ver skill `deploy`).

Detente y pide confirmación antes de cualquier paso que publique o sea irreversible.
