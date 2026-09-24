---
name: deploy
description: >
  Despliegue de tablero-lab: build estático con Bun + Vite y publicación de dist/.
  Trigger: cuando el usuario quiera desplegar, publicar una versión, cortar un release o configurar hosting.
---

## Cuándo usar

- Publicar una nueva versión del sitio.
- Configurar o cambiar el hosting.

## Build

```bash
bun install
bun run lint && bun run test
bun run build          # genera dist/ (sitio 100% estático, sin backend)
bunx vite preview      # verificación local del build
```

## Release (skill `git-flow`)

1. PR `dev` → `master`, merge con `--merge` (nunca squash).
2. `git tag -a vX.Y.Z -m "release: vX.Y.Z" && git push origin vX.Y.Z`.

## Hosting

<!-- TODO: elegir hosting. Opciones sin costo para un sitio estático:
  - GitHub Pages: workflow en .github/workflows con oven-sh/setup-bun + actions/deploy-pages.
    Requiere `base: '/tablero-lab/'` en vite.config.ts.
  - Vercel / Netlify: build command `bun run build`, output `dist`. -->

## Reglas

- Nunca desplegar con lint o tests en rojo.
- Pedir confirmación antes de mergear a `master`, crear tags o publicar.
