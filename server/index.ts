import express from 'express'
import { config as dotenv } from 'dotenv'
import { Server } from 'socket.io'
import { createServer } from 'http'

import connect from './connection'
import EventController from './controllers/EventController'

// environment variables
dotenv()
const { PORT: port, FRONTEND_URL: frontendUrl } = process.env

// configuring server
const app = express()
const server = createServer(app) // @ts-ignore
const io = new Server(server, { cors: [frontendUrl] })
const evc = new EventController(io)

// db
// connect()
//   .then(() => console.log('db ready'))
//   .catch(() => console.log('something wrong connecting db, surely ip adress again'))

// starting websockets
io.on('connection', evc.main.bind(evc))

// starting server
server.listen(port, () => console.log(`server ready on port ${port}`))
