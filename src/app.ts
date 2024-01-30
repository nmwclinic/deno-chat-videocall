import { Server, Socket } from 'socket.io'
import { createServer } from 'node:http'
import RedisProvider from './configs/redis.ts'
import Authenticate from './middlewares/authenticate.ts'
import SocketHandlers, { GuestSocketHandlers } from './modules/socket/socket.handler.ts'
import { PeerServer } from 'npm:peer'
import Env from './env.json' with { type: 'json' }
import { AuthenticateGuest } from './middlewares/authenticate.ts'

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
RedisProvider.connect()

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

const memberChat = io.of(Env.SOCKET_PATH.MEMBER)
const guestChat = io.of(Env.SOCKET_PATH.GUEST)

memberChat.use((socket: Socket, next) => {
  Authenticate.verifyToken(socket, next)
})

memberChat.on('connection', (socket) => {
  SocketHandlers.connect(io, socket)
})
guestChat.use((socket: Socket, next) => {
  AuthenticateGuest.verify(socket, next)
})

guestChat.on('connection', (socket) => {
  GuestSocketHandlers.connect(io, socket)
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
