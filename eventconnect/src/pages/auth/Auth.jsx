import FullScreenContainer from "../../components/FullScreenContainer";
// import BreakpointContainer from "../../components/BreakpointContainer";
// import LoginUserSelectionTabs from "./Components/LoginUserSelection";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import LogoHeader from "../../components/Logos/LogoHeader";
import { Box, Paper } from "@mui/material";
import { useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { Text } from "../../components/Texts/Texts";
import StyledLink from "../../components/StyledLink";

export default function Login() {
  const theme = useTheme();

  const location = useLocation();
  const { pathname } = location;

  return (
    <>
      <FullScreenContainer justifyCenter alignCenter>
        {/* <BreakpointContainer> */}
        <MaxWidthContainer maxWidth="md" centered>
          <Paper sx={{ backgroundColor: theme.palette.background }}>
            <LogoHeader></LogoHeader>
            <Box
              textAlign={"centered"}
              sx={{ padding: "0 calc(10px + 5%) 15px" }}
            >
              <Outlet />
            </Box>
            {/*<LoginUserSelectionTabs></LoginUserSelectionTabs> */}
          </Paper>

          {pathname === "/auth/eventPlanner/login" && (
            <Text textAlign="right" size="sm" style={{ marginRight: "10px" }}>
              <StyledLink to="/auth/vendor/login">
                Switch to Vendor Account Sign In
              </StyledLink>
            </Text>
          )}
          {pathname === "/auth/vendor/login" && (
            <Text textAlign="right" size="sm" style={{ marginRight: "10px" }}>
              <StyledLink to="/auth/eventPlanner/login">
                Switch to Event Planner Account Sign In
              </StyledLink>
            </Text>
          )}
        </MaxWidthContainer>
        {/* </BreakpointContainer> */}
      </FullScreenContainer>
    </>
  );
}
