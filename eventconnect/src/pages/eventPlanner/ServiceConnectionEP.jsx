import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ChatBoxEP from "./Components/ChatBoxEP";
import io from "socket.io-client";
import { useUser } from "../../context/UserProvider";
import useLiveChat from "../../hooks/useLiveChat";

export default function ServiceConnectionEp({
  serviceConnection,
  handleTrigger,
  liveChatProps,
  resetSelectedVendorId,
}) {
  if (!serviceConnection) return <span>No data available yet</span>;

  return (
    <>
      <button
        onClick={() => {
          resetSelectedVendorId();
        }}
      >
        Go backs
      </button>
      <Header1>Connection</Header1>
      <Header2></Header2>
      <ChatBoxEP {...liveChatProps} handleTrigger={handleTrigger}></ChatBoxEP>
    </>
  );
}
