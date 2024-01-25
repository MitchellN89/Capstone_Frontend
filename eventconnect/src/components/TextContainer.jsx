import { useTheme } from "@emotion/react";

export default function TextContainer({ children }) {
  const theme = useTheme();
  const style = {
    paddingLeft: "10px",
    borderLeft: `5px solid ${theme.palette.feature[2]}`,
    margin: "10px 0",
  };
  return <div style={style}>{children}</div>;
}
