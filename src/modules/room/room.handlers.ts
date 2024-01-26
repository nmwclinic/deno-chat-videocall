import { Types } from 'npm:mongoose'
import { DateTime } from 'luxon'
import { type Server, type Socket } from 'socket.io'
import History from '../history-chat/history-chat.services.ts'
import HandleError from '../../utils/error.ts'
import RedisProvider from '../../configs/redis.ts'
import { type Message } from '../socket/socket.interface.ts'
import Connected from '../connected/connected.handlers.ts'
import ENV from '../../env.json' with { type: 'json' }

const handler = (io: Server, socket: Socket): void => {
  const memberChat = io.of(ENV.SOCKET_PATH.MEMBER)
  socket.on('join_room', async (room: string) => {
    try {
      if (socket.room !== undefined) await socket.leave(socket.room)

      await socket.join(room)
      socket.room = room

      // Retrieve chat history for the current room
      const user: string = socket.userInfo?.id ?? ''
      const history = await History.retrieveChat(room, socket.handshake.auth.token, user)
      // Should this change socket.room to socket.id
      memberChat.to(socket.room).emit('history_message_room', history)
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  })

  socket.on('send_message_room', async (event: Message) => {
    try {
      // Check if socket.room is undefined or null
      if (typeof socket.userInfo !== 'object') throw new Error('Cannot found sender id')
      if (socket.room === undefined || socket.room === null) {
        throw new Error('Cannot send message cause room not defined')
      }

      const getUserInRoom = memberChat.adapter.rooms.get(socket.room)
      if (getUserInRoom === undefined) throw new Error('Cannot get user in room')
      const userInRoom: Types.ObjectId[] & string[] = []
      for (const user of [...getUserInRoom.values()]) {
        const infoUser = memberChat.sockets.get(user)

        if (infoUser?.userInfo !== undefined) {
          userInRoom.push(new Types.ObjectId(infoUser.userInfo.id))
        }
      }

      const content = {
        text: event.content.text ?? null,
        url: event.content.url ?? null,
        alt: event.content.alt ?? null,
        ext: event.content.ext ?? null,
      }

      const newMessage = {
        type: event.type,
        sender: {
          id: socket.userInfo.id,
          fullName: socket.userInfo.fullName,
        },
        content: content,
        readBy: userInRoom,
        receipent: null,
        createdAt: DateTime.local().toJSDate(),
      }

      // Broadcast the message to all clients in the room include sender
      memberChat.to(socket.room).emit('send_message_room', {
        type: newMessage.type,
        sender: newMessage.sender,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
      })

      // Save the chat message to the history for the current room
      await RedisProvider.getConnection().lpush(`chat-room:${socket.room}`, JSON.stringify(newMessage))

      memberChat.emit('connected_users', await Connected.setConnectedUsers(socket))
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  })
}

const moveUser = (io: Server, socket: Socket): void => {
  const memberChat = io.of(ENV.SOCKET_PATH.MEMBER)
  memberChat.on('moveUser', (room) => {
    socket.on('moveUserToRoom', (data: { userId: string; newRoom: string }) => {
      const { userId, newRoom } = data
      const userSocket = io.sockets.sockets.get(userId)

      if (userSocket) {
        userSocket.leave(room)
      }
      memberChat.in(userId).socketsJoin(newRoom)
    })
  })
}

const Guest = (io: Server, socket: Socket): void => {
  const guestChat = io.of('/guest')
  socket.on('join_room', async (room: string) => {
    try {
      if (socket.room !== undefined) await socket.leave(socket.room)

      await socket.join(room)
      socket.room = room
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  })

  socket.on('send_message_room', async (event: Message) => {
    try {
      // Check if socket.room is undefined or null
      if (typeof socket.userInfo !== 'object') throw new Error('Cannot found sender id')
      if (socket.room === undefined || socket.room === null) {
        throw new Error('Cannot send message cause room not defined')
      }

      const getUserInRoom = guestChat.adapter.rooms.get(socket.room)
      if (getUserInRoom === undefined) throw new Error('Cannot get user in room')

      const userInRoom: Types.ObjectId[] & string[] = []
      for (const user of [...getUserInRoom.values()]) {
        const infoUser = guestChat.sockets.get(user)

        if (infoUser?.userInfo !== undefined) {
          userInRoom.push(infoUser.userInfo.id)
        }
      }

      const content = {
        text: event.content.text ?? null,
        url: event.content.url ?? null,
        alt: event.content.alt ?? null,
        ext: event.content.ext ?? null,
      }

      const newMessage = {
        type: event.type,
        sender: {
          id: socket.userInfo.id,
          fullName: socket.userInfo.fullName,
        },
        content: content,
        readBy: userInRoom,
        receipent: null,
        createdAt: DateTime.local().toJSDate(),
      }

      // Broadcast the message to all clients in the room include sender
      guestChat.to(socket.room).emit('send_message_room', {
        type: newMessage.type,
        sender: newMessage.sender,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
      })

      // Save the chat message to the history for the current room
      await RedisProvider.getConnection().lpush(`chat-room:${socket.room}`, JSON.stringify(newMessage))

      guestChat.emit('connected_users', await Connected.setConnectedUsers(socket))
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  })
}

export const Room = { handler: handler }
export const GuestRoom = { handler: Guest }
export const moveUserToRoom = { handler: moveUser }
