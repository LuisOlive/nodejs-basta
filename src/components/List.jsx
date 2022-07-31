export default function List({ items, children, className }) {
  return (
    <ul className={className ?? ''}>
      {items.map((item, i) => (
        <li key={i}>{children(item, i)}</li>
      ))}
    </ul>
  )
}
