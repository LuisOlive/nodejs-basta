import { useEffect, useState, memo } from 'react'

export default memo(function Input({ setter, className, placeholder, children, validator, inputClassName, name }) {
  const [errorMessage, setErrorMessage] = useState('')
  const [firstTime, setFirstTime] = useState(true)

  console.log('Input created')

  const validateAndSend = value => {
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
  }

  return (
    <label className={`py-3 inline-block ${className}`}>
      <input
        className={`rounded-full px-4 py-2 w-full inline-block ${inputClassName}`}
        placeholder={placeholder ?? children ?? ''}
        onBlur={e => {
          validateAndSend(e.target.value)
          setFirstTime(false)
        }}
        type="text"
        name={name}
      />

      {!firstTime && errorMessage ? <p className="text-red-500">{errorMessage}</p> : ''}
    </label>
  )
})
