import * as React from "react";
import Box from "@mui/material/Box";
import {
  FeatureStylize,
  Header2,
  LinkStyled,
} from "../../../components/TextComponents";
import { Button, TextField } from "@mui/material";
import useInputData from "../../../hooks/useInputData";
import { Icon } from "@iconify/react";
import { useUser } from "../../../context/UserProvider";
import NotificationPopup from "../../../components/NotifcationPopup";
import useNotificationOptions from "../../../hooks/useNotificationOptions";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ userType, userTypeLabel }) {
  const [email, handleEmail, resetEmail] = useInputData("");
  const [password, handlePassword, resetPassword] = useInputData("");
  const [isLocked, setIsLocked] = useState(false);
  const { loginUserWithCredentials, isLoading } = useUser();
  const [notificationOptions, handleNotificationOptions] =
    useNotificationOptions();
  let timer;
  const navigate = useNavigate();

  useEffect(() => {
    // remove user from context
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsLocked(true);
    const result = await loginUserWithCredentials(email, password, userType);

    switch (result.status) {
      case 200:
        handleNotificationOptions({
          message: result.response,
        });

        timer = setTimeout(() => {
          navigate(`/${userType}`);
        }, 2000);
        break;
      case 404:
        handleNotificationOptions({
          message: result.response,
          severity: "warning",
        });
        setIsLocked(false);
      default:
        setIsLocked(false);
    }
    resetEmail();
    resetPassword();
  };

  return (
    <>
      <Box textAlign={"centered"} sx={{ padding: "0 5%" }}>
        <Header2 centered style={{ marginTop: "0" }}>
          <FeatureStylize italic bold featureStrength={3}>
            {userTypeLabel}
          </FeatureStylize>{" "}
          Log In
        </Header2>
        <form action="/test" onSubmit={handleSubmit}>
          <TextField
            value={email}
            onChange={handleEmail}
            sx={{ marginBottom: "14px" }}
            fullWidth
            type="email"
            id="inputEmail"
            label="Email Address"
            variant="outlined"
            required
            disabled={isLoading || isLocked ? true : false}
          />

          <TextField
            fullWidth
            id="inputPassword"
            label="Password"
            variant="outlined"
            type="password"
            sx={{ marginBottom: "14px" }}
            value={password}
            onChange={handlePassword}
            required
            disabled={isLoading || isLocked ? true : false}
          />
          <Box display="flex" alignItems="center" flexDirection="column">
            <Button
              style={{ marginLeft: "auto" }}
              variant="contained"
              type="submit"
              disabled={isLoading || isLocked ? true : false}
            >
              {isLoading ? "Signing In" : "Sign In"}
              {isLoading ? (
                <Icon
                  style={{ marginLeft: "10px" }}
                  width="2em"
                  icon="eos-icons:loading"
                />
              ) : null}
            </Button>
            <NotificationPopup {...notificationOptions}></NotificationPopup>
            <p>
              Don't Have an account?{" "}
              <LinkStyled href="#">Sign up here</LinkStyled>
            </p>
          </Box>
        </form>
      </Box>
    </>
  );
}
