import { type Server, Socket } from 'socket.io'
import Typing from '../typing/typing.handlers.ts'
import { Room } from '../room/room.handlers.ts'
import { Disconnect } from '../disconnect/disconnect.handlers.ts'
import Connected from '../connected/connected.handlers.ts'

const connect = (io: Server, socket: Socket): void => {
  Connected.handler(io, socket)

  Typing.handler(io, socket)

  Room.handler(io, socket)

  Disconnect.handler(io, socket)
}

const SocketHandlers = { connect: connect }
export default SocketHandlers
