import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import usePrevent from '../hooks/usePrevent'
import * as userActions from '../redux/user/actions'

import Button from './Button'
import ColorPicker from './ColorPicker'
import Input from './Input'
import Card from './Card'

export default function PlayerForm() {
  const dispatch = useDispatch()
  const [name, setName] = useState('')

  const validator = useCallback(value => {
    if (/^\s/.test(value) || /\s$/.test(value))
      return ['Tu nombre no puede empezar ni terminar con espacios']

    if (!/^[a-z0-9ñáéíóú\s_]*$/i.test(value))
      return ['Tu nombre solo debe incluir números, letras, espacios o guiones bajos']

    return [false, value]
  }, [])

  const submit = useCallback(() => {
    dispatch(userActions.setNameAction(name))
    dispatch(userActions.loginAction())
  }, [name])

  useEffect(() => dispatch(userActions.loadUserFromCacheAction()), [])

  return (
    <Card>
      <form onSubmit={usePrevent()}>
        <Input setter={setName} validator={validator} className="w-full">
          ¡ingresa tu nombre!
        </Input>

        <ColorPicker />

        <Button onClick={submit} enabled={name !== ''}>
          ¡Comenzar!
        </Button>
      </form>
    </Card>
  )
}
