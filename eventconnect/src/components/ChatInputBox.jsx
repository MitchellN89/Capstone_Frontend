import { useState } from "react";
import { IconSend } from "./Icons";
import { styled } from "@mui/material";
import { useTheme } from "@emotion/react";

export default function ChatInputBox({ sendMessage }) {
  const [value, setValue] = useState("");
  const containerStyle = {
    display: "flex",
  };
  const theme = useTheme();

  const handleChange = (evt) => {
    setValue(evt.target.value);
  };

  const inputStyle = {
    flexGrow: "1",
    padding: "10px 20px",
    border: "none",
    outline: "none",
    borderRadius: "20px 0 0 20px",
    resize: "none",
    height: "auto",
    maxHeight: "200px",
    overflow: "hidden",
  };

  const buttonStyle = {
    borderRadius: "0 20px 20px 0",
    border: "none",
    backgroundColor: theme.palette.feature[2],
    color: "white",
    padding: "5px 15px",
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    sendMessage(value);
    setValue("");
  };

  return (
    <form style={containerStyle} onSubmit={handleSubmit}>
      <input
        style={inputStyle}
        value={value}
        onChange={handleChange}
        type="text"
      />{" "}
      <button type="submit" style={buttonStyle}>
        <IconSend style={{ margin: "0" }} />
      </button>
    </form>
  );
}
