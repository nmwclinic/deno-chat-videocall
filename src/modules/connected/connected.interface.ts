export interface UserConnected {
    room: string
    userDetail: {
        id: string
        name: string
        image: string
    },
    conversation: {
        message: string
        createdAt: string
    }
}