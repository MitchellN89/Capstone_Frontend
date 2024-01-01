import { Box } from "@mui/system";
import LogoLarge from "../../../components/LogoLarge";
import styled from "@emotion/styled";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.feature[1],
  textAlign: "center",
}));

export default function LogoHeader() {
  return (
    <StyledBox>
      <LogoLarge style={{ margin: "30px 0" }}></LogoLarge>
    </StyledBox>
  );
}
