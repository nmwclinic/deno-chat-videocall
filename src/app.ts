import { Server, Socket } from 'socket.io'
import { createServer } from 'node:http'
import { Database } from './configs/redis.ts'
import Authenticate from './middlewares/authenticate.ts'
import SocketHandlers from './modules/socket/socket.handler.ts'
import { PeerServer } from 'npm:peer'

const { PORT } = Deno.env.toObject()
const _Peer = PeerServer({
  host: '192.168.3.19',
  port: 9000,
  path: '/video',
  key: 'peerjs',
  corsOptions: {
    origin: '*',
  },
})

Database.connects()

const server = createServer()
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Accept', 'Accept-Language', 'Authorization'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  connectTimeout: 5000,
})

const memberChat = io.of('/chat')
// const guestChat = io.of('/guest')

memberChat.use((socket: Socket, next) => {
  Authenticate.verifyToken(socket, next)
})

memberChat.on('connection', (socket) => {
  SocketHandlers.connect(io, socket)
})

// guestChat.use((socket: Socket, next) => {
//   Authenticate.verifyToken(socket, next)
// })
// guestChat.on('connection', (socket) => {
//   SocketHandlers.connect(io, socket)
// })

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
