import styled from "@emotion/styled";
import { Typography } from "@mui/material";

export default function TextValidationError({ children }) {
  const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.error.main,
  }));

  return <StyledTypography variant="subtitle2">{children}</StyledTypography>;
}
