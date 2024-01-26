import { DateTime } from 'luxon'
import { type Server, type Socket } from 'socket.io'
import RedisProvider from '../../configs/redis.ts'
import { type NewMessage } from '../../models/chat.ts'
import HandleError from '../../utils/error.ts'
import Connected from '../connected/connected.handlers.ts'
import History from '../history-chat/history-chat.services.ts'
import Env from '../../env.json' with { type: 'json' }

const handler = (io: Server, socket: Socket): void => {
  const memberChat = io.of(Env.SOCKET_PATH.MEMBER)
  const backupChatToMongo = async (): Promise<void> => {
    try {
      if (socket.room === undefined) return
      const user_in_room = memberChat.adapter.rooms.get(socket.room)
      const user: string = socket.userInfo?.id ?? ''

      if (user_in_room !== undefined) return
      const response = await RedisProvider.getConnection().lrange(`chat-room:${socket.room}`, 0, -1)
      await RedisProvider.getConnection().del(`chat-room:${socket.room}`)
      const read_message: NewMessage[] = response.map((object) => JSON.parse(object))
        .filter((element) => !element.readBy.includes(user))
        .map((sub) => sub.id)
      if (read_message) {
        await History.readMessage(read_message, user, socket.room, socket.handshake.auth.token)
      }
      const new_message: NewMessage[] = response.map((object) => JSON.parse(object))
        .filter((element) => element.id === undefined)
        .sort((a, b) =>
          DateTime.fromISO(a.createdAt as string).toMillis() - DateTime.fromISO(b.createdAt as string).toMillis()
        )
      await History.saveMessage(new_message, socket.room, socket.handshake.auth.token)
    } catch (error: unknown) {
      HandleError.message(error)
    }
  }

  const disconnect = async (): Promise<void> => {
    try {
      if (socket.userInfo !== undefined && socket.room !== undefined) await socket.leave(socket.room)

      if (socket.userInfo === undefined) throw new Error('')
      await RedisProvider.getConnection().hdel('connected_users', socket.userInfo.id)

      await backupChatToMongo()

      // Mengirimkan daftar koneksi yang tersisa
      const connected_users = await Connected.setConnectedUsers(socket)

      // Should this using to() ??
      memberChat.emit('connected_users', connected_users)
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  }

  socket.on('disconnect', async () => {
    await disconnect()
  })
}

const Guest = (io: Server, socket: Socket): void => {
  const guestChat = io.of(Env.SOCKET_PATH.GUEST)
  const disconnect = async (): Promise<void> => {
    try {
      if (socket.userInfo !== undefined && socket.room !== undefined) await socket.leave(socket.room)

      if (socket.userInfo === undefined) throw new Error('')
      await RedisProvider.getConnection().hdel('connected_users', socket.userInfo.id)

      // Mengirimkan daftar koneksi yang tersisa
      const connected_users = await Connected.setConnectedUsers(socket)

      // Should this using to() ??
      guestChat.emit('connected_users', connected_users)
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  }

  socket.on('disconnect', async () => {
    await disconnect()
  })
}
export const Disconnect = { handler: handler }
export const DisconnectGuest = { handler: Guest }
