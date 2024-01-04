import styled from "@emotion/styled";

export function Header1({ children, centered, style }) {
  const StyledH1 = styled("h2")(({ theme }) => ({
    fontSize: "32px",
    fontWeight: "400",
    textAlign: centered ? "center" : "left",
    color: theme.palette.text,
    ...style,
  }));

  return <StyledH1>{children}</StyledH1>;
}

export function Header2({ children, centered, style }) {
  const StyledH2 = styled("h2")(({ theme }) => ({
    fontSize: "28px",
    fontWeight: "400",
    textAlign: centered ? "center" : "left",
    color: theme.palette.text,
    ...style,
  }));

  return <StyledH2>{children}</StyledH2>;
}
