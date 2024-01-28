import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ChatBox from "../../components/ChatBox";
import io from "socket.io-client";
import { useUser } from "../../context/UserProvider";
import HeaderStrip from "../../components/HeaderStrip";
import ButtonLogoBack from "../../components/Buttons/ButtonLogoBack";
import ChatInputBox from "../../components/ChatInputBox";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useChatEntryContext } from "../../context/ChatEntryProvider";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { Button } from "@mui/material";
import UserCard from "../../components/UserCard";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function ServiceConnectionEp({
  serviceConnection,
  handleTrigger,
  resetSelectedVendorId,
  eventServiceVendorId,
}) {
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
  const { dispatch: chatEntryDispatch } = useChatEntryContext();
  const { id: vendorId } = connectedWith || {};

  useEffect(() => {
    if (serviceConnection) {
      if (serviceConnection.chatEntries) {
        setEntries(serviceConnection.chatEntries);
      }
      console.log(
        "ServiceConnectionEP.jsx > serviceConnectrion: ",
        serviceConnection
      );
      chatEntryDispatch({ type: "DELETE_ENTRIES", serviceConnectionId });
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
        setEntries((entries) => {
          const newEntries = [...entries];
          newEntries.push(message);
          return newEntries;
        });
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

  const promoteVendor = () => {
    const handleError = (serverResponse) => {
      console.error(serverResponse);
    };

    apiCall(
      `/events/${eventId}/services/${eventServiceId}/connections/${serviceConnectionId}/promoteVendor/${vendorId}`,
      "patch"
    )
      .then(() => {
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
    <div
      style={{
        maxHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        // marginBottom: "20px",
      }}
    >
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>CONNECTIONS</Header1>
        {!eventServiceVendorId && (
          <ButtonLogoBack handleClick={resetSelectedVendorId} />
        )}
      </HeaderStrip>

      <UserCard
        companyName={connectedWith.companyName}
        firstName={connectedWith.firstName}
        lastName={connectedWith.lastName}
        emailAddress={connectedWith.emailAddress}
        phoneNumber={connectedWith.phoneNumber}
        websiteUrl={connectedWith.websiteUrl}
      />
      <ChatBox handleTrigger={handleTrigger} entries={entries} />
      <ChatInputBox sendMessage={sendMessage} />
      {!eventServiceVendorId && (
        <Button onClick={promoteVendor}>Promote Vendor</Button>
      )}
    </div>
  );
}
