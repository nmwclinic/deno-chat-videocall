import HandleError from '../../utils/error.ts'
import { type Server, type Socket } from 'socket.io'

const handler = (_: Server, socket: Socket): void => {
  socket.on('typing', (_: string) => {
    try {
      if (typeof socket.userInfo !== 'object') throw new Error('Cannot found sender id')
      if (socket.room === undefined || socket.room === null) {
        throw new Error('Cannot send message cause room not defined')
      }

      const user = socket.room !== socket.userInfo.room ? 'Admin' : socket.userInfo.fullName

      socket.broadcast.to(socket.room).emit('typing', `${user} typing...`)
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  })
}

const Typing = { handler: handler }
export default Typing
