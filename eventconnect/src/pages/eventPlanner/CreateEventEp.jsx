import { Grid, Paper } from "@mui/material";
import TextInput from "../../components/Inputs/TextInput";
import { useState } from "react";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { apiCall } from "../../utilities/apiCall";
import { convertFormDataToObject } from "../../utilities/formData";
import { useNavigate } from "react-router-dom";
import { useTextInput } from "../../hooks/useInputData";

export default function CreateEventEP() {
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [eventNameProps, isValidEventName] = useTextInput(
    "",
    "Event Name",
    "eventName",
    "text"
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
    "endClientPhoneNumber",
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
    if (!isValid) return;

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
                    <TextInput {...eventNameProps} required />
                  </Grid>

                  <Grid item xs={12}>
                    <TextInput {...addressProps} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput {...endClientFirstNameProps} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput {...endClientLastNameProps} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput {...endClientEmailAddressProps} />
                  </Grid>
                  <Grid item xs={12}>
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
