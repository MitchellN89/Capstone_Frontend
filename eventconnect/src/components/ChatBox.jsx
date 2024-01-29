import ChatMessage from "./ChatMessage";
import { useUser } from "../context/UserProvider";
import ChatServerMessage from "./ChatServerMessage";
import { useEffect, useRef } from "react";

export default function ChatBox({ entries }) {
  const {
    state: {
      user: { id: myId },
    },
  } = useUser();

  const chatBox = useRef(null);

  useEffect(() => {
    const { scrollHeight } = chatBox.current;
    chatBox.current.scrollTop = scrollHeight;
  }, [entries]);

  return (
    <>
      <div ref={chatBox} style={{ flexGrow: "1", overflow: "auto" }}>
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
