import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export default function StyledLink({ children, to }) {
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
