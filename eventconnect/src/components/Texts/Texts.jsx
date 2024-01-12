export function Text({ children, bold, italic, size, textAlign, style }) {
  const sizes = {
    xs: "10px",
    sm: "12px",
    md: "16px",
    lg: "18px",
    xl: "20px",
  };

  const textStyle = {
    fontWeight: bold ? "bold" : "inherit",
    textStyle: italic ? "italic" : "inherit",
    fontSize: size ? sizes[size] : "inherit",
    textAlign: textAlign ? textAlign : "inherit",
  };
  return <p style={{ ...textStyle, ...style }}>{children}</p>;
}