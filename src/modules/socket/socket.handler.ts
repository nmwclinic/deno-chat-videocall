import { type Server, Socket } from 'socket.io'
import Typing from '../typing/typing.handlers.ts'
import { GuestRoom, Room } from '../room/room.handlers.ts'
import { Disconnect } from '../disconnect/disconnect.handlers.ts'
import Connected from '../connected/connected.handlers.ts'
import { DisconnectGuest } from '../disconnect/disconnect.handlers.ts'
import { moveUserToRoom } from '../room/room.handlers.ts'

const connect = (io: Server, socket: Socket): void => {
  Connected.handler(io, socket)

  Typing.handler(io, socket)

  Room.handler(io, socket)

  moveUserToRoom.handler(io, socket)

  Disconnect.handler(io, socket)
}

const guestConnect = (io: Server, socket: Socket): void => {
  Typing.handler(io, socket)

  GuestRoom.handler(io, socket)

  DisconnectGuest.handler(io, socket)
}

const SocketHandlers = { connect: connect }
export const GuestSocketHandlers = { connect: guestConnect }
export default SocketHandlers
