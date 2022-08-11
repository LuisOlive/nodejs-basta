import express from 'express'
import { config as dotenv } from 'dotenv'
import { Server } from 'socket.io'
import { createServer } from 'http'
import path from 'path'

import connect from './connection'
import EventController from './controllers/EventController'

// environment variables
dotenv()
const { PORT, CLIENT } = process.env

// configuring server
const app = express()
const server = createServer(app) // @ts-ignore
const io = new Server(server, { cors: [CLIENT, `http://localhost:${PORT}`] })
const evc = new EventController(io)

// db
connect()
  .then(() => console.log('db ready'))
  .catch(() => console.log('something wrong connecting db, surely ip adress again'))

// starting websockets
io.on('connection', evc.main.bind(evc))

// configuring routes
app.use(express.static(path.resolve('./public')))

app.get('/s', (_, res) => res.json({ message: 'api here.' }))

app.get('*', (_, res) => res.sendFile(path.resolve('./public/index.html')))

// starting server
server.listen(PORT, () => console.log(`server ready on port ${PORT}`))
