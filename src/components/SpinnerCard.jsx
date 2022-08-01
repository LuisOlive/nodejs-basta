import { useUser } from '../redux'
import Card from './Card'

export default function SpinnerCard({ children, color, message, className }) {
  const trueColor = color ?? useUser().color

  return (
    <Card className={className}>
      <div className="flex justify-center mb-2">
        <div
          className={`w-12 h-12 
          animate-spin 
          border-${trueColor}-600 border-l-${trueColor}-300 
          border-4 rounded-full
        `}
        ></div>
      </div>

      <p className={`text-center text-${trueColor}-600 text-xl font-semibold mb-8`}>{message ?? 'Esperando'}...</p>

      {children ?? ''}
    </Card>
  )
}
