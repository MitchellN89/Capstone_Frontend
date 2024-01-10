import { IconSend } from "./Icons";

export default function ChatInputBox({ value, handleChange, sendMessage }) {
  const containerStyle = {
    display: "flex",
  };

  const inputStyle = {
    flexGrow: "1",
  };

  return (
    <div style={containerStyle}>
      <input
        style={inputStyle}
        value={value}
        onChange={handleChange}
        type="text"
      />{" "}
      <button
        onClick={() => {
          sendMessage(value);
        }}
      >
        <IconSend />
      </button>
    </div>
  );
}
