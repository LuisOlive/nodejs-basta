import { memo } from 'react'

export default memo(function List({ items, children, className }) {
  return (
    <ul className={className ?? ''}>
      {items?.map?.((item, i) => (
        <li key={i}>{children(item, i)}</li>
      ))}
    </ul>
  )
})
