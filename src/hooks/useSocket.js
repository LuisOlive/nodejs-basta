import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const url = import.meta.env.VITE_URL

export default function useSocket(callback) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socket = io(url, { forceNew: true })
    callback(socket)
    setSocket(socket)
  }, [])

  return socket
}
