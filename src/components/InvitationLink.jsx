import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import useClipboard from 'react-use-clipboard'

import { useUser } from '../redux'

import Button from './Button'

export default function InvitationLink({}) {
  const url = location.href
  const { color, name } = useUser()
  const [messageIsCopied, copyMessage] = useClipboard(
    `${name} te está invitando a jugar ¡Basta!\n\nÚnete usando el link ${url}`,
    { successDuration: 30000 }
  )
  const [linkIsCopied, copyLink] = useClipboard(url, { successDuration: 30000 })

  return (
    <div className="">
      <p className="text-center mb-2 text-md">
        Envíales este link a tus amigos para invitarlos a jugar
      </p>

      <div
        onClick={copyLink}
        className={`bg-${color}-200 cursor-pointer rounded-full px-4 py-2 w-full flex justify-between`}
      >
        <p>{url}</p>
        <FontAwesomeIcon icon={faClone} className="mt-1" />
      </div>

      {/* Button */}
      <Button className="" onClick={copyMessage} enabled>
        {messageIsCopied || linkIsCopied ? '¡Copiado!' : 'Copiar mensaje de invitación'}
      </Button>
    </div>
  )
}
