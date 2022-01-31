export default function Button({ color, children, onClick, className }) {
  return (
    <button
      className={`bg-${color}-500 text-white fontbold mt-4 rounded-3xl w-2/5 py-2 mx-auto block ${className}`}
      role="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
