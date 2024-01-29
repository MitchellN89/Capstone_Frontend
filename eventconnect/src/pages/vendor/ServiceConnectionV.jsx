import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { Header1 } from "../../components/Texts/TextHeaders";
import ChatBox from "../../components/ChatBox";
import io from "socket.io-client";
import { useUser } from "../../context/UserProvider";
import HeaderStrip from "../../components/HeaderStrip";
import ChatInputBox from "../../components/ChatInputBox";
import { useChatEntryContext } from "../../context/ChatEntryProvider";
import UserCard from "../../components/UserCard";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function ServiceConnectionEp({
  handleTrigger,
  serviceRequestId,
  trigger,
}) {
  const [socket, setSocket] = useState(null);
  const [entries, setEntries] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const {
    state: {
      user: { id: myId },
    },
  } = useUser();
  const navigate = useNavigate();
  const [serviceConnection, setServiceConnection] = useState(null);
  const { eventService } = serviceConnection || {};
  const { event } = eventService || {};
  const { user: connectedWith } = event || {};
  const { dispatch: dispatchChatEntry } = useChatEntryContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (serviceConnection) {
      if (serviceConnection.chatEntries) {
        setEntries(serviceConnection.chatEntries);
      }
      console.log(
        "ServiceConnectionV.jsx > serviceConnection: ",
        serviceConnection
      );
      setRoomId(serviceConnection.id);
    }
  }, [serviceConnection]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    apiCall(`/serviceRequests/${serviceRequestId}/connection`)
      .then((result) => {
        if (!ignore) {
          setServiceConnection(result.data);
          dispatchChatEntry({
            type: "DELETE_ENTRIES",
            serviceConnectionId: result.data.id,
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [trigger]);

  useEffect(() => {
    let newSocket;
    if (roomId) {
      newSocket = io(DOMAIN);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("joinRoom", roomId, myId);
      });
    }

    return () => {
      if (roomId) {
        newSocket.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (socket) {
      socket.on("payloadFromServer", (message) => {
        setEntries((entries) => {
          const newEntries = [...entries];
          newEntries.push(message);
          return newEntries;
        });
      });

      socket.on("promoteVendor", (payload) => {
        const { message, eventServiceId } = payload;

        setEntries((entries) => {
          const newEntries = [...entries];
          newEntries.push(message);
          return newEntries;
        });

        navigate(`/vendor/events/${eventServiceId}`);
      });
    }
  }, [socket]);

  const sendMessage = (message) => {
    if (!message) return;
    const handleError = (serverResponse) => {
      console.error(serverResponse);
    };

    socket.emit(
      "payloadFromUser",
      roomId,
      {
        senderId: myId,
        message,
        recipientId: connectedWith.id,
      },
      handleError
    );
  };

  if (!serviceConnection) return <span>No data available yet</span>;
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        marginBottom: "30px",
      }}
    >
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>CONNECTIONS</Header1>
      </HeaderStrip>

      <UserCard
        firstName={connectedWith.firstName}
        lastName={connectedWith.lastName}
        emailAddress={connectedWith.emailAddress}
        phoneNumber={connectedWith.phoneNumber}
        websiteUrl={connectedWith.websiteUrl}
      />
      <ChatBox handleTrigger={handleTrigger} entries={entries} />
      <ChatInputBox sendMessage={sendMessage} />
    </div>
  );
}
