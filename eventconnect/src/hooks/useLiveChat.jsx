// import { useReducer, useState } from "react";
// import { useUser } from "../context/UserProvider";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "SET_ENTRIES":
//       return action.payload;
//     case "APPEND_MESSAGE":
//       const entries = [...state];
//       entries.push(action.payload);
//       return entries;
//     default:
//       return state;
//   }
// };

// export default function useLiveChat(connectedWithUser = {}, roomId = 0) {
//   const [entries, dispatch] = useReducer(reducer, []);
//   const [value, setValue] = useState("");
//   const { user } = useUser().state;

//   roomId = parseInt(roomId);

//   const users = {
//     me: {
//       name: "Me",
//       id: user && user.id ? user.id : null,
//     },
//     connectedWith: {
//       name:
//         connectedWithUser && connectedWithUser.firstName
//           ? connectedWithUser.firstName
//           : "Anonymous",
//       id:
//         connectedWithUser && connectedWithUser.id ? connectedWithUser.id : null,
//       company:
//         connectedWithUser && connectedWithUser.companyName
//           ? connectedWithUser.companyName
//           : null,
//     },
//   };

//   const handleChange = (evt) => {
//     setValue(evt.target.value);
//   };

//   const getSender = (entry) => {
//     const isMe = entry.senderId == users.me.id;
//     return isMe ? "me" : "connectedWith";
//   };

//   const props = {
//     entries,
//     value,
//     handleChange,
//     users,
//     roomId,
//     dispatch,
//     getSender,
//   };

//   return [props, dispatch];
// }
