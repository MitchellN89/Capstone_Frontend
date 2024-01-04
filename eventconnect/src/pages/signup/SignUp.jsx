import FullScreenContainer from "../../components/FullScreenContainer";
import BreakpointContainer from "../../components/BreakpointContainer";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import LogoHeader from "../../components/Logos/LogoHeader";
import { Paper } from "@mui/material";
import { useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import SignUpForm from "./Components/SignUpForm";

export default function SignUp() {
  const theme = useTheme();
  const { type } = useParams();

  return (
    <>
      <FullScreenContainer justifyCenter alignCenter>
        <BreakpointContainer>
          <MaxWidthContainer maxWidth="md" centered>
            <Paper sx={{ backgroundColor: theme.palette.background }}>
              <LogoHeader></LogoHeader>

              <SignUpForm userType={type}></SignUpForm>
            </Paper>
          </MaxWidthContainer>
        </BreakpointContainer>
      </FullScreenContainer>
    </>
  );
}
