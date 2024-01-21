const divStyle = {
  display: "flex",
  justifyContent: "space-between",
  margin: "10px 0 20px",
};

export default function HeaderStrip({ children, style, ...others }) {
  return (
    <div style={{ ...divStyle, ...style }} {...others}>
      {children}
    </div>
  );
}
