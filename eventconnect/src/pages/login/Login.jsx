import FullScreenContainer from "../../components/FullScreenContainer";
import BreakpointContainer from "../../components/BreakpointContainer";
import LoginUserSelectionTabs from "./Components/LoginUserSelection";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import LogoHeader from "../../components/LogoHeader";
import { Paper } from "@mui/material";
import { useTheme } from "@mui/material";

export default function Login() {
  const theme = useTheme();
  return (
    <>
      <FullScreenContainer justifyCenter alignCenter>
        <BreakpointContainer>
          <MaxWidthContainer maxWidth="md" centered>
            <Paper sx={{ backgroundColor: theme.palette.background }}>
              <LogoHeader></LogoHeader>
              <LoginUserSelectionTabs></LoginUserSelectionTabs>
            </Paper>
          </MaxWidthContainer>
        </BreakpointContainer>
      </FullScreenContainer>
    </>
  );
}
