import { useUser } from '../redux'

/**@deprecated use \<Card/> instead */
export default function Section({ color, children, className }) {
  const trueColor = color ?? useUser().color

  return (
    <section
      className={`bg-${trueColor}-300 w-3/5 rounded-3xl mx-auto my-auto p-8 relative ${className}`}
    >
      {children}
    </section>
  )
}
