import ChatMessage from "./ChatMessage";
import { useUser } from "../context/UserProvider";
import ChatServerMessage from "./ChatServerMessage";
import { useEffect, useRef } from "react";

export default function ChatBox({ entries }) {
  // get this users id
  const {
    state: {
      user: { id: myId },
    },
  } = useUser();

  // create useRef to store the main div container in
  const chatBox = useRef(null);

  // when the entries change, scroll to the bottom of the div
  useEffect(() => {
    const { scrollHeight } = chatBox.current;
    chatBox.current.scrollTop = scrollHeight;
  }, [entries]);

  return (
    <>
      {/* link div with chatBox ref */}
      <div ref={chatBox} style={{ flexGrow: "1", overflow: "auto" }}>
        {/* iterate over entries and display as a message */}
        {/* message style changes depending on senderId and if the message is a serverMessage */}
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
