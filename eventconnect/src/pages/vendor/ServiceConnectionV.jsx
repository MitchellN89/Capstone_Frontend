import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ChatBoxV from "./Components/ChatBoxV";
import useData from "../../hooks/useData";
import io from "socket.io-client";
import { useUser } from "../../context/UserProvider";
import useLiveChat from "../../hooks/useLiveChat";

export default function ServiceConnectionEp({
  handleTrigger,
  serviceRequestId,
  trigger,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  // const [trigger, setTrigger] = useState(true);
  const [serviceConnection, setServiceConnection] = useState(null);

  const roomId = serviceConnection ? serviceConnection.id : null;
  const connectedWithUser = serviceConnection
    ? serviceConnection.eventService.event.user
    : null;

  const [liveChatProps, dispatchLiveChat] = useLiveChat(
    connectedWithUser,
    roomId
  );

  const eventServiceId = serviceConnection
    ? serviceConnection.eventService.id
    : null;

  useEffect(() => {
    let ignore = false;

    apiCall(`/serviceRequests/${serviceRequestId}/connection`)
      .then((result) => {
        if (!ignore) {
          dispatchLiveChat({
            type: "SET_ENTRIES",
            payload: result.data.chatEntries,
          });

          setServiceConnection(() => {
            const serviceConnection = { ...result.data };
            delete serviceConnection.chatEntries;
            return serviceConnection;
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
    if (serviceConnection)
      console.log("SERVICE CONNECTION: ", serviceConnection, roomId);
  }, [serviceConnection]);

  if (!serviceConnection) return <span>No data available yet</span>;
  return (
    <>
      <Header1>Connection</Header1>
      <Header2></Header2>
      <ChatBoxV
        {...liveChatProps}
        handleTrigger={handleTrigger}
        eventServiceId={eventServiceId}
      ></ChatBoxV>
    </>
  );
}
