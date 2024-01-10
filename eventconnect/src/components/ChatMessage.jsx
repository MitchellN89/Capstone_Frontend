import styled from "@emotion/styled";
import { purple } from "@mui/material/colors";

export default function ChatMessage({ message, createdAt, sender, users }) {
  const containerStyle = {
    borderLeft: sender != "me" ? "10px solid purple" : "",
    borderRight: sender == "me" ? "10px solid blue" : "",
    padding: "0 10px",
    margin: "20px 0",
    maxWidth: "80%",
    width: "auto",
    marginLeft: sender == "me" ? "auto" : "",
    textAlign: sender == "me" ? "right" : "left",
  };

  const messageStyle = {};

  return (
    <div style={containerStyle}>
      <span>{users[sender].name}</span>
      <p>{message}</p>
      <span>{createdAt}</span>
    </div>
  );
}
