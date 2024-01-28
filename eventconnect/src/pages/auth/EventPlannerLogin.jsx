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
  const { state: initValues } = useLocation();

  const { dispatch: dispatchUser } = useUser();
  const { isLoading } = useUser().state;
  const navigate = useNavigate();
  const [emailAddressProps] = useTextInput(
    initValues ? initValues.emailAddress : "",
    "Email Address",
    "emailAddress",
    "emailAddress"
  );
  const { triggerNotification } = useNotification();
  const [passwordProps] = useTextInput("", "Password", "password", "password");

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    let body = convertFormDataToObject(new FormData(evt.target));
    body.accountType = "eventPlanner";

    dispatchUser({ type: "PROCESSING_REQUEST" });
    try {
      const response = await apiCall(
        "/auth/loginwithcredentials",
        "post",
        body,
        false
      );

      const { data, token } = response;
      sessionStorage.setItem("key", token);

      dispatchUser({ type: "SET_USER", payload: data });
      triggerNotification({ message: "Successfully logged in" });
      navigate("/eventPlanner/");
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 404:
            triggerNotification({
              message: "Cannot find user with these credentials",
              severity: "error",
            });
        }
      }
      dispatchUser({ type: "REQUEST_FAILED" });
      console.error(err);
    }
  };

  return (
    <>
      <AuthHeader accountTypeLabel="Event Planner" />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextInput required={true} {...emailAddressProps} />
          </Grid>
          <Grid item xs={12}>
            <TextInput required={true} {...passwordProps} />
          </Grid>
          <Grid item xs={12} textAlign="right">
            <ButtonLoading
              variant="contained"
              type="submit"
              disabled={isLoading}
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
