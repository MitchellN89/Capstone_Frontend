import styled from "@emotion/styled";
import { purple } from "@mui/material/colors";
import { Text } from "./Texts/Texts";
import { Paper } from "@mui/material";
import dayjs from "dayjs";
import { useTheme } from "@mui/material";

export default function ChatServerMessage({ message, createdAt }) {
  const containerStyle = {
    margin: "auto",
    textAlign: "center",
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
        {dayjs(createdAt).format("DD MMM YYYY - HH:MM")}
      </Text>
    </div>
  );
}
