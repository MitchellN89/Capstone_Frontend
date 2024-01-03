import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

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

export function FeatureStylize({ children, bold, italic, featureStrength }) {
  const StyledSpan = styled("span")(({ theme }) => ({
    fontStyle: italic ? "italic" : null,
    fontWeight: bold ? "bold" : "inherit",
    color: featureStrength ? theme.palette.feature[featureStrength] : "inherit",
  }));

  return <StyledSpan>{children}</StyledSpan>;
}

export function LinkStyled({ children, to }) {
  const StyledLink = styled(Link)(({ theme }) => ({
    fontWeight: "bold",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
    "&:visited": {
      color: theme.palette.primary.main,
    },
  }));
  return (
    <StyledLink underline="hover" to={to}>
      {children}
    </StyledLink>
  );
}

export function TextValidationError({ children }) {
  const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.error.main,
  }));

  return <StyledTypography variant="subtitle2">{children}</StyledTypography>;
}
