import { useNavigate } from "react-router-dom";
import ChatInputBox from "../../../components/ChatInputBox";
import ChatMessage from "../../../components/ChatMessage";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function ChatBoxV({
  entries,
  value,
  handleChange,
  users,
  roomId,
  dispatch,
  getSender,
  handleTrigger,
  eventServiceId,
}) {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const sendMessage = (message) => {
    socket.emit("payloadFromUser", roomId, {
      senderId: users.me.id,
      message,
      recipientId: users.connectedWith.id,
    });
  };

  useEffect(() => {
    const newSocket = io(DOMAIN);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinRoom", roomId, users.me.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [entries]);

  useEffect(() => {
    if (socket) {
      socket.on("payloadFromServer", (message) => {
        dispatch({ type: "APPEND_MESSAGE", payload: message });
      });

      socket.on("promoteVendor", (message) => {
        navigate(`/vendor/events/${eventServiceId}`);
      });
    }
  }, [socket]);

  return (
    <>
      <div>
        {entries &&
          entries.map((entry) => {
            return (
              <ChatMessage
                key={entry.id}
                users={users}
                sender={getSender(entry)}
                {...entry}
              />
            );
          })}
      </div>
      <ChatInputBox
        sendMessage={sendMessage}
        handleChange={handleChange}
        value={value}
      />
    </>
  );
}
