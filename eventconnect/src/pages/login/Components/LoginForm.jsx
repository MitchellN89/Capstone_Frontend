import * as React from "react";
import Box from "@mui/material/Box";
import {
  FeatureStylize,
  Header2,
  LinkStyled,
} from "../../../components/TextComponents";
import { Button, Grid } from "@mui/material";
import useInputData from "../../../hooks/useInputData";

import { useUser } from "../../../context/UserProvider";
import NotificationPopup from "../../../components/NotifcationPopup";
import useNotificationOptions from "../../../hooks/useNotificationOptions";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextValidationInput } from "../../../components/InputComponents";
import {
  capitaliseAllFirstLetters,
  splitCamelCase,
} from "../../../utilities/stringFormatter";
import { ButtonLoading } from "../../../components/Buttons";

export default function LoginForm({ userType }) {
  const [emailValue, emailProps, isValidEmail, resetEmail] = useInputData("");
  const [passwordValue, passwordProps, isValidPassword, resetPassword] =
    useInputData("");
  const [isLocked, setIsLocked] = useState(false);
  const { loginUserWithCredentials, isLoading } = useUser();
  const [notificationOptions, handleNotificationOptions] =
    useNotificationOptions();
  let timer;
  const navigate = useNavigate();
  const userTypeLabel = capitaliseAllFirstLetters(splitCamelCase(userType));

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
    const result = await loginUserWithCredentials(
      emailValue,
      passwordValue,
      userType
    );

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
          <FeatureStylize bold featureStrength={3}>
            {userTypeLabel}
          </FeatureStylize>{" "}
          Sign In
        </Header2>
        <form action="/test" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextValidationInput
                {...emailProps}
                fullWidth
                label="Email Address"
                type="email"
                id="inputEmail"
                required
                isLoading={isLoading ? true : false}
                isLocked={isLoading ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidationInput
                {...passwordProps}
                fullWidth
                label="Password"
                type="password"
                id="inputPassword"
                required
                isLoading={isLoading ? true : false}
                isLocked={isLoading ? true : false}
              />
            </Grid>
          </Grid>

          <Box display="flex" alignItems="center" flexDirection="column">
            <ButtonLoading
              style={{ marginLeft: "auto" }}
              variant="contained"
              type="submit"
              isLoading={isLoading}
              isLocked={isLocked}
              label="Sign In"
              labelWhenLoading="Signing In"
            />
            <NotificationPopup {...notificationOptions}></NotificationPopup>
            <p>
              Don't Have an account?{" "}
              <LinkStyled to={`/auth/signup/${userType}`}>
                Sign up for{" "}
                {userTypeLabel === "Event Planner"
                  ? "an Event Planner"
                  : "a Vendor"}{" "}
                account!
              </LinkStyled>
            </p>
          </Box>
        </form>
      </Box>
    </>
  );
}
