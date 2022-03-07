export default function List({ items, children, className }) {
  return <ul className={className ?? ''}>{items.map(item => children(item))}</ul>
}
