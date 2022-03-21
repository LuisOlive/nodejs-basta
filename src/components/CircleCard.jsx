import Card from './Card'

import { useUser } from '../redux'

export default function CircleCard({ children, circleMessage }) {
  const { color } = useUser()

  return (
    <Card>
      <div
        className={`
        bg-${color}-500
        absolute inset-0 -translate-y-1/2
        h-24 w-24 pt-4
        text-white font-bold text-center text-6xl
        rounded-full mx-auto
        `
          .split(/ {8}/)
          .map(s => s.trim())
          .join(' ')}
      >
        {circleMessage}
      </div>

      {children}
    </Card>
  )
}
