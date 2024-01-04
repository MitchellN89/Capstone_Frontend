import styled from "@emotion/styled";

export function FeatureStylize({ children, bold, italic, featureStrength }) {
  const StyledSpan = styled("span")(({ theme }) => ({
    fontStyle: italic ? "italic" : null,
    fontWeight: bold ? "bold" : "inherit",
    color: featureStrength ? theme.palette.feature[featureStrength] : "inherit",
  }));

  return <StyledSpan>{children}</StyledSpan>;
}
