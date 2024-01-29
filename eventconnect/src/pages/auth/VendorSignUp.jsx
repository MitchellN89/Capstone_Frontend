import AuthHeader from "./Components/AuthHeader";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import TextInput from "../../components/Inputs/TextInput";
import { Button, Grid } from "@mui/material";
import { apiCall } from "../../utilities/apiCall";
import { useTextInput } from "../../hooks/useInputData";
import { convertFormDataToObject } from "../../utilities/formData";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationProvider";
import { Divider } from "@mui/material";
import { useState } from "react";
import {
  validationAtLeastOneLowerCase,
  validationAtLeastOneNumber,
  validationAtLeastOneSpecial,
  validationAtLeastOneUpperCase,
  validationMatch,
  validationOnlyEmailAddress,
  validationOnlyName,
  validationOnlyPhoneNumber,
} from "../../utilities/textValidation";

// For comments; see EventPlannerSignUp.jsx - the two components are near identical.
// They have been separated due to minor differences in accountType

const allValid = (...inputs) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(inputs.every((input) => input));
    }, 250);
  });
};

export default function VendorSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const [firstNameProps, isValidFirstName, resetFirstName] = useTextInput(
    "",
    "First Name",
    "firstName",
    "name"
  );
  const [lastNameProps, isValidLastName, resetLastName] = useTextInput(
    "",
    "Last Name",
    "lastName",
    "name"
  );
  const [companyNameProps, isValidCompanyName, resetCompanyName] = useTextInput(
    "",
    "Company Name",
    "companyName",
    "text"
  );
  const [phoneNumberProps, isValidPhoneNumber, resetPhoneNumber] = useTextInput(
    "",
    "Phone Number",
    "phoneNumber",
    "text"
  );
  const [websiteUrlProps, isValidWebsiteUrl, resetWebsiteUrl] = useTextInput(
    "",
    "Website Url",
    "websiteUrl",
    "url"
  );
  const [
    emailAddressProps,
    isValidEmailAddress,
    resetEmailAddress,
    emailAddressValue,
  ] = useTextInput("", "Email Address", "emailAddress", "email");
  const [passwordProps, isValidPassword, resetPassword, passwordValue] =
    useTextInput("", "Password", "password", "password");
  const [reTypePasswordProps, isValidReTypePassword, resetReTypePassword] =
    useTextInput("", "Re-type Password", undefined, "password");

  const resetForm = () => {
    resetFirstName();
    resetLastName();
    resetCompanyName();
    resetEmailAddress();
    resetWebsiteUrl();
    resetPhoneNumber();
    resetPassword();
    resetReTypePassword();
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const isValidForm = await allValid(
      isValidCompanyName,
      isValidEmailAddress,
      isValidFirstName,
      isValidLastName,
      isValidPassword,
      isValidPhoneNumber,
      isValidReTypePassword,
      isValidWebsiteUrl
    );

    if (!isValidForm) {
      triggerNotification({
        message: "Please make sure all fields contain valid data",
        severity: "error",
      });
      return;
    }

    let body = convertFormDataToObject(new FormData(evt.target));
    body.accountType = "vendor";
    setIsLoading(true);

    try {
      await apiCall("/auth/createuser", "post", body, false);

      triggerNotification({ message: "Successfully created account" });

      navigate("/auth/vendor/login", {
        state: { emailAddress: emailAddressValue },
      });
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 409:
            triggerNotification({
              message:
                "You have already signed up for an account using this email address. Returning to the login screen",
              severity: "warning",
            });

            navigate("/auth/vendor/login", {
              state: { emailAddress: emailAddressValue },
            });
            break;
          default:
            triggerNotification({
              message: "Server error. For more details, see log",
              severity: "error",
            });
            resetForm();
        }
      }

      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader accountTypeLabel="Vendor" message="Sign Up" />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextInput
              {...firstNameProps}
              patterns={[validationOnlyName]}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              {...lastNameProps}
              patterns={[validationOnlyName]}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextInput {...companyNameProps} required />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              {...phoneNumberProps}
              patterns={[validationOnlyPhoneNumber]}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput {...websiteUrlProps} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <TextInput
              {...emailAddressProps}
              patterns={[validationOnlyEmailAddress]}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              {...passwordProps}
              patterns={[
                validationAtLeastOneLowerCase,
                validationAtLeastOneUpperCase,
                validationAtLeastOneNumber,
                validationAtLeastOneSpecial,
              ]}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              {...reTypePasswordProps}
              patterns={[
                validationMatch(passwordValue, "Passwords must match"),
              ]}
              required
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button
              variant="textr"
              color="error"
              disabled={isLoading}
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            <ButtonLoading
              style={{ marginLeft: "10px" }}
              variant="contained"
              type="submit"
              disabled={isLoading}
              labelWhenLoading="Signing Up"
              label="Sign Up"
              variantWhenLoading="outlined"
            ></ButtonLoading>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
