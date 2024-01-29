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
// using some reusable functions for validation
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

// this function expects an array of values, if all values are true, it returns true.
// i've used a Promise here and a setTimeout. The reason for this is that input validation is evaluated after a debouncer.
// The promise means this function can be awaited synchronously and the timeout means the user can't proceed until the debouncer checks for validation errors
const allValid = (...inputs) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(inputs.every((input) => input));
    }, 250);
  });
};

export default function EventPlannerSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  // custom hook used below for input props as well as values and reset function etc
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

  // this function batch resets all the inputs back to their default values
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

    // check all inputs have valid data and then proceed
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
      // if not valid, submit error message
      triggerNotification({
        message: "Please make sure all fields contain valid data",
        severity: "error",
      });
      return;
    }

    let body = convertFormDataToObject(new FormData(evt.target)); // convert formdata to an object
    body.accountType = "eventPlanner"; //append accounttype
    setIsLoading(true); //set loading to true to lock controls

    try {
      await apiCall("/auth/createuser", "post", body, false); // api call to backend to create user

      //if no error, give success message
      triggerNotification({ message: "Successfully created account" });

      // then navigate to the event planner login BUT, send the emailaddress used to auto populate that input field
      navigate("/auth/eventplanner/login", {
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
            //this error implies the user already has an account. therefore, it redirects them to the login screen and populates the email address input
            navigate("/auth/eventplanner/login", {
              state: { emailAddress: emailAddressValue },
            });
            break;
          default:
            // non specific error message
            triggerNotification({
              message: "Server error. For more details, see log",
              severity: "error",
            });
            resetForm(); //reset the form
        }
      }
      console.error(err);
    } finally {
      //set isLoading back to false and unlock the controls
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader accountTypeLabel="Event Planner" message="Sign Up" />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextInput
              {...firstNameProps}
              patterns={[validationOnlyName]}
              disabled={isLoading}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              {...lastNameProps}
              patterns={[validationOnlyName]}
              disabled={isLoading}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput {...companyNameProps} disabled={isLoading} />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              {...phoneNumberProps}
              patterns={[validationOnlyPhoneNumber]}
              disabled={isLoading}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput {...websiteUrlProps} disabled={isLoading} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <TextInput
              {...emailAddressProps}
              patterns={[validationOnlyEmailAddress]}
              disabled={isLoading}
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
              disabled={isLoading}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              {...reTypePasswordProps}
              patterns={[
                validationMatch(passwordValue, "Passwords must match"),
              ]}
              disabled={isLoading}
              required
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button
              variant="text"
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
              isLoading={isLoading}
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
