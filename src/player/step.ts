/**
 * Un paso de la visualización: una foto lista para dibujar + el texto didáctico.
 * IMPORTANTE: `state` debe ser una copia nueva en cada `yield`. Si el algoritmo muta
 * y re-emite el mismo objeto, todos los pasos guardados terminan mostrando el último.
 */
export interface Step<S> {
  state: S
  caption: string
}

export const MAX_STEPS = 10_000

// ponytail: guarda todos los pasos en memoria para poder retroceder; el tope evita
// colgar el navegador. Si un escenario necesita más, consumir el generador de forma perezosa.
export function collectSteps<S>(
  steps: Iterable<Step<S>>,
  max = MAX_STEPS,
): { steps: Step<S>[]; truncated: boolean } {
  const collected: Step<S>[] = []
  for (const step of steps) {
    if (collected.length === max) return { steps: collected, truncated: true }
    collected.push(step)
  }
  return { steps: collected, truncated: false }
}
