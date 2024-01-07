import ChatInputBox from "./ChatInputBox";
import ChatMessage from "./ChatMessage";

export default function ChatBox({ entries }) {
  entries = [
    {
      name: "Mitchell",
      message: "Yo yo yo, hows it goin?",
      dateTime: "04:30pm",
      id: 1,
    },
    {
      name: "Jack",
      message: "Yeah, not too bad, yourself?",
      dateTime: "04:30pm",
      recipient: true,
      id: 2,
    },
    {
      name: "Mitchell",
      message: "Ye, shootin the shit",
      dateTime: "04:36pm",
      id: 3,
    },
  ];
  return (
    <>
      <div>
        {entries &&
          entries.map((entry) => <ChatMessage key={entry.id} {...entry} />)}
      </div>
      <ChatInputBox />
    </>
  );
}
