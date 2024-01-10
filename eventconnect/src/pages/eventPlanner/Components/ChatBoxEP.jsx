import { useParams } from "react-router-dom";
import ChatInputBox from "../../../components/ChatInputBox";
import ChatMessage from "../../../components/ChatMessage";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { apiCall } from "../../../utilities/apiCall";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function ChatBoxEP({
  entries,
  value,
  handleChange,
  users,
  roomId,
  dispatch,
  getSender,
  handleTrigger,
}) {
  const [socket, setSocket] = useState(null);
  const vendorId = users.connectedWith.id;

  const { eventId, eventServiceId, serviceConnectionId } = useParams();

  const sendMessage = (message) => {
    socket.emit("payloadFromUser", roomId, {
      senderId: users.me.id,
      message,
      recipientId: users.connectedWith.id,
    });
  };

  const promoteVendor = () => {
    apiCall(
      `/events/${eventId}/services/${eventServiceId}/connections/${serviceConnectionId}/promoteVendor/${vendorId}`,
      "patch"
    )
      .then((result) => {
        handleTrigger();
        socket.emit("promoteVendor", roomId, { eventServiceId });
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
    // TODO - update dispatch for eventService AND event
  };

  useEffect(() => {
    const newSocket = io(DOMAIN);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected: ", newSocket.id);
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
      <button onClick={promoteVendor}>Promote Vendor</button>
    </>
  );
}
