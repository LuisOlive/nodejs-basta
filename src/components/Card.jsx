import { useUser } from '../redux'

export default function Card({ color, children, className }) {
  const trueColor = color ?? useUser().color

  return (
    <div
      className={`bg-${trueColor}-300 w-3/5 rounded-3xl mx-auto my-auto p-8 relative ${className}`}
    >
      {children}
    </div>
  )
}
