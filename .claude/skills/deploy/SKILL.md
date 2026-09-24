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

1. Subir `version` en `package.json` (semver) en una rama → PR a `dev`.
2. PR `dev` → `master`, merge con `--merge` (nunca squash).
3. `git tag -a vX.Y.Z -m "release: vX.Y.Z" && git push origin vX.Y.Z` (tag sobre el merge en `master`).
4. El push a `master` dispara el deploy; verificar la URL pública.

## Hosting: GitHub Pages

- URL: https://xiza73.github.io/tablero-lab/
- Workflow: `.github/workflows/deploy.yml` (push a `master` o manual): lint + test + build → Pages.
- `BASE_PATH=/tablero-lab/` solo en el workflow; en local `vite.config.ts` usa `/`.
- Pages configurado con fuente "GitHub Actions". El entorno `github-pages` debe permitir
  desplegar desde `master` (la rama por defecto es `dev`).
- Deploy manual sin release: `gh workflow run deploy.yml --ref master`.

## Reglas

- Nunca desplegar con lint o tests en rojo.
- Pedir confirmación antes de mergear a `master`, crear tags o publicar.
