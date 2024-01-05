import { Grid, Paper } from "@mui/material";
import { useTextInput, useDateTimeInput } from "../../hooks/useInputData";
import TextInput from "../../components/Inputs/TextInput";
import DateTimeInput from "../../components/Inputs/DateTimeInput";
import { useState } from "react";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { apiCall } from "../../utilities/apiCall";
import { convertFormDataToObject } from "../../utilities/formData";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useParams, useNavigate } from "react-router-dom";

export default function EditEventEP() {
  const { eventId } = useParams();
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext();
  const { isLoading } = events;
  const event = events.data.find((event) => eventId == event.id);
  const navigate = useNavigate();

  if (!event) navigate(`/eventplanner/${eventId}`);
  // TODO - notification here

  const [eventNameProps, isValidEventName] = useTextInput(
    event.eventName,
    "Event Name",
    "eventName",
    "text"
  );

  const [startDateTimeProps, isValidStartDateTime] = useDateTimeInput(
    event.startDate,
    "Start Date/Time",
    "startDateTime"
  );

  const [endDateTimeProps, isValidEndDateTime] = useDateTimeInput(
    event.endDate,
    "Start Date/Time",
    "startDateTime"
  );

  const [endClientFirstNameProps, isValidEndClientFirstName] = useTextInput(
    event.endClientFirstName,
    "Client First Name",
    "endClientFirstName",
    "name"
  );
  const [venueProps, isValidVenue] = useTextInput(
    event.venue,
    "Venue",
    "venue",
    "text"
  );
  const [endClientLastNameProps, isValidEndClientLastName] = useTextInput(
    event.endClientLastName,
    "Client Last Name",
    "endClientLastName",
    "name"
  );
  const [endClientEmailAddressProps, isValidEndClientEmailAddress] =
    useTextInput(
      event.endClientEmailAddress,
      "Client Email Address",
      "endClientEmailAddress",
      "emailAddress"
    );
  const [endClientPhoneNumberProps, isValidEndClientPhoneNumber] = useTextInput(
    event.endClientPhoneNumber,
    "Client Phone Number",
    "endClientPhoneNumber",
    "phoneNumber"
  );

  const isValidForm = () => {
    return new Promise((res) => {
      setTimeout(() => {
        res(
          [
            // isValidAddress,
            isValidVenue,
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

    const body = convertFormDataToObject(new FormData(evt.target));
    console.log("87: Running");
    eventsDispatch({ type: "PROCESSING_REQUEST" });

    apiCall(`/events/${eventId}`, "put", body)
      .then((result) => {
        console.log(result);
        eventsDispatch({
          type: "UPDATE_EVENT",
          payload: body,
          id: eventId,
          response: result.response,
        });
        console.log("MARKER: Need success notifications");
        navigate(`/eventplanner/${eventId}`, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        eventsDispatch({ type: "REQUEST_FAILED", error: err });
        console.log("MARKER: Need error notifications");
      });
  };
  return (
    <>
      <Header1>EDIT EVENT</Header1>
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
                    <TextInput {...eventNameProps} />
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
