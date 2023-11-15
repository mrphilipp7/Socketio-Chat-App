import {
  SetStateAction,
  useEffect,
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { Socket } from "socket.io-client";
import SendMsgBubble from "./SendMsgBubble";
import ReceiveMsgBubble from "./ReceiveMsgBubble";
import useStayScrolled from "react-stay-scrolled";

type ChatProps = {
  socket: Socket;
  userName: string;
  roomName: string;
};

export type MessageInfo = {
  room: string;
  author: string;
  message: string;
  time: Date;
};

function Chat({ socket, userName, roomName }: ChatProps) {
  const [currentMsg, setCurrentMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [msgList, setMsgList] = useState<MessageInfo[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { stayScrolled /*, scrollBottom*/ } = useStayScrolled(messagesEndRef);

  const handleCurrentMsgChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setCurrentMsg(e.target.value);
  };

  const handleSendMsg = async () => {
    if (currentMsg !== "") {
      const msgData = {
        room: roomName,
        author: userName,
        message: currentMsg,
        time: new Date(),
      };
      console.log("sending msg...");
      await socket.emit("send_message", msgData);
      setMsgList((list) => [...list, msgData]);
      setCurrentMsg("");
      // Set focus on the input after sending the message
      inputRef.current?.focus();
    }
  };

  const handleReceiveMessage = (data: MessageInfo) => {
    setMsgList((list) => [...list, data]);
  };

  const memoizedHandleReceiveMessage = useMemo(() => handleReceiveMessage, []);

  useLayoutEffect(() => {
    stayScrolled();
  }, [msgList.length]);

  useEffect(() => {
    socket.on("receive_message", memoizedHandleReceiveMessage);

    //Unsubscribe when the component unmounts
    return () => {
      socket.off("receive_message", memoizedHandleReceiveMessage);
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-screen w-[400px] overflow-x-hidden">
      <div className="flex justify-center bg-gray-200 ">
        <p className="text-primary text-xl font-semibold">{roomName}</p>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-200 " ref={messagesEndRef}>
        {msgList.map((message) =>
          userName === message.author ? (
            <SendMsgBubble
              author={message.author}
              time={message.time}
              message={message.message}
            />
          ) : (
            <ReceiveMsgBubble
              author={message.author}
              time={message.time}
              message={message.message}
            />
          )
        )}
      </div>
      <footer className="flex justify-center gap-2 bg-gray-200 p-1 relative">
        <input
          type="text"
          placeholder="Message..."
          className="w-full outline-none p-4 rounded-full pr-12"
          onChange={handleCurrentMsgChange}
          onKeyDown={(event) => {
            event.key === "Enter" && handleSendMsg();
          }}
          value={currentMsg}
          ref={inputRef}
        />
        <button
          // className="btn btn-square btn-neutral"
          className="absolute right-4 top-1/2 transform  -translate-y-1/2"
          disabled={currentMsg === ""}
          onClick={handleSendMsg}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`w-7 h-7  ${
              currentMsg === ""
                ? "invisible"
                : "  bg-primary p-1 rounded-full text-white"
            }`}
          >
            <path
              fill-rule="evenodd"
              d="M12 20.25a.75.75 0 01-.75-.75V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l6.75 6.75a.75.75 0 11-1.06 1.06l-5.47-5.47V19.5a.75.75 0 01-.75.75z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </footer>
    </div>
  );
}

export default Chat;
