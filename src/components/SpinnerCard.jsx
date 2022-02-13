import Card from './Card'

export default function SpinnerCard({ children }) {
  return (
    <Card>
      <div className="spinner"></div>

      {children}
    </Card>
  )
}
