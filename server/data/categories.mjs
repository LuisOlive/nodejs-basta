import range from 'lodash/range'
import shuffle from 'lodash/shuffle'

const categories = ['apellidos', 'empleos', 'frutos', 'nombres', 'países']

export default categories

export const { length } = categories

export function fiveCategories() {
  const c = shuffle(categories).slice(0, 4)

  return c
}
