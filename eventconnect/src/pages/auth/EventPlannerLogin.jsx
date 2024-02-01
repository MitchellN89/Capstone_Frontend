import AuthHeader from "./Components/AuthHeader";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import TextInput from "../../components/Inputs/TextInput";
import { Grid } from "@mui/material";
import { apiCall } from "../../utilities/apiCall";
import SignUpLink from "./Components/SignUpLink";
import { useUser } from "../../context/UserProvider";
import { useTextInput } from "../../hooks/useInputData";
import { convertFormDataToObject } from "../../utilities/formData";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationProvider";

export default function EventPlannerLogin() {
  const { state: initValues } = useLocation(); // this allows me to retrieve data sent when navigating to this 'page' from another. In this case, it'll either contain nothing, OR will contain the user email for quick login functionality
  const { dispatch: dispatchUser } = useUser();
  const { isLoading } = useUser().state; // grabbing this from the reducer function to allow me to lock the page during an apiCall
  const navigate = useNavigate();
  const [emailAddressProps] = useTextInput(
    //custom hook to streamline inputs
    initValues ? initValues.emailAddress : "",
    "Email Address",
    "emailAddress",
    "emailAddress"
  );
  const { triggerNotification } = useNotification(); // Custom context to allow me to use global notifications which maintain during 'page' changes
  const [passwordProps] = useTextInput("", "Password", "password", "password"); //custom hook to streamline inputs

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    let body = convertFormDataToObject(new FormData(evt.target)); // takes the formdate and converts it to an object
    body.accountType = "eventPlanner"; // appending the accounttype for the body payload to the server

    dispatchUser({ type: "PROCESSING_REQUEST" }); // Instruct the dispatch function to set isLoading to true
    try {
      // using a function to do all api calls which streamlines the process and keeps the code clean
      const response = await apiCall(
        "/auth/loginwithcredentials",
        "post",
        body,
        false
      );

      const { data, token } = response;
      sessionStorage.setItem("key", token); //setting the sessionStorage "key" to the authentication token. This will be used in most apiCalls

      dispatchUser({ type: "SET_USER", payload: data }); //if no error, set the user as the returned data
      triggerNotification({ message: "Successfully logged in" }); //submit a notification with a success message
      navigate("/eventPlanner/"); //navigate to the eventPlanners 'main' page
    } catch (err) {
      if (err.response) {
        //handling errors using various repsonse codes. E.G. 4040 implies the server code not find a user with those credentials
        switch (err.response.status) {
          case 404:
            // submit a notification with an error message
            triggerNotification({
              message: "Cannot find user with these credentials",
              severity: "error",
            });
        }
      }

      dispatchUser({ type: "REQUEST_FAILED" }); // instruct the dispatch to set isLoading to false
      console.error(err);
    }
  };

  return (
    <>
      <AuthHeader accountTypeLabel="Event Planner" message="Sign In" />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextInput
              required={true}
              disabled={isLoading}
              {...emailAddressProps}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              required={true}
              disabled={isLoading}
              {...passwordProps}
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
            <ButtonLoading
              variant="contained"
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              labelWhenLoading="Signing In"
              label="Sign In"
              variantWhenLoading="outlined"
            ></ButtonLoading>
          </Grid>
          <Grid item xs={12}>
            <SignUpLink
              accountType="eventPlanner"
              textValue="Don't have an account?"
              linkValue="Sign up for an Event Planner account"
            />
          </Grid>
        </Grid>
      </form>
    </>
  );
}
