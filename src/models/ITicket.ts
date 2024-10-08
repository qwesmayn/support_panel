import { IAdminUser } from "./IAdminUser"
import { IMessage } from "./IMessage"
import { IUser } from "./IUser"

export interface ITicket {
    _id: string
    ticketId: string
    title: string
    status: string
    isPinned: boolean
    unreadMessagesUserCount: number
    unreadMessagesAdminCount: number
    userId: IUser
    assignedAdminId: IAdminUser | null
    messages: IMessage[]
  }