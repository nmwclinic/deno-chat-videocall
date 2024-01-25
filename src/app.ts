import { Server, Socket } from 'socket.io'
import { createServer } from 'node:http'
import RedisProvider from './configs/redis.ts'
import Authenticate from './middlewares/authenticate.ts'
import SocketHandlers from './modules/socket/socket.handler.ts'
import { PeerServer } from 'npm:peer'
import ENV from './env.json' with { type: 'json' }

const { PORT } = Deno.env.toObject()
PeerServer({
  host: '127.0.0.1',
  port: 9000,
  path: '/video',
  key: 'peerjs',
  corsOptions: {
    origin: '*',
  },
})

void RedisProvider.connect()

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

const memberChat = io.of(ENV.SOCKET_PATH.MEMBER)
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

server.listen(PORT ?? 8000, () => {
  console.log(`Server running on port ${PORT ?? 8000}`)
})
