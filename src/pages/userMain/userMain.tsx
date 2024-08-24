import { FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/typeHooks";
import { useUserInfo } from "../../hooks/useUserInfo";
import { io, Socket } from "socket.io-client";
import { IMessage } from "../../models/IMessage";
import { ITicket } from "../../models/ITicket";
import ChatWindow from "../../components/shared/ChatWindow/ChatWindow";
import Sidebar from "../../components/shared/Sidebar/Sidebar";
import { getMeUser } from "../../store/action_creators/actionCreators";
import CreateTicketModal from "../../components/shared/Modals/CreateTicketModal";
import { $authHost } from "../../http";

const UserMain: FC = () => {
  const userJwtInfo = useUserInfo();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.userReducer);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (userJwtInfo?.userInfo && !isLoading) {
      const newSocket = io(import.meta.env.VITE_API_SOCKET_URL, {
        query: {
          token: userJwtInfo.userToken,
          role: userJwtInfo.userInfo.role,
          userId: userJwtInfo.userInfo.id,
          login : user?.login
        },
      });

      if (!user) {
        dispatch(getMeUser(userJwtInfo.userInfo.id));
      }

      newSocket.on("connect", () => {
        newSocket.emit("request:tickets");
      });

      newSocket.on("ticket:all", (allTickets: ITicket[]) => {
        setTickets(allTickets);
      });

      newSocket.on("ticket:update", (updatedTicket: ITicket) => {
      
        if (updatedTicket.userId._id === userJwtInfo?.userInfo?.id) {
          setTickets((prevTickets) => {
            const ticketExists = prevTickets.some(ticket => ticket._id === updatedTicket._id);
      
            if (ticketExists) {
              const updatedTickets = prevTickets.map((ticket) =>
                ticket._id === updatedTicket._id ? updatedTicket : ticket
              );
              return updatedTickets;
            } else {
              const newTickets = [...prevTickets, updatedTicket];
              return newTickets;
            }
          });
      
          setSelectedTicket((prevSelectedTicket) =>
            prevSelectedTicket && prevSelectedTicket._id === updatedTicket._id
              ? updatedTicket
              : prevSelectedTicket
          );
        }
      });

      newSocket.on("message_list:update", (messages: IMessage[]) => { 
        setMessages((prevMessages) => [
          ...prevMessages,
          ...messages.filter(
            (msg) =>
              !prevMessages.some((existingMsg) => existingMsg._id === msg._id)
          ),
        ]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (socket && selectedTicketId) {
      setMessages([]);
  
      socket.emit("message:get", selectedTicketId);
  
      const handleMessageUpdate = (newMessages: IMessage[]) => {
        setMessages((prevMessages) => [
          ...prevMessages.filter(
            (msg) => msg.ticketId === selectedTicketId
          ),
          ...newMessages.filter(
            (msg) =>
              msg.ticketId === selectedTicketId &&
              !prevMessages.some((existingMsg) => existingMsg._id === msg._id)
          ),
        ]);
      };
  
      socket.on("message_list:update", handleMessageUpdate);
  
      return () => {
        socket.off("message_list:update", handleMessageUpdate);
      };
    }
  }, [selectedTicketId, socket]);

  const handleClickTicket = useCallback(
    (ticketId: string) => {
      setSelectedTicketId(ticketId);
      if (socket) {
        socket.emit("join_ticket", ticketId);
        const ticket = tickets.find((t) => t._id === ticketId);
        setSelectedTicket(ticket ?? null);
      }
    },
    [socket, tickets]
  );

  const handleSendMessage = (message: string) => {
    if (message.trim() && userJwtInfo.userInfo && selectedTicketId) {
      const messageObject = {
        textOrPathToFile: message,
        messageType: "text",
        ticketId: selectedTicketId,
        userId: userJwtInfo.userInfo?.id,
        senderType: userJwtInfo.userInfo?.role,
        login: user?.login || "",
      };
      socket?.emit("message:add", messageObject);
    }
  };

  const handleSendFileMessage = async (file: File) => {
    if (userJwtInfo.userInfo && selectedTicketId) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ticketId', selectedTicketId);
      formData.append('userId', userJwtInfo.userInfo?.id || '');
      formData.append('senderType', userJwtInfo.userInfo?.role || '');
      formData.append('login', user?.login || '');
  
      try {
        const response = await $authHost.post('/message/send', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error sending file:', error);
      }
    } else {
      console.error('User information or selected ticket ID is missing.');
    }
  };
  

  const handleMessageRead = useCallback((messageId: string) => {
    socket?.emit('message:read', messageId);
  }, [socket]);
  

  const handleCreateTicket = (data: { description: string }) => {
    socket?.emit("ticket:add", data);
  };

  const handleCloseTicket = (id: string) => {
    socket?.emit("ticket:close", id);
  };

  const handleExitTicket = () => {
    setSelectedTicketId(null);
    setSelectedTicket(null);
  };

  const handlePinTicket = (id: string) => {
    socket?.emit("ticket:pin", id);
  };

  const ticketIdForChatWindow = selectedTicketId ?? "";
  const loginForChatWindow = user?.login ?? "";

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex items-center gap-5 p-[30px] h-full font-inter">
          <Sidebar
            user={user}
            tickets={tickets}
            onClickTicket={handleClickTicket}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {selectedTicket && userJwtInfo.userInfo?.role ? (
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              onSendFileMessage={handleSendFileMessage}
              selectedTicketId={ticketIdForChatWindow}
              login={loginForChatWindow}
              onCloseTicket={handleCloseTicket}
              selectedTicket={selectedTicket}
              onPinTicket={handlePinTicket}
              onMessageRead={handleMessageRead}
              onExitTicket={handleExitTicket}
              role={userJwtInfo.userInfo?.role}
            />
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={() => setIsCreateTicketModalOpen(true)}
                className="bg-white px-5 py-3 rounded-3xl transition-all duration-500 hover:bg-slate-400"
              >
                Задать вопрос
              </button>
            </div>
          )}
        </div>
      )}
      {isCreateTicketModalOpen && (
        <CreateTicketModal
          onClose={() => setIsCreateTicketModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      )}
    </>
  );
};

export default UserMain;
