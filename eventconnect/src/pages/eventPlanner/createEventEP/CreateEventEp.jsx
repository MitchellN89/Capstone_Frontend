import { Grid, Paper } from "@mui/material";
import {
  TextInput,
  TextValidationInput,
} from "../../../components/InputComponents";
import { useInputData, useTextInput } from "../../../hooks/useInputData";
import { useState } from "react";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../../components/TextComponents";
import { ButtonLoading } from "../../../components/Buttons";
import { apiCall } from "../../../utilities/apiCall";
import { convertFormDataToObject } from "../../../utilities/formData";
import { useNavigate } from "react-router-dom";

export default function CreateEventEP() {
  // const [eventNameValue, eventNameProps, notValidEventName, resetEventName] =
  //   useInputData("");
  // const [addressValue, addressProps, notValidAddress, resetAddress] =
  //   useInputData("");
  // const [
  //   endClientFirstNameValue,
  //   endClientFirstNameProps,
  //   notValidEndClientFirstName,
  //   resetEndClientFirstName,
  // ] = useInputData("");
  // const [
  //   endClientLastNameValue,
  //   endClientLastNameProps,
  //   notValidEndClientLastName,
  //   resetEndClientLastName,
  // ] = useInputData("");
  // const [
  //   endClientEmailAddressValue,
  //   endClientEmailAddressProps,
  //   notValidEndClientEmailAddress,
  //   resetEndClientEmailAddress,
  // ] = useInputData("");
  // const [
  //   endClientPhoneNumberValue,
  //   endClientPhoneNumberProps,
  //   notValidEndClientPhoneNumber,
  //   resetEndClientPhoneNumber,
  // ] = useInputData("");
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [eventNameProps, isValidEventName] = useTextInput(
    "",
    "Event Name",
    "eventName",
    "name"
  );
  const [addressProps, isValidAddress] = useTextInput(
    "",
    "Address",
    "address",
    "text"
  );
  const [endClientFirstNameProps, isValidEndClientFirstName] = useTextInput(
    "",
    "Client First Name",
    "endClientFirstName",
    "name"
  );
  const [endClientLastNameProps, isValidEndClientLastName] = useTextInput(
    "",
    "Client Last Name",
    "endClientLastName",
    "name"
  );
  const [endClientEmailAddressProps, isValidEndClientEmailAddress] =
    useTextInput(
      "",
      "Client Email Address",
      "endClientEmailAddress",
      "emailAddress"
    );
  const [endClientPhoneNumberProps, isValidEndClientPhoneNumber] = useTextInput(
    "",
    "Client Phone Number",
    "endClienPhoneNumber",
    "phoneNumber"
  );
  const navigate = useNavigate();

  const isValidForm = () => {
    return new Promise((res) => {
      setTimeout(() => {
        res(
          [
            isValidAddress,
            isValidEndClientEmailAddress,
            isValidEndClientFirstName,
            isValidEndClientLastName,
            isValidEndClientPhoneNumber,
            isValidEventName,
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

    await apiCall("/events", "post", payload)
      .then((newEvent) => {
        const { id: eventId } = newEvent.data;
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
                    {/* <TextValidationInput
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
                    /> */}
                    <TextInput {...eventNameProps} />
                  </Grid>

                  <Grid item xs={12}>
                    {/* <TextValidationInput
                      {...addressProps}
                      label="Address"
                      fullWidth
                      type="text"
                      name="address"
                      disabled={isLocked || isLoading}
                    /> */}
                    <TextInput {...addressProps} />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <TextValidationInput
                      {...endClientFirstNameProps}
                      label="Client First Name"
                      fullWidth
                      type="text"
                      name="endClientFirstName"
                      disabled={isLocked || isLoading}
                    /> */}
                    <TextInput {...endClientFirstNameProps} />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <TextValidationInput
                      {...endClientLastNameProps}
                      label="Client Last Name"
                      fullWidth
                      type="text"
                      name="endClientLastName"
                      disabled={isLocked || isLoading}
                    /> */}
                    <TextInput {...endClientLastNameProps} />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <TextValidationInput
                      {...endClientEmailAddressProps}
                      label="Client Email Address"
                      fullWidth
                      type="text"
                      name="endClientEmailAddress"
                      disabled={isLocked || isLoading}
                    /> */}
                    <TextInput {...endClientEmailAddressProps} />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <TextValidationInput
                      {...endClientPhoneNumberProps}
                      label="Client Phone Number"
                      fullWidth
                      type="text"
                      name="endClientPhoneNumber"
                      disabled={isLocked || isLoading}
                    /> */}
                    <TextInput {...endClientPhoneNumberProps} />
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
                      Submit
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
