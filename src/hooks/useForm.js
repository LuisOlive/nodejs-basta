import { useState } from 'react'
import useArray from './useArray'
import _ from 'lodash'

/**
 *  @requires lodash
 *  @internal this is adapted for the project and reutilize this could not work
 */
export default function useForm(cb = () => {}, arr) {
  const { items, setItems } = useArray(...arr)

  /** use this in onsubmit */
  const handler = e => {
    e.preventDefault()

    setItems(
      _(e.target)
        .filter(['type', 'text'])
        .map(x => [x.name, x.value])
        .value()
    )

    cb(items)
  }

  return [items, handler]
}
