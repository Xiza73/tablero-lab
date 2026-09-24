import { describe, expect, it } from 'vitest'
import { resolveShortcut } from './use-shortcuts.ts'

const next = () => {}
const shortcuts = { arrowright: next, v: next, ' ': next }

const key = (
  key: string,
  extra: Partial<Parameters<typeof resolveShortcut>[0]> = {},
) => ({
  key,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  repeat: false,
  target: { tagName: 'BODY' } as unknown as EventTarget,
  ...extra,
})

describe('resolveShortcut', () => {
  it('resuelve teclas sin importar mayúsculas', () => {
    expect(resolveShortcut(key('ArrowRight'), shortcuts)).toBe(next)
    expect(resolveShortcut(key('V'), shortcuts)).toBe(next)
    expect(resolveShortcut(key(' '), shortcuts)).toBe(next)
  })

  it('funciona aunque el foco esté en un botón', () => {
    const target = { tagName: 'BUTTON' } as unknown as EventTarget
    expect(resolveShortcut(key(' ', { target }), shortcuts)).toBe(next)
  })

  it('ignora campos editables, modificadores, repeticiones y teclas sin acción', () => {
    const select = { tagName: 'SELECT' } as unknown as EventTarget
    expect(
      resolveShortcut(key('ArrowRight', { target: select }), shortcuts),
    ).toBeUndefined()
    expect(
      resolveShortcut(key('ArrowRight', { ctrlKey: true }), shortcuts),
    ).toBeUndefined()
    expect(
      resolveShortcut(key('ArrowRight', { metaKey: true }), shortcuts),
    ).toBeUndefined()
    expect(
      resolveShortcut(key(' ', { repeat: true }), shortcuts),
    ).toBeUndefined()
    expect(resolveShortcut(key('x'), shortcuts)).toBeUndefined()
  })
})
