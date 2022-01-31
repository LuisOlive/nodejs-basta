export default function Section({ color, children, className }) {
  return (
    <section
      className={`bg-${color}-300 w-3/5 rounded-3xl mx-auto my-auto p-8 relative ${className}`}
    >
      {children}
    </section>
  )
}
