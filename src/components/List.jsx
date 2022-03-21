export default function List({ items, children, className }) {
  return <ul className={className ?? ''}>{items.map((item, index) => children(item, index))}</ul>
}
