import FullScreenContainer from "../../components/FullScreenContainer";
// import BreakpointContainer from "../../components/BreakpointContainer";
// import LoginUserSelectionTabs from "./Components/LoginUserSelection";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import LogoHeader from "../../components/Logos/LogoHeader";
import { Box, Paper } from "@mui/material";
import { useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Login() {
  const theme = useTheme();
  console.log("Auth.jsx");

  return (
    <>
      <FullScreenContainer justifyCenter alignCenter>
        {/* <BreakpointContainer> */}
        <MaxWidthContainer maxWidth="md" centered>
          <Paper sx={{ backgroundColor: theme.palette.background }}>
            <LogoHeader></LogoHeader>
            <Box textAlign={"centered"} sx={{ padding: "0 5% 15px" }}>
              <Outlet />
            </Box>
            {/*<LoginUserSelectionTabs></LoginUserSelectionTabs> */}
          </Paper>
        </MaxWidthContainer>
        {/* </BreakpointContainer> */}
      </FullScreenContainer>
    </>
  );
}
