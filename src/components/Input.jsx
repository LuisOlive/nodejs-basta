export default function Input({ setValue, onChange, className, placeholder, children }) {
  return (
    <input
      className={'rounded-full px-4 py-2 ' + className}
      placeholder={placeholder || children || ''}
      onChange={onChange}
      type="text"
    />
  )
}
