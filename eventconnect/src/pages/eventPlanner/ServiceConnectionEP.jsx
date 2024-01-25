import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ChatBoxEP from "./Components/ChatBoxEP";
import io from "socket.io-client";
import { useUser } from "../../context/UserProvider";
import HeaderStrip from "../../components/HeaderStrip";
import ButtonLogoBack from "../../components/Buttons/ButtonLogoBack";
import ChatInputBox from "../../components/ChatInputBox";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { useEventsEPContext } from "../../context/EventEPProvider";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function ServiceConnectionEp({
  serviceConnection,
  handleTrigger,
  resetSelectedVendorId,
}) {
  console.log("serviceConnection: ", serviceConnection);
  const [socket, setSocket] = useState(null);
  const [entries, setEntries] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const {
    state: {
      user: { id: myId },
    },
  } = useUser();
  const { eventServiceId, eventId } = useParams();
  const { id: serviceConnectionId } = serviceConnection || {};
  const { user: connectedWith } = serviceConnection || {};
  const { dispatch: serviceDispatch } = useServicesEPContext();
  const { dispatch: eventDispatch } = useEventsEPContext();
  const { id: vendorId } = connectedWith || {};

  useEffect(() => {
    if (serviceConnection) {
      if (serviceConnection.chatEntries) {
        setEntries(serviceConnection.chatEntries);
      }

      setRoomId(serviceConnection.id);
    }
  }, [serviceConnection]);

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
        console.log("RESPONSE FROM SERVER: ", message);
        setEntries((entries) => {
          const newEntries = [...entries];
          newEntries.push(message);
          return newEntries;
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("serviceConnection: ", serviceConnection);
  }, [serviceConnection]);

  const sendMessage = (message) => {
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

  const promoteVendor = () => {
    const handleError = (serverResponse) => {
      console.error(serverResponse);
    };

    apiCall(
      `/events/${eventId}/services/${eventServiceId}/connections/${serviceConnectionId}/promoteVendor/${vendorId}`,
      "patch"
    )
      .then((result) => {
        console.log("RESULT: ", result);
        handleTrigger();
        serviceDispatch({
          type: "PROMOTE_VENDOR",
          eventServiceId,
          vendorId,
        });

        eventDispatch({
          type: "PROMOTE_VENDOR",
          eventServiceId,
          vendorId,
          eventId,
        });

        socket.emit(
          "promoteVendor",
          roomId,
          {
            senderId: myId,
            recipientId: connectedWith.id,
            eventServiceId,
          },
          handleError
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!serviceConnection) return <span>No data available yet</span>;

  return (
    <>
      <HeaderStrip style={{ marginTop: "30px" }}>
        <Header1 style={{ margin: "0" }}>CONNECTIONS</Header1>
        <ButtonLogoBack handleClick={resetSelectedVendorId} />
      </HeaderStrip>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ChatBoxEP handleTrigger={handleTrigger} entries={entries}></ChatBoxEP>
        <ChatInputBox sendMessage={sendMessage} />
        <button onClick={promoteVendor}>Promote Vendor</button>
      </div>
    </>
  );
}
