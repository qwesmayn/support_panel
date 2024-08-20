export interface IMessage {
    _id: string
    messageId: string
    messageType: string
    textOrPathToFile: string
    ticketId: string
    userId: string
    senderType: string
    login: string
    isRead: boolean
    createdAt : Date
  }