import styled from "@emotion/styled";
import { Link } from "@mui/material";

export function Header2({ children, centered, style }) {
  const StyledH2 = styled("h2")(({ theme }) => ({
    fontSize: "32px",
    fontWeight: "400",
    textAlign: centered ? "center" : "left",
    color: theme.palette.text,
    ...style,
  }));

  return <StyledH2>{children}</StyledH2>;
}

export function FeatureStylize({ children, bold, italic, featureStrength }) {
  const StyledSpan = styled("span")(({ theme }) => ({
    fontStyle: italic ? "italic" : null,
    fontWeight: bold ? "bold" : "inherit",
    color: featureStrength ? theme.palette.feature[featureStrength] : "inherit",
  }));

  return <StyledSpan>{children}</StyledSpan>;
}

export function LinkStyled({ children, href }) {
  const StyledLink = styled(Link)({
    fontWeight: "bold",
  });
  return (
    <StyledLink underline="hover" href={href}>
      {children}
    </StyledLink>
  );
}
