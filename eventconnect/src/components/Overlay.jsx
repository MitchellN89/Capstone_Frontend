export default function Overlay() {
  const styles = {
    position: "fixed",
    top: "0",
    left: "0",
    backgroundColor: "#f0f0f0",
    height: "100vh",
    width: "100vw",
    zIndex: "-1",
  };
  return <div style={styles}></div>;
}
