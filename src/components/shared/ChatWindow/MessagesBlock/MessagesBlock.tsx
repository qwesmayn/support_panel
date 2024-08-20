import { FC, useEffect, useRef } from "react";
import { IMessage } from "../../../../models/IMessage";
import { useUserInfo } from "../../../../hooks/useUserInfo";

interface MessagesBlockProps {
  messages: IMessage[];
}

const MessagesBlock: FC<MessagesBlockProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const userJwtInfo = useUserInfo();

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex justify-${
            message.senderType === userJwtInfo.userInfo?.role ? "end" : "start"
          } mb-4`}
        >
          <div
            className={`inline-block max-w-[50%] opacity-90 p-5 ${
              message.senderType != userJwtInfo.userInfo?.role
                ? "border border-[#6e6e6e]"
                : "bg-[#1b1b1b]"
            } rounded-3xl`}
          >
            <span className="break-words">{message.textOrPathToFile}</span>
            <div className="flex justify-end text-[#6e6e6e]">
              <span className="text-sm">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessagesBlock;
