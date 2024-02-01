import styled from "@emotion/styled";

//various props avialable to manipulate the style of the text without having the need for separate components

export function FeatureStylize({ children, bold, italic, featureStrength }) {
  const StyledSpan = styled("span")(({ theme }) => ({
    fontStyle: italic ? "italic" : null,
    fontWeight: bold ? "bold" : "inherit",
    color: featureStrength ? theme.palette.feature[featureStrength] : "inherit",
  }));

  return <StyledSpan>{children}</StyledSpan>;
}
