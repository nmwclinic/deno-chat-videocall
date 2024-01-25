import { type Server, type Socket } from 'socket.io'
import { redisConnection } from '../../configs/redis.ts'
import { type ConnectedUsers, type DetailUserChat } from '../socket/socket.interface.ts'
import HandleError from '../../utils/error.ts'
import axiod from 'https://deno.land/x/axiod@0.26.2/mod.ts'
import Env from '../../env.json' with { type: 'json' }
import axios from 'npm:axios'

// ?? Should have new key in redis for storing list patient on dashboard?
// TODO firstime connected user get from mongo
// TODO insert on redis after that, get redis cek new user conneted if not exists get from mongo insert to redis
// TODO everytime user send message manipulate data in redis
const validationParse = (value: string): boolean => {
  try {
    JSON.parse(value)
    return true
    // deno-lint-ignore no-unused-vars
  } catch (error) {
    return false
  }
}

const setConnectedUsers = async (socket: Socket): Promise<DetailUserChat[]> => {
  try {
    if (typeof socket.userInfo !== 'object') throw new Error('Cannot get user info')

    const connected_users_room: ConnectedUsers[] = []
    const connected_users = await redisConnection.hgetall('connected_users')
    for (const cu in connected_users) {
      const exists = connected_users[cu]
      if (exists !== undefined) {
        if (validationParse(exists)) {
          const parse_connected: ConnectedUsers = JSON.parse(exists)
          connected_users_room.push(parse_connected)
        }
      }
    }
    console.log(connected_users_room)
    const response = await axios.get(Env.APP_URL.PARENT_URL + Env.APP_URL.LIST_USER, {
      headers: {
        Authorization: 'Bearer ' + socket.handshake.auth.token,
      },
    })
    let users: DetailUserChat[] = response.data.result.map((object: DetailUserChat) => {
      return {
        type: object.type,
        room: object.room,
        userDetail: {
          id: object.userDetail.id,
          name: object.userDetail.name,
          image: object.userDetail.image,
        },
        conversation: object.conversation
          ? {
            message: object.conversation.message,
            createdAt: object.conversation.createdAt,
          }
          : null,
      }
    })
    //!! problem disini
    users = users.filter((object) => object.userDetail.id !== undefined)
    const mapped_connected = users.map(async (object) => {
      const connected = connected_users_room.find((element) =>
        element.id.toString() === object.userDetail.id.toString()
      )

      object.userDetail.image = object.userDetail.image === null
        ? Env.APP_URL.PARENT_URL + '/img/profile.png'
        : Env.APP_URL.PARENT_URL + object.userDetail.image

      if (connected !== undefined) {
        let last_chat: string[] | string | undefined = await redisConnection.lrange(`chat-room:${connected.room}`, 0, 1)
        if (last_chat === undefined) { /* empty */ }

        last_chat = last_chat[0]
        if (last_chat !== undefined) {
          object.conversation.message = JSON.parse(last_chat).message
          object.conversation.createdAt = JSON.parse(last_chat).createdAt
        }
      }

      return {
        type: object.type,
        room: object.room,
        online: connected !== undefined,
        userDetail: object.userDetail,
        conversation: object.conversation,
      }
    })
    // const guest = users.filter((object)=> object.type === 'GUEST').map(async(object)=> {
    //   const connected = connected_users_room.find((element)=> )
    // })

    return await Promise.all(mapped_connected)
  } catch (error: unknown) {
    throw HandleError.message(error)
  }
}

const listUsers = async (io: Server, socket: Socket): Promise<void> => {
  const memberChat = io.of('/chat')
  const guestChat = io.of('/guest')
  try {
    if (typeof socket.userInfo !== 'object') throw new Error('Cannot get user info')

    // This should be change room
    const info_user: ConnectedUsers = {
      id: socket.userInfo.id,
      room: socket.userInfo.room,
    }
    await redisConnection.hset('connected_users', socket.userInfo.id, JSON.stringify(info_user))
    const connected_users = await setConnectedUsers(socket)
    memberChat.emit('connected_users', connected_users)
    guestChat.emit('connected_users', connected_users)
  } catch (error: unknown) {
    HandleError.emitClient(socket, error)
  }
}

const handler = (io: Server, socket: Socket): void => {
  void listUsers(io, socket)
  // Filterring name user or message
  const memberChat = io.of('/chat')
  const guestChat = io.of('/guest')
  memberChat.on('connected_users', async (filter): Promise<void> => {
    try {
      if (typeof filter !== 'string') throw new Error('Filter must be string')

      const responses = await axiod.get(Env.APP_URL.PARENT_URL + Env.APP_URL.LIST_USER, {
        headers: {
          Authorization: `Bearer ${socket.handshake.auth.token}`,
        },
      })
      const response: DetailUserChat[] = responses.data.result.map((object: DetailUserChat) => ({
        room: object.room,
        userDetail: object.userDetail,
        conversation: object.conversation,
      }))
      if (response.length > 0) {
        for (let index = 0; index < response.length; index++) {
          const chat_exists = response[index]

          if (chat_exists !== undefined) {
            chat_exists.userDetail.image = chat_exists.userDetail.image === null
              ? Env.APP_URL.PARENT_URL + '/img/profile.png'
              : Env.APP_URL.PARENT_URL + chat_exists.userDetail.image
          }
        }
      }
      memberChat.to(socket.id).emit('connected_users', response)
      guestChat.to(socket.id).emit('connected_users', response)
    } catch (error: unknown) {
      HandleError.emitClient(socket, error)
    }
  })
}
const Connected = { setConnectedUsers: setConnectedUsers, handler: handler }
export default Connected
