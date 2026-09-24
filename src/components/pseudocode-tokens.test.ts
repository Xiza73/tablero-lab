import { expect, it } from 'vitest'
import { tokenize } from './pseudocode-tokens.ts'

it('clasifica palabras clave, funciones, números, símbolos e identificadores', () => {
  const kinds = tokenize('si salto = meta: devolver dist(salto) + 1')
    .filter((t) => t.text.trim())
    .map((t) => `${t.text}:${t.kind}`)
  expect(kinds).toEqual([
    'si:kw',
    'salto:id',
    '=:sym',
    'meta:id',
    '::sym',
    'devolver:kw',
    'dist:fn',
    '(:sym',
    'salto:id',
    '):sym',
    '+:sym',
    '1:num',
  ])
})

it('no pierde texto al tokenizar', () => {
  const line = 'para cada salto en saltosCaballo(celda):'
  expect(
    tokenize(line)
      .map((t) => t.text)
      .join(''),
  ).toBe(line)
})
