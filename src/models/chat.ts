import { type Types } from 'npm:mongoose'

export type TypeChat = 'ROOM' | 'PRIVATE'
export type TypeMessage = 'TEXT' | 'IMAGE' | 'FILE'

export interface NewMessage {
  type: TypeMessage
  sender: Types.ObjectId
  content: {
    text: string
    url: string
    alt: string | null
    ext: string
  }
  readBy: Types.ObjectId[] & string[]
  receipent: Types.ObjectId | null
  createdAt: string
}
export interface ReadMessage {
  userId: string
  messageId: string
}

interface ChatModel {
  type: TypeChat
  roomDetail: {
    id: string
    owner: Types.ObjectId
    member: Types.ObjectId[]
  }
  conversations: Array<{
    type: TypeMessage
    sender: Types.ObjectId
    content: {
      text: string
      image: {
        url: string
        alt: string | null
      } | null
      file: {
        url: string
        alt: string | null
      } | null
    }
    readBy: Types.ObjectId[]
    receipent: Types.ObjectId
  }>
  createdAt: Date
  updatedAt: Date
}