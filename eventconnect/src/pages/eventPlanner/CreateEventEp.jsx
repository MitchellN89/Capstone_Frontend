import { Grid, Paper } from "@mui/material";
import TextInput from "../../components/Inputs/TextInput";
import { useState } from "react";
import { Box } from "@mui/system";
import { Header2 } from "../../components/Texts/TextHeaders";
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
import { useEventsEPContext } from "../../context/EventEPProvider";
import DateTimeInput from "../../components/Inputs/DateTimeInput";
import { useNotification } from "../../context/NotificationProvider";
import AddressInput from "../../components/Inputs/AddressInput";
import FileInput from "../../components/Inputs/FileInput";
import { formatImageForJSON } from "../../utilities/imageFormatter";

const allValid = (...inputs) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(inputs.every((input) => input));
    }, 250);
  });
};

export default function CreateEventEP({ handleOpen }) {
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext();
  const { isLoading } = events;
  const { triggerNotification } = useNotification();
  const [fileData, setFileData] = useState(null);
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
      let imageUpload;
      if (fileData) {
        imageUpload = await formatImageForJSON(fileData);
      }

      if (imageUpload) body.imageUpload = imageUpload;

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
            <Header2>Create New Event</Header2>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextInput {...eventNameProps} required />
              </Grid>
              <Grid item xs={12}>
                <TextInput {...venueProps} />
              </Grid>
              <Grid item xs={12}>
                <AddressInput />
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
