import "../styles/breakPointContainers.css";

export default function BreakpointContainer({ style, children }) {
  return (
    <div style={{ margin: "auto", ...style }} className="breakPointContainer">
      {children}
    </div>
  );
}
