import { tokenize, type PseudocodeLine } from './pseudocode-tokens.ts'

interface PseudocodeProps {
  lines: readonly PseudocodeLine[]
  /** Líneas resaltadas (1-based). */
  highlight: readonly number[]
}

export function Pseudocode({ lines, highlight }: PseudocodeProps) {
  return (
    <ol className="pseudocode">
      {lines.map(([indent, text], i) => (
        <li
          key={i}
          data-active={highlight.includes(i + 1) || undefined}
          style={{ paddingLeft: `${6 + indent * 11}px` }}
        >
          <span className="line-number">{i + 1}</span>
          <code>
            {tokenize(text).map((token, j) => (
              <span key={j} data-token={token.kind}>
                {token.text}
              </span>
            ))}
          </code>
        </li>
      ))}
    </ol>
  )
}
