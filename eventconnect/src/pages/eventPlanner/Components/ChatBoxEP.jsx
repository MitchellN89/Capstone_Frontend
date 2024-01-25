import { useParams } from "react-router-dom";
import ChatInputBox from "../../../components/ChatInputBox";
import ChatMessage from "../../../components/ChatMessage";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useServicesEPContext } from "../../../context/EventServiceEPProvider";
import { useEventsEPContext } from "../../../context/EventEPProvider";
import { Paper } from "@mui/material";
import { useUser } from "../../../context/UserProvider";
import ChatServerMessage from "../../../components/ChatServerMessage";

export default function ChatBoxEP({ entries }) {
  const {
    state: {
      user: { id: myId },
    },
  } = useUser();

  return (
    <>
      <div style={{ flexGrow: "1", overflow: "auto", maxHeight: "75vh" }}>
        {entries &&
          entries.map((entry, index) => {
            if (entry.isServerMessage && entry.recipientId == myId) {
              return (
                <ChatServerMessage
                  key={entry.id || `index${index}`}
                  {...entry}
                />
              );
            } else if (!entry.isServerMessage) {
              return (
                <ChatMessage
                  key={entry.id || `index${index}`}
                  {...entry}
                  isMe={entry.senderId == myId}
                />
              );
            }
          })}
      </div>
    </>
  );
}
