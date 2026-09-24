/** [sangría, texto] */
export type PseudocodeLine = readonly [number, string]

export type TokenKind = 'kw' | 'fn' | 'num' | 'sym' | 'id'

export interface Token {
  text: string
  kind: TokenKind
}

const KEYWORDS = new Set([
  'function',
  'while',
  'for',
  'each',
  'in',
  'on',
  'if',
  'and',
  'return',
  'is',
  'not',
  'empty',
  'función',
  'mientras',
  'para',
  'cada',
  'en',
  'si',
  'y',
  'devolver',
  'no',
  'esté',
  'vacía',
])

const WORD = /^[A-Za-zÀ-ÿ_]/
const SPACE = /^\s+$/

export function tokenize(line: string): Token[] {
  const raw =
    line.match(/[A-Za-zÀ-ÿ_][\wÀ-ÿ]*|\d+|\s+|[^\sA-Za-zÀ-ÿ_\d]/g) ?? []
  return raw.map((text, i) => {
    if (SPACE.test(text)) return { text, kind: 'id' }
    if (KEYWORDS.has(text)) return { text, kind: 'kw' }
    if (/^\d+$/.test(text)) return { text, kind: 'num' }
    if (WORD.test(text)) {
      const next = raw.slice(i + 1).find((t) => !SPACE.test(t))
      return { text, kind: next === '(' ? 'fn' : 'id' }
    }
    return { text, kind: 'sym' }
  })
}
