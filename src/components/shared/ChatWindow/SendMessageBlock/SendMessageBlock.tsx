import { ArrowBigRight, Paperclip } from "lucide-react";
import { FC, useState, useRef } from "react";

interface SendMessageBlockProps {
  onSendMessage: (message: string) => void;
  onSendFileMessage: (file: File) => void;
  isDisabled: boolean;
}

const SendMessageBlock: FC<SendMessageBlockProps> = ({
  onSendMessage,
  onSendFileMessage,
  isDisabled,
}) => {
  const [message, setMessage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    if (message.trim() || selectedFile) {
      if (selectedFile) {
        onSendFileMessage(selectedFile);
      } else {
        onSendMessage(message);
      }
      setMessage('');
      setImagePreview(null);
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4">
      {imagePreview && (
        <div className="flex items-center gap-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-contain rounded"
          />
          <button
            onClick={() => {
              setImagePreview(null);
              setSelectedFile(null);
            }}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      )}
      <div className="flex items-center gap-4">
        <div>
          <button onClick={handlePaperclipClick}>
            <Paperclip size={26} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <div className="w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            className="w-full px-5 py-2 text-gray-400 bg-[#1b1b1b] rounded-full text-lg"
            disabled={isDisabled}
          />
        </div>
        <div>
          <button
            className="p-2 bg-white rounded-full"
            onClick={handleSend}
            disabled={isDisabled}
          >
            <ArrowBigRight size={26} color="black" fill="black" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageBlock;
