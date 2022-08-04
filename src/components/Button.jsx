import { useUser } from '../redux'

export default function Button({ color, children, onClick, className, type, enabled }) {
  const trueColor = color ?? useUser().color
  const reallyEnabled = enabled ?? true
  const dependingClassNames = reallyEnabled ? `bg-${trueColor}-500` : 'bg-gray-200 cursor-not-allowed'

  return (
    <button
      className={`${dependingClassNames} text-white mt-4 rounded-3xl w-full lg:w-2/5 py-2 mx-auto block ${className ?? ''}`}
      role="button"
      onClick={onClick}
      type={type ?? 'button'}
      enabled={reallyEnabled.toString()}
    >
      {children}
    </button>
  )
}
