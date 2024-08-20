  import { FC, useCallback, useEffect, useState } from "react";
  import Sidebar from "../../components/shared/Sidebar/Sidebar";
  import ChatWindow from "../../components/shared/ChatWindow/ChatWindow";
  import { useAppDispatch, useAppSelector } from "../../hooks/typeHooks";
  import { useUserInfo } from "../../hooks/useUserInfo";
  import { io, Socket } from "socket.io-client";
  import { IMessage } from "../../models/IMessage";
  import { ITicket } from "../../models/ITicket";
  import { getMeAdmin } from "../../store/action_creators/actionCreators";
  import { nanoid } from "nanoid";

  const Main: FC = () => {
    const userJwtInfo = useUserInfo();
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAppSelector((state) => state.userReducer);
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
      if (userJwtInfo?.userInfo && !isLoading) {

        const newSocket = io(import.meta.env.VITE_API_SOCKET_URL, {
          query: { token: userJwtInfo.userToken },
        });

        if(!user) {
          dispatch(getMeAdmin(userJwtInfo.userInfo.id));
        }

        newSocket.on("connect", () => {
          console.log("Socket connected");
          newSocket.emit("request:tickets");
        });

        newSocket.on("ticket:all", (allTickets: ITicket[]) => {
          setTickets(allTickets);
        });

        newSocket.on("ticket:update", (updatedTicket: ITicket) => {

          setTickets((prevTickets) => {
            const updatedTickets = prevTickets.map((ticket) =>
              ticket._id === updatedTicket._id ? updatedTicket : ticket
            );
            return [...updatedTickets];
          });
          setSelectedTicket((prevSelectedTicket) =>
            prevSelectedTicket && prevSelectedTicket._id === updatedTicket._id
              ? updatedTicket
              : prevSelectedTicket
          );
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
          console.log("Socket disconnected");
        };
      }
    }, []);

    useEffect(() => {
      if (socket && selectedTicketId) {
        socket.emit("message:get", selectedTicketId);

        const handleMessageUpdate = (newMessages: IMessage[]) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            ...newMessages.filter(
              (msg) =>
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
          messageId: nanoid(),
          messageType: "text",
          ticketId: selectedTicketId,
          userId: userJwtInfo.userInfo?.id,
          senderType: userJwtInfo.userInfo?.role,
          login: user?.login || "",
        };
        socket?.emit("message:add", messageObject);
      }
    };

    const handleSendFileMessage = (file: File) => {
      if (userJwtInfo.userInfo && selectedTicketId) {
        const reader = new FileReader();
  
        reader.onload = () => {
          const fileArrayBuffer = reader.result as ArrayBuffer;
          socket?.emit("message:file", {
            fileData: Array.from(new Uint8Array(fileArrayBuffer)),
            fileName: file.name,
            fileType: file.type,
            messageId: nanoid(),
            ticketId: selectedTicketId,
            userId: userJwtInfo.userInfo?.id,
            senderType: userJwtInfo.userInfo?.role,
            login: user?.login || "",
          });
        };
  
        reader.readAsArrayBuffer(file);
      }
    };  

    const handleCloseTicket = (id: string) => {
      socket?.emit("ticket:close", id);
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
              role={userJwtInfo.userInfo?.role}
            />
            {selectedTicket && (
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                onSendFileMessage={handleSendFileMessage}
                selectedTicketId={ticketIdForChatWindow}
                login={loginForChatWindow}
                onCloseTicket={handleCloseTicket}
                selectedTicket={selectedTicket}
                onPinTicket={handlePinTicket}
                role={userJwtInfo.userInfo?.role}
              />
            )}
          </div>
        )}
      </>
    );
  };

  export default Main;
