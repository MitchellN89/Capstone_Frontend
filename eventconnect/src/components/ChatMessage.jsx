import styled from "@emotion/styled";
import { purple } from "@mui/material/colors";

export default function ChatMessage({
  name,
  company,
  recipient,
  message,
  dateTime,
}) {
  const containerStyle = {
    borderLeft: recipient ? "10px solid purple" : "",
    borderRight: !recipient ? "10px solid blue" : "",
    padding: "0 10px",
    margin: "20px 0",
    maxWidth: "80%",
    width: "auto",
    marginLeft: !recipient ? "auto" : "",
    textAlign: !recipient ? "right" : "left",
  };

  const messageStyle = {};

  return (
    <div style={containerStyle}>
      <span>
        {name}
        {company && " @ " + company}
      </span>
      <p>{message}</p>
      <span>{dateTime}</span>
    </div>
  );
}
