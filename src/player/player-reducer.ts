export interface PlayerState {
  index: number
  length: number
  playing: boolean
}

export type PlayerAction = {
  type: 'play' | 'pause' | 'next' | 'prev' | 'reset' | 'tick'
}

const lastIndex = (s: PlayerState) => Math.max(0, s.length - 1)

export function initPlayer(length: number): PlayerState {
  return { index: 0, length, playing: false }
}

export function playerReducer(
  s: PlayerState,
  action: PlayerAction,
): PlayerState {
  switch (action.type) {
    case 'play':
      // Al final, "play" vuelve a empezar.
      return {
        ...s,
        index: s.index >= lastIndex(s) ? 0 : s.index,
        playing: s.length > 1,
      }
    case 'pause':
      return { ...s, playing: false }
    case 'next':
      return {
        ...s,
        index: Math.min(s.index + 1, lastIndex(s)),
        playing: false,
      }
    case 'prev':
      return { ...s, index: Math.max(s.index - 1, 0), playing: false }
    case 'reset':
      return initPlayer(s.length)
    case 'tick': {
      const index = Math.min(s.index + 1, lastIndex(s))
      return { ...s, index, playing: index < lastIndex(s) }
    }
  }
}
