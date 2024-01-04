import { Grid, Paper } from "@mui/material";
import { TextValidationInput } from "../../../components/InputComponents";
import { useInputData } from "../../../hooks/useInputData";
import { useState } from "react";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../../components/TextComponents";
import { ButtonLoading } from "../../../components/Buttons";
import { apiCall } from "../../../utilities/apiCall";
import { convertFormDataToObject } from "../../../utilities/formData";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useData from "../../../hooks/useData";

export default function EditEventEP() {
  const { eventId } = useParams();
  const location = useLocation();
  const event = location.state || useData(`/events/${eventId}[0]`);
  const navigate = useNavigate();
  const [eventNameValue, eventNameProps, notValidEventName, resetEventName] =
    useInputData(event ? event.eventName : "");

  const [addressValue, addressProps, notValidAddress, resetAddress] =
    useInputData(event ? event.address : "");
  const [
    endClientFirstNameValue,
    endClientFirstNameProps,
    notValidEndClientFirstName,
    resetEndClientFirstName,
  ] = useInputData(event ? event.endClientFirstName : "");
  const [
    endClientLastNameValue,
    endClientLastNameProps,
    notValidEndClientLastName,
    resetEndClientLastName,
  ] = useInputData(event ? event.endClientLastName : "");
  const [
    endClientEmailAddressValue,
    endClientEmailAddressProps,
    notValidEndClientEmailAddress,
    resetEndClientEmailAddress,
  ] = useInputData(event ? event.endClientEmailAddress : "");
  const [
    endClientPhoneNumberValue,
    endClientPhoneNumberProps,
    notValidEndClientPhoneNumber,
    resetEndClientPhoneNumber,
  ] = useInputData(event ? event.endClientPhoneNumber : "");
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidForm = () => {
    return new Promise((res) => {
      setTimeout(() => {
        res(
          [
            notValidAddress,
            notValidEndClientEmailAddress,
            notValidEndClientFirstName,
            notValidEndClientLastName,
            notValidEndClientPhoneNumber,
            notValidEventName,
          ].every((i) => i)
        );
      }, 250);
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const isValid = await isValidForm();
    if (isValid) return;

    setIsLoading(true);
    const payload = convertFormDataToObject(new FormData(evt.target));

    await apiCall(`/events/${eventId}`, "put", payload)
      .then((data) => {
        console.log("CREATED EVENT SUCESS: ", data);
        console.log("MARKER: Need success notifications");
        navigate(`/eventplanner/${eventId}`);
      })
      .catch((err) => {
        console.error(err);
        console.log("MARKER: Need error notifications");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <Header1>CREATE NEW EVENT</Header1>
      <MaxWidthContainer maxWidth="lg" centered>
        <Paper>
          <Box padding={2}>
            <Box paddingX={5}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Header2>New Event</Header2>
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidationInput
                      {...eventNameProps}
                      fullWidth
                      label="Event Name"
                      type="text"
                      name="eventName"
                      required
                      disabled={isLocked || isLoading}
                      patterns={[
                        {
                          type: "required",
                          value: /^[a-zA-Z0-9,\s'!\-]+$/,
                          message:
                            "Please use only standard letters, spaces, numbers, dashes, apostrophes and exclamation marks",
                          label: "lettersOnly",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextValidationInput
                      {...addressProps}
                      label="Address"
                      fullWidth
                      type="text"
                      name="address"
                      disabled={isLocked || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidationInput
                      {...endClientFirstNameProps}
                      label="Client First Name"
                      fullWidth
                      type="text"
                      name="endClientFirstName"
                      disabled={isLocked || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidationInput
                      {...endClientLastNameProps}
                      label="Client Last Name"
                      fullWidth
                      type="text"
                      name="endClientLastName"
                      disabled={isLocked || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidationInput
                      {...endClientEmailAddressProps}
                      label="Client Email Address"
                      fullWidth
                      type="text"
                      name="endClientEmailAddress"
                      disabled={isLocked || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidationInput
                      {...endClientPhoneNumberProps}
                      label="Client Phone Number"
                      fullWidth
                      type="text"
                      name="endClientPhoneNumber"
                      disabled={isLocked || isLoading}
                    />
                  </Grid>
                  <Grid textAlign="right" item xs={12}>
                    <ButtonLoading
                      color="error"
                      type="button"
                      variant="text"
                      disabled={isLocked || isLoading}
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      Cancel
                    </ButtonLoading>
                    <ButtonLoading
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLocked || isLoading}
                    >
                      Update Event
                    </ButtonLoading>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </Paper>
      </MaxWidthContainer>
    </>
  );
}
