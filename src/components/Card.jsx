import { useUser } from '../redux'

export default function Card({ color, children, className }) {
  const trueColor = color ?? useUser().color

  return <div className={`bg-${trueColor}-300 w-11/12 lg:w-3/5 rounded-3xl mx-auto  p-8 relative my-auto ${className}`}>{children}</div>
}
