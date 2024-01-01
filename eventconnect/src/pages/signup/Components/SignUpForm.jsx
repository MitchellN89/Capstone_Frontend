import * as React from "react";
import Box from "@mui/material/Box";
import {
  FeatureStylize,
  Header2,
  LinkStyled,
} from "../../../components/TextComponents";
import { Button, Grid, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import NotificationPopup from "../../../components/NotifcationPopup";
import useNotificationOptions from "../../../hooks/useNotificationOptions";
import {
  splitCamelCase,
  capitaliseAllFirstLetters,
} from "../../../utilities/stringFormatter";
import { TextValidationInput } from "../../../components/InputComponents";
import useInputData from "../../../hooks/useInputData";
import { useState } from "react";
import SignUpStepper from "./Stepper";

export default function SignUpForm(userType, userTypeLabel) {
  const [notificationOptions] = useNotificationOptions();
  const [firstNameValue, firstNameProps, isValidFirstName, resetFirstName] =
    useInputData("");
  const [lastNameValue, lastNameProps, isValidLastName, resetLastName] =
    useInputData("");
  const [
    companyNameValue,
    companyNameProps,
    isValidCompanyName,
    resetCompanyName,
  ] = useInputData("");
  const [
    phoneNumberValue,
    phoneNumberProps,
    isValidPhoneNumber,
    resetPhoneNumber,
  ] = useInputData("");
  const [websiteUrlValue, websiteUrlProps, isValidWebsiteUrl, resetWebsiteUrl] =
    useInputData("");
  const [isLoading, setIsLoading] = useState("");

  return (
    <>
      <Box textAlign={"centered"} sx={{ padding: "0 5%" }}>
        <Header2 centered style={{ marginTop: "20px" }}>
          <FeatureStylize bold featureStrength={3}>
            {capitaliseAllFirstLetters(splitCamelCase(userType.userType))}
          </FeatureStylize>{" "}
          Sign Up
        </Header2>
        <SignUpStepper></SignUpStepper>
        <form action="/test">
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            sx={{ padding: "0 5%" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextValidationInput
                  {...firstNameProps}
                  fullWidth
                  style={{ marginBottom: "0" }}
                  label="First Name"
                  type="text"
                  id="inputFirstName"
                  required
                  isLocked={isLoading ? true : false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextValidationInput
                  {...lastNameProps}
                  fullWidth
                  style={{ marginBottom: "0" }}
                  label="Last Name"
                  type="text"
                  id="inputLastName"
                  required
                  isLocked={isLoading ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidationInput
                  {...companyNameProps}
                  fullWidth
                  style={{ marginBottom: "0" }}
                  label="Company Name"
                  type="text"
                  id="inputCompanyName"
                  isLocked={isLoading ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidationInput
                  {...phoneNumberProps}
                  fullWidth
                  style={{ marginBottom: "0" }}
                  label="Phone Number"
                  type="text"
                  id="inputPhoneNumber"
                  required
                  isLocked={isLoading ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidationInput
                  {...websiteUrlProps}
                  fullWidth
                  label="Website Url"
                  type="text"
                  id="inputWebsiteUrl"
                  isLocked={isLoading ? true : false}
                />
              </Grid>
            </Grid>
            <Button
              style={{ marginLeft: "auto" }}
              variant="contained"
              type="submit"
            >
              Sign Up
              <Icon
                style={{ marginLeft: "10px" }}
                width="2em"
                icon="eos-icons:loading"
              />
            </Button>
            <NotificationPopup {...notificationOptions}></NotificationPopup>
            <p>
              Return back to <LinkStyled to={`/auth`}>Login</LinkStyled>
            </p>
          </Box>
        </form>
      </Box>
    </>
  );
}
