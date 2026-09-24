import { describe, expect, it } from 'vitest'
import {
  initPlayer,
  playerReducer,
  type PlayerState,
} from './player-reducer.ts'

const at = (index: number, playing = false): PlayerState => ({
  index,
  length: 3,
  playing,
})

describe('playerReducer', () => {
  it('tick avanza y se detiene solo en el último paso', () => {
    const s1 = playerReducer(at(0, true), { type: 'tick' })
    expect(s1).toEqual(at(1, true))
    expect(playerReducer(s1, { type: 'tick' })).toEqual(at(2, false))
  })

  it('play al final vuelve a empezar', () => {
    expect(playerReducer(at(2), { type: 'play' })).toEqual(at(0, true))
  })

  it('play no hace nada útil con uno o cero pasos', () => {
    expect(playerReducer(initPlayer(1), { type: 'play' }).playing).toBe(false)
    expect(playerReducer(initPlayer(0), { type: 'play' }).playing).toBe(false)
  })

  it('next y prev respetan los bordes y pausan', () => {
    expect(playerReducer(at(2, true), { type: 'next' })).toEqual(at(2))
    expect(playerReducer(at(0, true), { type: 'prev' })).toEqual(at(0))
    expect(playerReducer(at(1, true), { type: 'next' })).toEqual(at(2))
  })

  it('reset vuelve al inicio en pausa', () => {
    expect(playerReducer(at(2, true), { type: 'reset' })).toEqual(at(0))
  })
})
