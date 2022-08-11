import io from 'socket.io-client'

const url = import.meta.env.VITE_SERVER

const socket = io(url, { forceNew: true })
console.log(url)

export default socket
