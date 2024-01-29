import { useNavigate } from "react-router-dom";
import { Button, styled } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import { Header2 } from "../../components/Texts/TextHeaders";

export default function AccountSelect() {
  const navigate = useNavigate();
  const theme = useTheme();

  const buttonStyle = {
    backgroundColor: theme.palette.feature[2],
    width: "30%",
    height: "150px",
    padding: "20px",
    margin: "20px",
  };

  return (
    <>
      <Header2 centered>Select your account type</Header2>
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          style={buttonStyle}
          onClick={() => {
            navigate("/auth/eventPlanner/login");
          }}
        >
          Event Planner
        </Button>
        <Button
          variant="contained"
          style={buttonStyle}
          onClick={() => {
            navigate("/auth/vendor/login");
          }}
        >
          Vendor
        </Button>
      </Box>
    </>
  );
}
