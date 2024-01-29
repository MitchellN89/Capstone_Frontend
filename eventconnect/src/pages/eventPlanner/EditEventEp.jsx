import { Grid, Paper } from "@mui/material";
import { useTextInput, useDateTimeInput } from "../../hooks/useInputData";
import TextInput from "../../components/Inputs/TextInput";
import DateTimeInput from "../../components/Inputs/DateTimeInput";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Header2 } from "../../components/Texts/TextHeaders";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { apiCall } from "../../utilities/apiCall";
import { convertFormDataToObject } from "../../utilities/formData";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useParams, useNavigate } from "react-router-dom";
import AddressInput from "../../components/Inputs/AddressInput";
import FileInput from "../../components/Inputs/FileInput";
import { formatImageForJSON } from "../../utilities/imageFormatter";
import { convertDatesToValid } from "../../utilities/formData";
import { useNotification } from "../../context/NotificationProvider";
import {
  validationDateAfterNow,
  validationDateAfterValue,
  validationDateIsValid,
  validationOnlyEmailAddress,
  validationOnlyName,
  validationOnlyPhoneNumber,
} from "../../utilities/textValidation";

export default function EditEventEP({ handleOpen }) {
  const { eventId } = useParams();
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext();
  const { isLoading } = events;
  const event = events.events.find((event) => eventId == event.id);
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const { triggerNotification } = useNotification();

  if (!event) navigate(`/eventplanner/${eventId}`);
  // TODO - notification here

  useEffect(() => {
    console.log("EditEventEp.jsx > event: ", event);
  }, [event]);

  const [eventNameProps, isValidEventName] = useTextInput(
    event.eventName || "",
    "Event Name",
    "eventName",
    "text"
  );

  const [startDateTimeProps, isValidStartDateTime, , startDateTimeValue] =
    useDateTimeInput(
      event.startDateTime || "",
      "Start Date/Time",
      "startDateTime"
    );

  const [endDateTimeProps, isValidEndDateTime] = useDateTimeInput(
    event.endDateTime || "",
    "End Date/Time",
    "endDateTime"
  );

  const [endClientFirstNameProps, isValidEndClientFirstName] = useTextInput(
    event.endClientFirstName || "",
    "Client First Name",
    "endClientFirstName",
    "name"
  );
  const [venueProps, isValidVenue] = useTextInput(
    event.venue || "",
    "Venue",
    "venue",
    "text"
  );
  const [endClientLastNameProps, isValidEndClientLastName] = useTextInput(
    event.endClientLastName || "",
    "Client Last Name",
    "endClientLastName",
    "name"
  );
  const [endClientEmailAddressProps, isValidEndClientEmailAddress] =
    useTextInput(
      event.endClientEmailAddress || "",
      "Client Email Address",
      "endClientEmailAddress",
      "emailAddress"
    );
  const [endClientPhoneNumberProps, isValidEndClientPhoneNumber] = useTextInput(
    event.endClientPhoneNumber || "",
    "Client Phone Number",
    "endClientPhoneNumber",
    "phoneNumber"
  );

  const allValid = (...inputs) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(inputs.every((input) => input));
      }, 250);
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const isValidForm = await allValid(
      isValidEndClientEmailAddress,
      isValidEndClientFirstName,
      isValidEndClientLastName,
      isValidEndClientPhoneNumber,
      isValidEndDateTime,
      isValidEventName,
      isValidStartDateTime,
      isValidVenue
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
      let imageUpload;
      if (fileData) {
        imageUpload = await formatImageForJSON(fileData);
      }

      if (imageUpload) body.imageUpload = imageUpload;

      const result = await apiCall(`/events/${eventId}`, "put", body);

      eventsDispatch({
        type: "UPDATE_EVENT",
        payload: body,
        id: eventId,
        response: result.response,
      });

      triggerNotification({
        message: "Successfully edited Event",
      });

      // window.location.reload(true);

      handleOpen(false);
    } catch (err) {
      eventsDispatch({ type: "REQUEST_FAILED", error: err });
      if (err.response && err.response.status)
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

  const handleFileData = (value) => {
    setFileData(value);
  };

  return (
    <>
      <Paper>
        <Box padding={5}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Header2>Edit Event</Header2>
              </Grid>
              <Grid item xs={12}>
                <TextInput {...eventNameProps} required />
              </Grid>
              <Grid item xs={12}>
                <TextInput {...venueProps} />
              </Grid>
              <Grid item xs={12}>
                <AddressInput init={event.address} />
              </Grid>
              <Grid item xs={12}>
                <DateTimeInput
                  {...startDateTimeProps}
                  patterns={[validationDateIsValid, validationDateAfterNow]}
                />
              </Grid>
              <Grid item xs={12}>
                <DateTimeInput
                  {...endDateTimeProps}
                  patterns={[
                    validationDateIsValid,
                    validationDateAfterValue(startDateTimeValue),
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  {...endClientFirstNameProps}
                  patterns={[validationOnlyName]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  {...endClientLastNameProps}
                  patterns={[validationOnlyName]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  {...endClientEmailAddressProps}
                  patterns={[validationOnlyEmailAddress]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  {...endClientPhoneNumberProps}
                  patterns={[validationOnlyPhoneNumber]}
                />
              </Grid>
              <Grid item xs={6} marginTop={3}>
                <FileInput
                  handleFileData={handleFileData}
                  fileData={fileData}
                />
              </Grid>
              <Grid item xs={6} marginTop={3} textAlign="right">
                <ButtonLoading
                  color="error"
                  type="button"
                  label="Cancel"
                  variant="text"
                  disabled={isLoading}
                  onClick={() => {
                    handleOpen(false);
                  }}
                ></ButtonLoading>
                <ButtonLoading
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                  labelWhenLoading="Submitting"
                ></ButtonLoading>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </>
  );
}
