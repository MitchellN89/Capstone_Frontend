import { Text } from "./Texts/Texts";
import dayjs from "dayjs";
import { useTheme } from "@mui/material";

// expects message, createdAt and isMe (bool) passed in
// styles the message depending on isMe value

export default function ChatMessage({ message, createdAt, isMe }) {
  const theme = useTheme();
  const containerStyle = {
    borderLeft: !isMe ? `10px solid purple` : "",
    borderRight: isMe ? `10px solid ${theme.palette.feature[2]}` : "",
    padding: "5px 10px",
    margin: "10px 5px",
    maxWidth: "80%",
    marginLeft: isMe ? "auto" : "",
    textAlign: isMe ? "right" : "left",
  };

  return (
    <div style={containerStyle}>
      <Text
        style={{
          margin: "0",
          overflowWrap: "break-word",
          wordWrap: "break-word",
        }}
      >
        {message}
      </Text>
      <Text size="xs" italic style={{ margin: "0" }}>
        {dayjs(createdAt).format("DD MMM YYYY - HH:mm")}
      </Text>
    </div>
  );
}
