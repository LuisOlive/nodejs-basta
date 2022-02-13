import express from 'express'
import { config as dotenv } from 'dotenv'
import { Server } from 'socket.io'
import { createServer } from 'http'
import mongoose from 'mongoose'
import main from './main.mjs'
import Game from './classes/Game.mjs'

dotenv()
const { PORT, FRONT_END_URL, MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DBNAME } = process.env

// server
const app = express()
const server = createServer(app)
const io = new Server(server, { cors: [FRONT_END_URL] })

// db
mongoose
  .connect(
    `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.jdepz.mongodb.net/${MONGODB_DBNAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('db ready'))

io.on('connection', socket => main(socket, io))

Game.io = io

server.listen(PORT, () => console.log(`server ready on port ${PORT}`))
