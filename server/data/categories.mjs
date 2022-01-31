import sampleSize from 'lodash/sampleSize.js'

const categories = ['apellidos', 'empleos', 'frutos', 'nombres', 'países']

export default categories

export const { length } = categories

export const fiveCategories = () => sampleSize(categories, 5)
