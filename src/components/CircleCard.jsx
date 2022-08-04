import Card from './Card'

import { useUser } from '../redux'

function trim(strArr) {
  return strArr
    .split('\n')
    .map(s => s.trim())
    .join(' ')
}

export default function CircleCard({ children, circleMessage, className }) {
  const { color } = useUser()

  return (
    <Card className={`my-20 lg:my-auto ${className}`}>
      <div
        className={trim(`
        bg-${color}-500
        absolute inset-0 -translate-y-1/2
        h-24 w-24 pt-4
        text-white font-bold text-center text-6xl
        rounded-full mx-auto
        `)}
      >
        {circleMessage}
      </div>

      {children}
    </Card>
  )
}
