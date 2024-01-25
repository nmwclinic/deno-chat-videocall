export interface AggregateHistoryChat {
  room: string
  createdAt: Date | string
}

export interface ResponseHistoryRoom {
  room: string
  createdAt: string | null
}

export interface history {
  id: string
  type: string
  sender: string
  content: string
  readBy: string[]
  receipent: string
  createdAt: string
}
