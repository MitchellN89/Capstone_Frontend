// import ChatInputBox from "../../../components/ChatInputBox";
// import ChatMessage from "../../../components/ChatMessage";
// import { useEffect, useState } from "react";
// import io from "socket.io-client";

// const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

// export default function ChatBox({
//   entries,
//   value,
//   handleChange,
//   users,
//   roomId,
//   dispatch,
//   getSender,
//   handleTrigger,
//   triggerDelivery,
// }) {
//   const [socket, setSocket] = useState(null);

//   const sendMessage = (message) => {
//     socket.emit("payloadFromUser", roomId, {
//       senderId: users.me.id,
//       message,
//       recipientId: users.connectedWith.id,
//     });
//   };

//   useEffect(() => {
//     const newSocket = io(DOMAIN);
//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("Socket connected: ", newSocket.id);
//       newSocket.emit("joinRoom", roomId, users.me.id);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [entries]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("payloadFromServer", (message) => {
//         dispatch({ type: "APPEND_MESSAGE", payload: message });
//       });
//     }
//   }, [socket]);

//   useEffect(() => {
//     if (triggerDelivery.payload) {
//       socket.emit(triggerDelivery.messageCode, roomId, triggerDelivery.payload);
//     }
//   }, [triggerDelivery]);

//   return (
//     <>
//       <div>
//         {entries &&
//           entries.map((entry) => {
//             return (
//               <ChatMessage
//                 key={entry.id}
//                 users={users}
//                 sender={getSender(entry)}
//                 {...entry}
//               />
//             );
//           })}
//       </div>
//       <ChatInputBox
//         sendMessage={sendMessage}
//         handleChange={handleChange}
//         value={value}
//       />
//     </>
//   );
// }
