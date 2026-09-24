---
name: security-review
description: >
  Checklist de seguridad para una SPA estática React + Vite con Bun.
  Trigger: cuando se agreguen dependencias, se toque HTML dinámico, URLs, variables de entorno,
  workflows de CI, o el usuario pida una revisión de seguridad.
---

## Cuándo usar

- Antes de agregar una dependencia (`bun add`).
- Al renderizar contenido dinámico o leer parámetros de URL.
- Al tocar `.env`, `vite.config.ts` o `.github/workflows/`.

## Checklist

1. **XSS**: nada de `dangerouslySetInnerHTML` ni `innerHTML` con datos no controlados.
2. **Secretos**: ninguna clave en el código. Recuerda que toda variable `VITE_*` termina
   en el bundle público; nunca pongas secretos ahí.
3. **Dependencias**: revisar que el paquete sea mantenido y necesario; `bun audit` si está
   disponible. Preferir la librería estándar o APIs nativas del navegador.
4. **Entrada de URL / query params**: validar y acotar antes de usarla (ej. tamaño del tablero).
5. **CI**: acciones de GitHub fijadas por versión; permisos mínimos en `permissions:`.
6. **Rendimiento como riesgo**: limitar tamaños de entrada que puedan colgar el navegador
   (ej. N-Reinas con N enorme).

## Salida

Delegar al subagente `security-auditor` para revisiones completas. Reportar hallazgos por
severidad con `archivo:línea` y la corrección propuesta.
