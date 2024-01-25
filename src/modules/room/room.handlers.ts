import { Types } from 'npm:mongoose'
import { DateTime } from 'luxon'
import { type Server, type Socket } from 'socket.io'
import History from '../history-chat/history-chat.services.ts'
import HandleError from '../../utils/error.ts'
import { redisConnection } from '../../configs/redis.ts'
import { type Message } from '../socket/socket.interface.ts'
import Connected from '../connected/connected.handlers.ts'

const handler = (io: Server, socket: Socket): void => {
  const memberChat = io.of('/chat')
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
      console.log(getUserInRoom)
      const userInRoom: Types.ObjectId[] = []
      for (const user of [...getUserInRoom.values()]) {
        const infoUser = memberChat.sockets.get(user)

        if (infoUser?.userInfo !== undefined) {
          userInRoom.push(new Types.ObjectId(infoUser.userInfo.id))
        }
      }

      let content
      switch (event.type) {
        case 'TEXT':
          content = {
            text: event.content.text,
            url: null,
            alt: null,
            ext: null,
          }
          break
        case 'IMAGE':
          content = {
            text: event.content.text,
            url: event.content.image.url,
            alt: event.content.image.alt,
            ext: null,
          }
          break
        case 'FILE':
          content = {
            text: event.content.text,
            url: event.content.image.url,
            alt: event.content.image.alt,
            ext: null,
          }
          break
        default:
          content = {
            text: event.content.text,
            url: null,
            alt: null,
            ext: null,
          }
          break
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
      await redisConnection.lpush(`chat-room:${socket.room}`, JSON.stringify(newMessage))

      memberChat.emit('connected_users', await Connected.setConnectedUsers(socket))
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  })
}

const Guest = (io: Server, socket: Socket): void => {
  const guestChat = io.of('/guest')
  socket.on('join_room', async (room: string) => {
    try {
      if (socket.room !== undefined) await socket.leave(socket.room)

      await socket.join(room)
      socket.room = room

      // Retrieve chat history for the current room
      const user: string = socket.userInfo?.id ?? ''
      const history = await History.retrieveChat(room, socket.handshake.auth.token, user)
      // Should this change socket.room to socket.id
      guestChat.to(socket.room).emit('history_message_room', history)
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

      const getUserInRoom = io.sockets.adapter.rooms.get(socket.room)
      if (getUserInRoom === undefined) throw new Error('Cannot get user in room')

      const userInRoom: Types.ObjectId[] = []
      for (const user of [...getUserInRoom.values()]) {
        const infoUser = io.sockets.sockets.get(user)

        if (infoUser?.userInfo !== undefined) {
          userInRoom.push(new Types.ObjectId(infoUser.userInfo.id))
        }
      }

      let content
      switch (event.type) {
        case 'TEXT':
          content = {
            text: event.content.text,
            url: null,
            alt: null,
            ext: null,
          }
          break
        case 'IMAGE':
          content = {
            text: event.content.text,
            url: event.content.image.url,
            alt: event.content.image.alt,
            ext: null,
          }
          break
        case 'FILE':
          content = {
            text: event.content.text,
            url: event.content.image.url,
            alt: event.content.image.alt,
            ext: null,
          }
          break
        default:
          content = {
            text: event.content.text,
            url: null,
            alt: null,
            ext: null,
          }
          break
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
      await redisConnection.lpush(`chat-room:${socket.room}`, JSON.stringify(newMessage))

      guestChat.emit('connected_users', await Connected.setConnectedUsers(socket))
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  })
}

export const Room = { handler: handler }
export const GuestRoom = { handler: Guest }
