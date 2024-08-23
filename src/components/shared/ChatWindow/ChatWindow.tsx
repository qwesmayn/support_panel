import {
  Chrome,
  Earth,
  Flag,
  Lock,
  Pin,
} from "lucide-react";
import { FC } from "react";
import MessagesBlock from "./MessagesBlock/MessagesBlock";
import SendMessageBlock from "./SendMessageBlock/SendMessageBlock";
import { IMessage } from "../../../models/IMessage";
import { ITicket } from "../../../models/ITicket";
import classNames from "classnames";

interface ChatWindowProps {
  messages: IMessage[];
  onSendMessage: (message: string) => void;
  onSendFileMessage: (file: File) => void;
  onCloseTicket: (id: string) => void;
  onPinTicket: (id: string) => void;
  onMessageRead: (messageId: string) => void;
  selectedTicket?: ITicket;
  selectedTicketId: string;
  login: string;
  role : string;
}

const ChatWindow: FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  onSendFileMessage,
  onCloseTicket,
  onPinTicket,
  onMessageRead,
  selectedTicketId,
  selectedTicket,
  role
}) => {

  return (
    <div className="h-full text-white border border-[#1d1d1d] w-full rounded-2xl flex flex-col">
      {/* Chat Header */}
      <div className={classNames("border-b py-[15px] px-5 border-[#1d1d1d] flex items-center justify-between", role === "user" && "py-[36px]")}>
        { role === "admin" && <div className=" flex items-center gap-3">
          <div>
            <p>{selectedTicket?.userId.login}</p>
          </div>
          <div className="bg-[#1b1b1b] max-w-max p-2 rounded-2xl flex items-center gap-2">
            <Flag size={20} color="#6e6e6e" />
            <p className="text-[#6e6e6e]">{selectedTicket?.userId.country}</p>
          </div>
          <div className="bg-[#1b1b1b] max-w-max p-2 rounded-2xl flex items-center gap-2">
            <Earth size={20} color="#6e6e6e" />
            <p className="text-[#6e6e6e]">{selectedTicket?.userId.ip}</p>
          </div>
          <div className="bg-[#1b1b1b] max-w-max p-2 rounded-2xl flex items-center gap-2">
            <Chrome size={20} color="#6e6e6e" />
            <p className="text-[#6e6e6e]">{selectedTicket?.userId.chromeVersion}</p>
          </div>
        </div>
}
        { role === "admin" &&<div className="flex items-center gap-5">
          <div className="h-[20px]">
            <button onClick={() => onPinTicket(selectedTicketId)}>
              <Pin size={20} className="transform rotate-45" />
            </button>
          </div>
          <div>
            <button
            disabled = {selectedTicket?.status === "closed"}
              onClick={() => onCloseTicket(selectedTicketId)}
              className="flex items-center gap-4 py-2 px-5 border border-white rounded-full transition-all duration-500 hover:bg-white hover:text-[#1d1d1d]"
            >
              <p>Закрыть тикет</p>
              <Lock size={20} />
            </button>
          </div>
        </div>}
      </div>

      {/* Message Window */}
      <div className="p-5 border-b border-[#1d1d1d] flex-grow overflow-y-auto">
        <MessagesBlock messages={messages} onMessageRead={onMessageRead}/>
      </div>

      <div className="p-5 border-b border-[#1d1d1d]">
        <SendMessageBlock
          onSendMessage={onSendMessage}
          onSendFileMessage = {onSendFileMessage}
          isDisabled={selectedTicket?.status === "closed"}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
