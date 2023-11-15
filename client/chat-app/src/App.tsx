import { SetStateAction, useState } from "react";
import { io, Socket } from "socket.io-client";
import Chat from "./components/Chat";
import SendMsgBubble from "./components/SendMsgBubble";

const socket: Socket = io("http://localhost:3007/");
socket.on("connect", () => {
  console.log("Connected to the server");
});

function App() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [showChatRoom, setShowChatRoom] = useState(false);

  const handleNameChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setName(e.target.value);
  };

  const handleRoomChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setRoom(e.target.value);
  };

  const joinRoom = () => {
    if (name !== "" && room !== "") {
      console.log(`Attemping to join ${room}...`);
      socket.emit("join", room);
      setShowChatRoom(true);
    }
  };

  return (
    <main className="flex justify-center items-center flex-col gap-4">
      {showChatRoom ? (
        <Chat socket={socket} userName={name} roomName={room} />
      ) : (
        <div className="flex justify-center items-center flex-col gap-3 pt-3">
          <p className="text-3xl text-primary font-bold tracking-wider">
            Join a room
          </p>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered  max-w-xs input-primary"
            value={name}
            onChange={handleNameChange}
          />
          <input
            type="text"
            placeholder="Room"
            className="input input-bordered  max-w-xs input-primary"
            value={room}
            onChange={handleRoomChange}
          />
          <button
            onClick={joinRoom}
            className="btn btn-primary w-full"
            disabled={room === "" || name === ""}
          >
            Join Room
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
