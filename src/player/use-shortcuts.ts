import { useEffect } from 'react'

export type Shortcuts = Record<string, () => void>

interface KeyLike {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  repeat: boolean
  target: EventTarget | null
}

const EDITABLE = new Set(['INPUT', 'SELECT', 'TEXTAREA'])

/** Devuelve la acción para la tecla, o nada si no corresponde interceptarla. */
export function resolveShortcut(
  e: KeyLike,
  shortcuts: Shortcuts,
): (() => void) | undefined {
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
  const tag = (e.target as { tagName?: string } | null)?.tagName
  if (tag && EDITABLE.has(tag)) return
  return shortcuts[e.key.toLowerCase()]
}

// ponytail: se re-suscribe en cada render (las acciones cambian de identidad); es barato.
export function useShortcuts(shortcuts: Shortcuts) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const action = resolveShortcut(e, shortcuts)
      if (!action) return
      // Evita el scroll y que Espacio también "haga clic" en el botón con foco.
      e.preventDefault()
      action()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
}
