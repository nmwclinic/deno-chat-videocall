import HandleError from '../../utils/error.ts'
import { type Server, type Socket } from 'socket.io'

const handler = (io: Server, _socket: Socket): void => {
  const member = io.of('/member')
  const guest = io.of('/guest')
  // let typingStatus = false
  member.on('connection', (socket) => {
    socket.on('typing', (data: { typing: boolean }) => {
      try {
        if (typeof socket.userInfo !== 'object') throw new Error('Cannot found sender id')
        if (socket.room === undefined || socket.room === null) {
          throw new Error('Cannot send message cause room not defined')
        }
        const user = socket.room !== socket.userInfo.room ? 'Admin' : socket.userInfo.fullName
        if (data.typing === true) {
          socket.broadcast.to(socket.room).emit('typing', { user: user, typing: true })
        } else {
          socket.broadcast.to(socket.room).emit('typing', { user: user, typing: false })
        }
      } catch (error: unknown) {
        HandleError.emitClient(socket, error)
      }
    })
  })
  guest.on('connection', (socket) => {
    socket.on('typing', (data: { typing: boolean }) => {
      try {
        if (typeof socket.userInfo !== 'object') throw new Error('Cannot found sender id')
        if (socket.room === undefined || socket.room === null) {
          throw new Error('Cannot send message cause room not defined')
        }
        if (data.typing === true) {
          socket.broadcast.to(socket.room).emit('typing', { user: 'guest', typing: true })
        } else {
          socket.broadcast.to(socket.room).emit('typing', { user: 'guest', typing: false })
        }
      } catch (error: unknown) {
        HandleError.emitClient(socket, error)
      }
    })
  })
}

const Typing = { handler: handler }
export default Typing
