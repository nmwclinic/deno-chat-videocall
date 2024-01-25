import _ from 'socket.io'
import { TypeMessage } from '../../models/chat.ts'

interface UserDetail {
  id: string
  fullName: string
  marketplace: {
    id: string
    name: string
  }
}

export interface UserInfo extends UserDetail {
  room: string
}

export interface ConnectedUsers {
  id: string
  room: string
}

export interface DetailUserChat {
  type: string
  room: string
  userDetail: {
    id: string
    name: string
    image: string
  }
  conversation: {
    message: string
    createdAt: string
  }
}

export interface Message {
  type: TypeMessage
  content: {
    text: string
    image: {
      url: string
      alt: string
    }
    file: {
      url: string
      alt: string
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    room?: string
    userInfo?: UserInfo
  }
}
