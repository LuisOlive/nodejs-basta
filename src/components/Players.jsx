export default function Players({ players, color }) {
  return (
    <ul className={`bg-${color}-300 h-auto py-8 rounded-r-xl`}>
      {players.map(({ name, score, color }) => (
        <li className={`bg-${color}-500 py-2 px-4 text-white flex justify-between`} key={color}>
          <b className="font-bold">{name}</b>
          <span>{score}</span>
        </li>
      ))}
    </ul>
  )
}
