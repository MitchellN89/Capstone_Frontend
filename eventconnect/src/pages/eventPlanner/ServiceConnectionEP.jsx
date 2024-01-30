import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { Header1 } from "../../components/Texts/TextHeaders";
import ChatBox from "../../components/ChatBox";
import io from "socket.io-client";
import { useUser } from "../../context/UserProvider";
import HeaderStrip from "../../components/HeaderStrip";
import ButtonLogoBack from "../../components/Buttons/ButtonLogoBack";
import ChatInputBox from "../../components/ChatInputBox";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useChatEntryContext } from "../../context/ChatEntryProvider";
import { Button } from "@mui/material";
import UserCard from "../../components/UserCard";
import { useNotification } from "../../context/NotificationProvider";

// set DOMAIN as backend domain from .env file
const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function ServiceConnectionEp({
  serviceConnection,
  handleTrigger,
  resetSelectedVendorId,
  eventServiceVendorId,
}) {
  // destructuring and setting variables below
  const [socket, setSocket] = useState(null);
  const [entries, setEntries] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
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

  // this useEffect runs when serviceConnection changes.
  // it sets the entries state to chatEntries from service connection. (this is the chat log)
  useEffect(() => {
    if (serviceConnection) {
      if (serviceConnection.chatEntries) {
        setEntries(serviceConnection.chatEntries);
      }

      // as the users has now seen latest messages, the chat entries relating to this service connection can now be removed from context.
      chatEntryDispatch({ type: "DELETE_ENTRIES", serviceConnectionId });

      // set the roomId state as the serviceConnection ID. this is used for socket-io
      setRoomId(serviceConnection.id);
    }
  }, [serviceConnection]);

  // when roomId changes, create a new socket, set socket state and emit a "joinRoom" message to the backend to instruct it which room this user is in
  // sends users id as well as the backend monitors who is and isn't online
  useEffect(() => {
    let newSocket;
    if (roomId) {
      newSocket = io(DOMAIN);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("joinRoom", roomId, myId);
      });
    }

    // cleanup function to disconnect from socket upon component unmounting
    return () => {
      if (roomId) {
        newSocket.disconnect();
      }
    };
  }, [roomId]);

  // when the socket is set / changes
  // setup listeners
  useEffect(() => {
    if (socket) {
      // this listener takes the message from the backend and appends it to entries state.
      socket.on("payloadFromServer", (message) => {
        setEntries((entries) => {
          const newEntries = [...entries];
          newEntries.push(message);
          return newEntries;
        });
      });
    }
  }, [socket]);

  // function which emits a message to the backend to send to the other user
  const sendMessage = (message) => {
    if (!message) return;

    // handle error is callback function. if there is an error on the server side, the server calls the function.
    const handleError = (serverResponse) => {
      console.error(serverResponse);

      triggerNotification({
        message: "Error while sending message. For more info, see console log",
        severity: "error",
      });
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
    // another callback function to handle error on backend
    const handleError = (serverResponse) => {
      console.error(serverResponse);

      triggerNotification({
        message: "Error while promoting vendor. For more info, see console log",
        severity: "error",
      });
    };

    //api call to update event service and set vendorId to the vendors id
    apiCall(
      `/events/${eventId}/services/${eventServiceId}/connections/${serviceConnectionId}/promoteVendor/${vendorId}`,
      "patch"
    )
      .then(() => {
        // force refresh
        handleTrigger();

        //reflect changes in event services context
        serviceDispatch({
          type: "PROMOTE_VENDOR",
          eventServiceId,
          vendorId,
        });

        //reflect change in events context
        eventDispatch({
          type: "PROMOTE_VENDOR",
          eventServiceId,
          vendorId,
          eventId,
        });

        // send success message
        triggerNotification({ message: "Successfully promoted vendor" });

        //send message to socket to instruct server to notify vendor AND add a chat entry with the vendor promotion
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
        // if error, send err message
        console.error(err);
        triggerNotification({
          message:
            "Error while promoting vendor. For more info, see console log",
          severity: "error",
        });
      });
  };

  // handle initial loading
  if (!serviceConnection) return;

  return (
    <div
      style={{
        maxHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>CONNECTIONS</Header1>
        {!eventServiceVendorId && (
          <ButtonLogoBack handleClick={resetSelectedVendorId} />
        )}
      </HeaderStrip>

      {/* Card to diplay details of connectedWith user */}
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
