import { useEffect, useState } from 'react'

export default function Input({
  setter,
  className,
  placeholder,
  children,
  validator,
  inputClassName
}) {
  const [errorMessage, setErrorMessage] = useState('')
  const [value, setValue] = useState('')
  const [firstTime, setFirstTime] = useState(true)

  useEffect(() => {
    if (!validator) {
      setter(value)
      return
    }
    const [error, validValue] = validator(value)

    if (!error) {
      setter(validValue)
      setErrorMessage('')
    } else {
      setErrorMessage(error)
      setter('')
    }
  }, [value])

  return (
    <label className={`py-3 inline-block ${className}`}>
      <input
        className={'rounded-full px-4 py-2 w-full inline-block ' + inputClassName}
        placeholder={placeholder ?? children ?? ''}
        onChange={e => {
          setValue(e.target.value)
          setFirstTime(false)
        }}
        type="text"
      />

      {!firstTime && errorMessage ? <p className="text-red-500">{errorMessage}</p> : ''}
    </label>
  )
}
