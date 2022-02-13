import io from 'socket.io-client'

const url = import.meta.env.VITE_URL

const socket = io(url, { forceNew: true })

export default socket
