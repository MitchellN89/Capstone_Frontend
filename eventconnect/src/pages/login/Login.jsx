import FullScreenContainer from "../../components/FullScreenContainer";
import BackgroundImageCarousel from "./Components/BackgroundImageCarousel";
import BreakpointContainer from "../../components/BreakpointContainer";
import LoginUserSelectionTabs from "./Components/LoginUserSelection";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import LogoHeader from "./Components/LogoHeader";
import { Paper } from "@mui/material";
import { useTheme } from "@mui/material";

const imageUrls = ["/Wedding2.jpg", "/Party.jpg"];

export default function Login() {
  const theme = useTheme();
  console.log(theme);
  return (
    <>
      <BackgroundImageCarousel imageUrls={imageUrls} cycleTime={15} />
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
