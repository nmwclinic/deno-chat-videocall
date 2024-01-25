import { DateTime } from 'luxon'
import { type NewMessage } from '../../models/chat.ts'
import { history, type ResponseHistoryRoom } from './history-chat.interface.ts'
import HandleError from '../../utils/error.ts'
import RedisProvider from '../../configs/redis.ts'
import Env from '../../env.json' with { type: 'json' }
import axios from 'npm:axios'

const retrieveChat = async (room: string, token: string, user: string): Promise<ResponseHistoryRoom[]> => {
  let mapped_historys
  try {
    const historyRedis = await RedisProvider.getConnection().lrange(`chat-room:${room}`, 0, -1)
    if (historyRedis.length === 0) {
      const response = await axios.get(Env.APP_URL.PARENT_URL + Env.APP_URL.HISTORY + `?roomId=${room}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const history: history[] = response.data.result.conversations.map((object: history) => ({
        id: object.id,
        type: object.type,
        sender: object.sender,
        content: object.content,
        readBy: object.readBy,
        receipent: object.receipent,
        createdAt: object.createdAt,
      }))

      history.forEach((object) => {
        if (!object.readBy.includes(user)) {
          object.readBy.push(user)
        }
      })
      if (history === null || history === undefined) throw new Error('Cant find Conversations')
      mapped_historys = history

      const save_redis = mapped_historys.map((object) => {
        return JSON.stringify(object)
      })

      if (save_redis.length > 0) await RedisProvider.getConnection().lpush(`chat-room:${room}`, ...save_redis)
    } else {
      mapped_historys = historyRedis.map((object) => JSON.parse(object))
        .sort((a, b) =>
          DateTime.fromISO(a.createdAt as string).toMillis() - DateTime.fromISO(b.createdAt as string).toMillis()
        )
    }

    return mapped_historys
  } catch (error) {
    throw HandleError.message(error)
  }
}

const saveMessage = async (prop: NewMessage[], room: string, token: string): Promise<void> => {
  try {
    const _response = await axios.put(
      Env.APP_URL.PARENT_URL + Env.APP_URL.BACKUP + `/${room}`,
      {
        conversations: prop.map((object) => {
          return {
            type: object.type,
            sender: object.sender.id,
            content: object.content,
            readBy: object.readBy,
            receipent: object.receipent,
            createdAt: object.createdAt,
          }
        }),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return
  } catch (error) {
    throw HandleError.message(error)
  }
}

const readMessage = async (prop: NewMessage[], user: string, room: string, token: string): Promise<void> => {
  try {
    const _response = await axios.put(
      Env.APP_URL.PARENT_URL + Env.APP_URL.READ_MSG + `/${room}`,
      {
        conversations: prop,
        user: user,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return
  } catch (error) {
    throw HandleError.message(error)
  }
}

const History = { retrieveChat: retrieveChat, saveMessage: saveMessage, readMessage: readMessage }
export default History
