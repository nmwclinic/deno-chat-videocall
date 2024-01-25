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

// const CHAT_SCHEMA = new Schema({
//   type: { type: String, enum: ['ROOM', 'PRIVATE'] },
//   roomDetail: {
//     id: { type: String },
//     owner: { type: Schema.Types.ObjectId, ref: 'Users' },
//     member: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
//   },
//   conversations: [
//     {
//       type: { type: String, enum: ['TEXT', 'IMAGE', 'FILE'], default: 'TEXT' },
//       sender: { type: Schema.Types.ObjectId, ref: 'Users' },
//       content: {
//         text: { type: String, default: '' },
//         image: {
//           type: {
//             url: { type: String },
//             alt: { type: String, default: null }
//           },
//           required: false
//         },
//         file: {
//           type: {
//             url: { type: String },
//             alt: { type: String, default: null }
//           },
//           required: false
//         }
//       },
//       readBy: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
//       receipent: { type: Schema.Types.ObjectId, ref: 'Users' },
//       createdAt: { type: Date },
//       updatedAt: { type: Date, default: new Date() }
//     }
//   ]
// }, {
//   timestamps: true
// })

// export interface ChatDocument extends Document, ChatModel { }
// const CHAT_MODEL = model<ChatDocument>('Chats', CHAT_SCHEMA)

// export default CHAT_MODEL
