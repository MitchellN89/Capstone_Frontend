import "../styles/breakPointContainers.css";

export default function BreakpointContainer({ style, children }) {
  return (
    <div style={style} className="breakPointContainer">
      {children}
    </div>
  );
}
