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
import { useNotification } from "../../context/NotificationProvider";

//get backend domain
const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function ServiceConnectionEp({
  handleTrigger,
  serviceRequestId,
  trigger,
}) {
  //var and state setup below
  const [socket, setSocket] = useState(null);
  const [entries, setEntries] = useState(null);
  const { triggerNotification } = useNotification();
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

  // on loading the component, set the entries from the serviceConnection passed in
  // set the room id
  useEffect(() => {
    if (serviceConnection) {
      if (serviceConnection.chatEntries) {
        setEntries(serviceConnection.chatEntries);
      }
      setRoomId(serviceConnection.id);
    }
    // when serviceConnection changes, rerun useeffect
  }, [serviceConnection]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    // api call to get connection
    apiCall(`/serviceRequests/${serviceRequestId}/connection`)
      .then((result) => {
        if (!ignore) {
          // set state with retrieved data
          setServiceConnection(result.data);

          // mark chat entries as read for this connection
          dispatchChatEntry({
            type: "DELETE_ENTRIES",
            serviceConnectionId: result.data.id,
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          // on error, send message
          triggerNotification({
            message: "Error while getting connection",
            severity: "error",
          });
          console.error(err);
        }
      })
      .finally(() => {
        // set isLoading back to false
        setIsLoading(false);
      });

    return () => {
      //cleanup function
      ignore = true;
    };
    // trigger as dependency means this useEffect can be manually rerun when required
  }, [trigger]);

  // upon roomId change
  useEffect(() => {
    // create new socket and set socket state
    let newSocket;
    if (roomId) {
      newSocket = io(DOMAIN);
      setSocket(newSocket);

      // emit joinRoom msg to server
      // send myId as server tracks users who are online
      newSocket.on("connect", () => {
        newSocket.emit("joinRoom", roomId, myId);
      });
    }

    return () => {
      // cleanup = disconnect from socket
      if (roomId) {
        newSocket.disconnect();
      }
    };
  }, [roomId]);

  // once socket is set, setup all listeners
  useEffect(() => {
    if (socket) {
      // get message from server and append into entries
      socket.on("payloadFromServer", (message) => {
        setEntries((entries) => {
          const newEntries = [...entries];
          newEntries.push(message);
          return newEntries;
        });
      });

      //receive promotion notification and append entries.
      socket.on("promoteVendor", (payload) => {
        const { message, eventServiceId } = payload;

        setEntries((entries) => {
          const newEntries = [...entries];
          newEntries.push(message);
          return newEntries;
        });

        // redirect to new event
        navigate(`/vendor/events/${eventServiceId}`);
      });
    }
  }, [socket]);

  // emit a message to server
  const sendMessage = (message) => {
    if (!message) return;

    // setup callback function. if error on serverside, this is invoked
    const handleError = (serverResponse) => {
      console.error(serverResponse);

      // send error message
      triggerNotification({
        message: "Error while sending message. For more info, see console log",
        severity: "error",
      });
    };

    // send message
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

  //handle inital load
  if (!serviceConnection) return;

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
