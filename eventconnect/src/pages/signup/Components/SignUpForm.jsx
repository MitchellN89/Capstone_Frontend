import * as React from "react";
import Box from "@mui/material/Box";
import {
  FeatureStylize,
  Header2,
  LinkStyled,
} from "../../../components/TextComponents";
import { Divider, Grid } from "@mui/material";

import NotificationPopup from "../../../components/NotifcationPopup";
import useNotificationOptions from "../../../hooks/useNotificationOptions";
import {
  splitCamelCase,
  capitaliseAllFirstLetters,
} from "../../../utilities/stringFormatter";
import { TextValidationInput } from "../../../components/InputComponents";
import useInputData from "../../../hooks/useInputData";
import { useState } from "react";
import { ButtonLoading } from "../../../components/Buttons";
import { useUser } from "../../../context/UserProvider";
import { useNavigate } from "react-router-dom";

export default function SignUpForm(userType) {
  userType = userType.userType;
  const [notificationOptions, handleNotificationOptions] =
    useNotificationOptions();
  const [isLocked, setIsLocked] = useState(false);
  const [firstNameValue, firstNameProps, notValidFirstName, resetFirstName] =
    useInputData("");
  const [lastNameValue, lastNameProps, notValidLastName, resetLastName] =
    useInputData("");
  const [
    companyNameValue,
    companyNameProps,
    notValidCompanyName,
    resetCompanyName,
  ] = useInputData("");
  const [
    phoneNumberValue,
    phoneNumberProps,
    notValidPhoneNumber,
    resetPhoneNumber,
  ] = useInputData("");
  const [
    websiteUrlValue,
    websiteUrlProps,
    notValidwebsiteUrl,
    resetwebsiteUrl,
  ] = useInputData("");
  const [
    emailAddressValue,
    emailAddressProps,
    notValidEmailAddress,
    resetEmailAddress,
  ] = useInputData("");
  const [passwordValue, passwordProps, notValidPassword, resetPassword] =
    useInputData("");
  const [
    reTypePasswordValue,
    reTypePasswordProps,
    notValidReTypePassword,
    resetReTypePassword,
  ] = useInputData("");
  const { isLoading, signUpUser } = useUser();
  const navigate = useNavigate();

  const resetControls = () => {
    resetFirstName();
    resetLastName();
    resetPassword();
    resetEmailAddress();
    resetPhoneNumber();
    resetCompanyName();
    resetwebsiteUrl();
    resetReTypePassword();
  };

  const checkFormValid = () => {
    return [
      notValidFirstName,
      notValidLastName,
      notValidPassword,
      notValidEmailAddress,
      notValidPhoneNumber,
      notValidCompanyName,
      notValidwebsiteUrl,
      notValidReTypePassword,
    ].every((item) => !item);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!checkFormValid) return;
    setIsLocked(true);
    const result = await signUpUser(
      firstNameValue,
      lastNameValue,
      passwordValue,
      emailAddressValue,
      phoneNumberValue,
      companyNameValue,
      websiteUrlValue,
      userType
    );

    switch (result.status) {
      case 200:
        handleNotificationOptions({
          message: result.response,
        });

        timer = setTimeout(() => {
          navigate(`/auth`);
        }, 2000);
        break;
      case 409:
        handleNotificationOptions({
          message: result.response,
          severity: "warning",
        });
        timer = setTimeout(() => {
          navigate(`/auth`);
        }, 2000);
        break;
      default:
        handleNotificationOptions({
          message: result.response,
          severity: "error",
        });
        setIsLocked(false);
    }
    resetControls();
  };

  return (
    <>
      <Box textAlign={"centered"} sx={{ padding: "0 5%" }}>
        <Header2 centered style={{ marginTop: "20px" }}>
          <FeatureStylize bold featureStrength={3}>
            {capitaliseAllFirstLetters(splitCamelCase(userType))}
          </FeatureStylize>{" "}
          Sign Up
        </Header2>

        <form action="/test" onSubmit={handleSubmit}>
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
                  disabled={isLocked || isLoading}
                  patterns={[
                    {
                      type: "required",
                      value: /^[a-zA-Z\s]+$/,
                      message: "Please use only standard letters and spaces",
                      label: "lettersOnly",
                    },
                  ]}
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
                  disabled={isLocked || isLoading}
                  patterns={[
                    {
                      type: "required",
                      value: /^[a-zA-Z\s]+$/,
                      message: "Please use only standard letters and spaces",
                      label: "lettersOnly",
                    },
                  ]}
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
                  disabled={isLocked || isLoading}
                  patterns={[
                    {
                      type: "required",
                      value: /^[a-zA-Z\s]+$/,
                      message: "Please use only standard letters and spaces",
                      label: "lettersOnly",
                    },
                  ]}
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
                  disabled={isLocked || isLoading}
                  patterns={[
                    {
                      type: "required",
                      value: /^(\d|\-|#|ext|\+| )+$/,
                      message:
                        "Please use only numbers, dashes, hashes, plus and 'ext'",
                      label: "phoneNumberOnly",
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidationInput
                  {...websiteUrlProps}
                  fullWidth
                  label="Website Url"
                  type="url"
                  id="inputWebsiteUrl"
                  disabled={isLocked || isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <TextValidationInput
                  {...emailAddressProps}
                  fullWidth
                  label="Email Address"
                  type="email"
                  id="inputEmailAddress"
                  disabled={isLocked || isLoading}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidationInput
                  {...passwordProps}
                  fullWidth
                  label="Password"
                  type="password"
                  id="inputPassword"
                  disabled={isLocked || isLoading}
                  required
                  patterns={[
                    {
                      type: "required",
                      value: /[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]/,
                      message: "Must contain at least one special character",
                      label: "specialCharacter",
                    },
                    {
                      type: "required",
                      value: /.*[a-z].*/,
                      message: "Must contain at least one lowercase letter",
                      label: "lowerCaseLetter",
                    },
                    {
                      type: "required",
                      value: /.*[A-Z].*/,
                      message: "Must contain at least one uppercase letter",
                      label: "upperCaseLetter",
                    },
                    {
                      type: "required",
                      value: /.*\d.*/,
                      message: "Must contain at least one number",
                      label: "number",
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidationInput
                  {...reTypePasswordProps}
                  fullWidth
                  label="Re-type Password"
                  type="password"
                  id="inputReTypePassword"
                  disabled={isLocked || isLoading}
                  required
                  patterns={[
                    {
                      type: "match",
                      value: passwordValue,
                      message: "Passwords do not match",
                      label: "matchPassword",
                    },
                  ]}
                />
              </Grid>
            </Grid>
            <ButtonLoading
              style={{ marginLeft: "auto" }}
              variant="contained"
              type="submit"
              disabled={isLocked || isLoading}
              label="Sign Up"
              labelWhenLoading="Signing Up"
            />
            <NotificationPopup {...notificationOptions}></NotificationPopup>
            <p style={{ marginBottom: "42px" }}>
              Return back to <LinkStyled to={`/auth`}>Login</LinkStyled>
            </p>
          </Box>
        </form>
      </Box>
    </>
  );
}
