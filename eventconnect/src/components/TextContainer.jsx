const style = {
  paddingLeft: "10px",
  borderLeft: "5px solid blue",
  margin: "10px 0",
};

export default function TextContainer({ children }) {
  return <div style={style}>{children}</div>;
}
