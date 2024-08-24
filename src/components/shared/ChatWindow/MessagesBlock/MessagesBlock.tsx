import { FC, useEffect, useRef, useState } from "react";
import { IMessage } from "../../../../models/IMessage";
import { useUserInfo } from "../../../../hooks/useUserInfo";
import ImageModal from "../../Modals/ImageModal";

interface MessagesBlockProps {
  messages: IMessage[];
  onMessageRead: (messageId: string) => void;
}

const MessagesBlock: FC<MessagesBlockProps> = ({ messages, onMessageRead }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const userJwtInfo = useUserInfo();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });

    messages.forEach((message) => {
      const isFromOtherSender = message.senderType !== userJwtInfo.userInfo?.role;
      if (isFromOtherSender && !message.isRead) {
        onMessageRead(message._id);
      }
    });
  }, [messages, userJwtInfo.userInfo?.role, onMessageRead]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage("");
  };

  return (
    <div>
      {messages.map((message) => {
        const isFromOtherSender =
          message.senderType !== userJwtInfo.userInfo?.role;

        return (
          <div
            key={message._id}
            className={`flex justify-${isFromOtherSender ? "start" : "end"} mb-4`}
          >
            <div
              className={`inline-block max-w-[50%] opacity-90 p-5 ${
                isFromOtherSender ? "border border-[#6e6e6e]" : "bg-[#1b1b1b]"
              } rounded-3xl`}
            >
              {message.messageType === "text" ? (
                <span className="break-words">{message.textOrPathToFile}</span>
              ) : (
                <img
                  src={`${import.meta.env.VITE_API_SOCKET_URL}${message.textOrPathToFile}`}
                  className="max-w-80 cursor-pointer"
                  onClick={() => handleImageClick(`${import.meta.env.VITE_API_SOCKET_URL}${message.textOrPathToFile}`)}
                  alt="Message attachment"
                />
              )}
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
        );
      })}
      <div ref={endOfMessagesRef} />
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MessagesBlock;
