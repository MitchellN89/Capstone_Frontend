import { Grid, Paper } from "@mui/material";
import TextInput from "../../components/Inputs/TextInput";
import { useState } from "react";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { apiCall } from "../../utilities/apiCall";
import {
  convertDatesToValid,
  convertFormDataToObject,
} from "../../utilities/formData";
import { useNavigate } from "react-router-dom";
import {
  useAddressInput,
  useTextInput,
  useDateTimeInput,
} from "../../hooks/useInputData";
import AddressInput from "../../components/Inputs/AddressInput";
import { useEventsEPContext } from "../../context/EventEPProvider";
import DateTimeInput from "../../components/Inputs/DateTimeInput";
import { useNotification } from "../../context/NotificationProvider";

const allValid = (...inputs) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(inputs.every((input) => input));
    }, 250);
  });
};

export default function CreateEventEP() {
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext();
  const { isLoading } = events;
  const { triggerNotification } = useNotification();
  const [eventNameProps, isValidEventName] = useTextInput(
    "",
    "Event Name",
    "eventName",
    "text"
  );
  const [startDateTimeProps, isValidStartDateTime] = useDateTimeInput(
    undefined,
    "Start Date/Time",
    "startDateTime"
  );

  const [endDateTimeProps, isValidEndDateTime] = useDateTimeInput(
    undefined,
    "End Date/Time",
    "endDateTime"
  );

  const [endClientFirstNameProps, isValidEndClientFirstName] = useTextInput(
    "",
    "Client First Name",
    "endClientFirstName",
    "text"
  );
  const [venueProps, isValidVenue] = useTextInput("", "Venue", "venue", "text");
  const [endClientLastNameProps, isValidEndClientLastName] = useTextInput(
    "",
    "Client Last Name",
    "endClientLastName",
    "text"
  );
  const [endClientEmailAddressProps, isValidEndClientEmailAddress] =
    useTextInput("", "Client Email Address", "endClientEmailAddress", "email");
  const [endClientPhoneNumberProps, isValidEndClientPhoneNumber] = useTextInput(
    "",
    "Client Phone Number",
    "endClientPhoneNumber",
    "text"
  );
  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const isValidForm = await allValid(
      isValidVenue,
      isValidEndClientEmailAddress,
      isValidEndClientFirstName,
      isValidEndClientLastName,
      isValidEndClientPhoneNumber,
      isValidEndDateTime,
      isValidStartDateTime,
      isValidEventName
    );

    if (!isValidForm) {
      triggerNotification({
        message: "Please make sure all fields contain valid data",
        severity: "error",
      });
      return;
    }

    let body = convertFormDataToObject(new FormData(evt.target));
    body = convertDatesToValid(
      body,
      "Date",
      "DD MMMM YYYY hh:mm a",
      "YYYY/MM/DD HH:mm"
    );

    eventsDispatch({ type: "PROCESSING_REQUEST" });
    try {
      const result = await apiCall("/events", "post", body);
      const { id: eventId } = result.data;

      eventsDispatch({
        type: "CREATE_EVENT",
        payload: result.data,
        response: result.response,
      });

      triggerNotification({
        message: "Successfully created new Event",
      });

      navigate(`/eventplanner/${eventId}`, { replace: true });
    } catch (err) {
      eventsDispatch({ type: "REQUEST_FAILED", error: err });
      switch (err.response.status) {
        default:
          triggerNotification({
            message: "Server error. For more details, see log",
            severity: "error",
          });
      }
      console.error(err);
    }
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
                    <TextInput {...venueProps} />
                  </Grid>
                  <Grid item xs={12}>
                    <DateTimeInput {...startDateTimeProps} />
                  </Grid>
                  <Grid item xs={12}>
                    <DateTimeInput {...endDateTimeProps} />
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
                      disabled={isLoading}
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      Cancel
                    </ButtonLoading>
                    <ButtonLoading
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
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
