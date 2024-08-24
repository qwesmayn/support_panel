import classNames from "classnames";
import { Lock, Pin } from "lucide-react";
import { FC } from "react";
import { ITicket } from "../../../models/ITicket";
import { format } from "date-fns";
import { useUserInfo } from "../../../hooks/useUserInfo";

interface ChatRowProps {
  ticket: ITicket;
  onClickTicket: (ticketId: string) => void;
}

const ChatRow: FC<ChatRowProps> = ({ ticket, onClickTicket }) => {
  const userJwtInfo = useUserInfo();
  const userId = userJwtInfo.userInfo?.id;

  const lastMessage = ticket.messages.length > 0 ? ticket.messages[ticket.messages.length - 1] : null;
  

  const lastMessageTime = lastMessage
    ? (() => {
        const date = new Date(lastMessage.createdAt);
        return isNaN(date.getTime()) ? "Invalid date" : format(date, "HH:mm");
      })()
    : "";

  const isAdmin = userJwtInfo.userInfo?.role === "admin";
  const isTicketOwner = ticket.userId._id === userId;

  const hasUnreadMessages =
    isAdmin && !isTicketOwner
      ? ticket.unreadMessagesUserCount > 0
      : !isAdmin && isTicketOwner
      ? ticket.unreadMessagesAdminCount > 0
      : false;

  return (
    <div
      onClick={() => onClickTicket(ticket._id)}
      className={classNames("px-3", ticket.isPinned && !isTicketOwner && "bg-[#1b1b1b]")}
    >
      <div
        className={classNames(
          "flex flex-col p-4 cursor-pointer gap-2 transition-all duration-500 hover:bg-[#1b1b1b] rounded-2xl",
          hasUnreadMessages && ticket.status !== "closed" && "bg-[#1b1b1b]"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p>{ticket.userId.login}</p>
            {ticket.isPinned && !isTicketOwner && <Pin size={18} className="transform rotate-45" />}
          </div>
          <div>
            <p className="text-[#6e6e6e]">{lastMessageTime}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#6e6e6e]">{lastMessage?.messageType === "text" ? lastMessage.textOrPathToFile ? lastMessage.textOrPathToFile : "No messages yet" : "[Image]"}</p>
          </div>
          {hasUnreadMessages && ticket.status !== "closed" && (
            <div className="min-w-2 min-h-2 bg-white rounded-full text-black text-xs"></div>
          )}
          {ticket.status === "closed" && <Lock size={18} />}
        </div>
      </div>
    </div>
  );
};

export default ChatRow;
