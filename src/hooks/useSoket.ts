import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { IMessage } from "../models/IMessage";
import { ITicket } from "../models/ITicket";
import { useAppDispatch } from "./typeHooks";
import { getMeAdmin, getMeUser } from "../store/action_creators/actionCreators";

interface UseSocketProps {
  userJwtInfo: any;
  user: any;
  onTicketsUpdate: (tickets: ITicket[]) => void;
  onTicketUpdate: (ticket: ITicket) => void;
  onMessagesUpdate: (messages: IMessage[]) => void;
  onMessageUpdate: (newMessages: IMessage[]) => void;
}

export const useSocket = ({
  userJwtInfo,
  user,
  onTicketsUpdate,
  onTicketUpdate,
  onMessagesUpdate,
  onMessageUpdate,
}: UseSocketProps) => {
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (userJwtInfo?.userInfo) {
      if (!user) {
        if (userJwtInfo.userInfo.role === "admin") {
          dispatch(getMeAdmin(userJwtInfo.userInfo.id));
        } else {
          dispatch(getMeUser(userJwtInfo.userInfo.id));
        }
      }
    }
  }, [dispatch, user, getMeAdmin, getMeUser]);

  useEffect(() => {
    if (userJwtInfo?.userInfo) {
      const newSocket = io(import.meta.env.VITE_API_SOCKET_URL, {
        query: {
          token: userJwtInfo.userToken,
          role: userJwtInfo.userInfo.role,
          userId: userJwtInfo.userInfo.id,
          login: user?.login,
        },
      });

      newSocket.on("connect", () => {
        newSocket.emit("request:tickets");
        console.log('Socket connected');
      });

      newSocket.on("ticket:all", onTicketsUpdate);
      newSocket.on("ticket:update", onTicketUpdate);
      newSocket.on("message_list:update", onMessagesUpdate);

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [user, onTicketsUpdate, onTicketUpdate, onMessagesUpdate]);

  useEffect(() => {
    if (socket) {
      const handleMessageUpdate = (newMessages: IMessage[]) => {
        onMessageUpdate(newMessages);
      };

      socket.on("message_list:update", handleMessageUpdate);

      return () => {
        socket.off("message_list:update", handleMessageUpdate);
      };
    }
  }, [socket, onMessageUpdate]);

  return socket;
};
