import styled from "@emotion/styled";
import { purple } from "@mui/material/colors";
import { Text } from "./Texts/Texts";
import { Paper } from "@mui/material";
import dayjs from "dayjs";
import { useTheme } from "@mui/material";

// like ChatMessage.jsx, styled a little differently to indicate it's a server message

export default function ChatServerMessage({ message, createdAt }) {
  const theme = useTheme();

  const containerStyle = {
    margin: "10px 5px",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <Text
        bold
        style={{
          margin: "0",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          color: theme.palette.feature[2],
        }}
      >
        {message}
      </Text>
      <Text size="xs" italic style={{ margin: "0" }}>
        {dayjs(createdAt).format("DD MMM YYYY - HH:MM")}
      </Text>
    </div>
  );
}
