import styled from "@emotion/styled";

export default function FullScreenContainer({
  children,
  justifyCenter,
  alignCenter,
  style,
}) {
  const styles = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: justifyCenter ? "center" : "flex-start",
    alignItems: alignCenter ? "center" : "flex-start",
    ...style,
  };

  return <div style={styles}>{children}</div>;
}
