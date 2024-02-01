import { useTheme } from "@emotion/react";

export default function MaxWidthContainer({
  children,
  style,
  maxWidth,
  centered,
}) {
  const theme = useTheme();
  const styles = {
    maxWidth: maxWidth ? theme.containers.width[maxWidth] : "auto",
    margin: centered ? "auto" : null,
    ...style,
  };
  return <div style={styles}>{children}</div>;
}
