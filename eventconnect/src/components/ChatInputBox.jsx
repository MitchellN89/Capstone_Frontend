import { IconSend } from "./Icons";

export default function ChatInputBox() {
  const containerStyle = {
    display: "flex",
  };

  const inputStyle = {
    flexGrow: "1",
  };

  return (
    <div style={containerStyle}>
      <input style={inputStyle} value="tester text here" type="text" />{" "}
      <button>
        <IconSend />
      </button>
    </div>
  );
}
