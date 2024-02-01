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

// as in CreateEventEP.jsx, the below functions are passed into the inputs through the patterns prop. This allows for validation for data.
import {
  validationDateAfterNow,
  validationDateAfterValue,
  validationDateIsValid,
  validationOnlyEmailAddress,
  validationOnlyName,
  validationOnlyPhoneNumber,
} from "../../utilities/textValidation";

// for comments, see EditServiceEP.jsx. Code is very similiar. Few differences due to data being updated
// some basic notes below

export default function EditEventEP({ handleOpen }) {
  const { eventId } = useParams(); //get the eventId from the url params
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext(); //destructure EventsEPContext
  const { isLoading } = events; // get isLoading from events

  // get THIS event from events context by using eventId from the params
  const event = events.events.find((event) => eventId == event.id);
  const navigate = useNavigate();

  // fileData for image upload. See CreateEventEP.jsx for more info
  const [fileData, setFileData] = useState(null);
  const { triggerNotification } = useNotification();

  if (!event) {
    // send error message
    triggerNotification({
      message: "Event cannot be found, it may have been deleted",
      severity: "error",
    });

    //close modal
    handleOpen(false);
  }

  // hook to handle input props, values, reset etc
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

  // function accepts an array of values. If all values equate to true, true is returned.
  // timeOut is used due to the nature of the debouncer function which validates input data.
  // promise is used so that the function can be awaited synchronously
  const allValid = (...inputs) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(inputs.every((input) => input));
      }, 250);
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    //check inputs are valid
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

    //if not, send error message and escape out of the handleSubmit
    if (!isValidForm) {
      triggerNotification({
        message: "Please make sure all fields contain valid data",
        severity: "error",
      });
      return;
    }

    //convert formdata to object
    let body = convertFormDataToObject(new FormData(evt.target));

    // convert dates within object to valid dates ready for MySQL
    body = convertDatesToValid(
      body,
      "Date",
      "DD MMMM YYYY hh:mm a",
      "YYYY/MM/DD HH:mm"
    );

    // tell eventsDispatch to set isLoading to true
    eventsDispatch({ type: "PROCESSING_REQUEST" });

    try {
      // handling image upload. for more info, see CreateEvent.jsx
      let imageUpload;
      if (fileData) {
        imageUpload = await formatImageForJSON(fileData);
      }

      if (imageUpload) body.imageUpload = imageUpload;

      // api call to edit event
      const result = await apiCall(`/events/${eventId}`, "put", body);

      // update dispatch state to reflect new changes and set isLoading to false
      eventsDispatch({
        type: "UPDATE_EVENT",
        payload: body,
        id: eventId,
        response: result.response,
      });

      // send success message
      triggerNotification({
        message: "Successfully edited Event",
      });

      // close modal
      handleOpen(false);
    } catch (err) {
      // get dispatch to change isLoading back to false.
      eventsDispatch({ type: "REQUEST_FAILED", error: err });

      //send error message
      triggerNotification({
        message: "Server error. For more details, see log",
        severity: "error",
      });

      console.error(err);
    }
  };

  //handles fileData change (when the user chooses a file from the upload button)
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
                <TextInput {...eventNameProps} disabled={isLoading} required />
              </Grid>
              <Grid item xs={12}>
                <TextInput disabled={isLoading} {...venueProps} />
              </Grid>
              <Grid item xs={12}>
                <AddressInput disabled={isLoading} init={event.address} />
              </Grid>
              <Grid item xs={12}>
                <DateTimeInput
                  {...startDateTimeProps}
                  disabled={isLoading}
                  patterns={[validationDateIsValid, validationDateAfterNow]}
                />
              </Grid>
              <Grid item xs={12}>
                <DateTimeInput
                  {...endDateTimeProps}
                  disabled={isLoading}
                  patterns={[
                    validationDateIsValid,
                    validationDateAfterValue(startDateTimeValue),
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  {...endClientFirstNameProps}
                  disabled={isLoading}
                  patterns={[validationOnlyName]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  {...endClientLastNameProps}
                  disabled={isLoading}
                  patterns={[validationOnlyName]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  {...endClientEmailAddressProps}
                  disabled={isLoading}
                  patterns={[validationOnlyEmailAddress]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  {...endClientPhoneNumberProps}
                  disabled={isLoading}
                  patterns={[validationOnlyPhoneNumber]}
                />
              </Grid>
              <Grid item xs={6} marginTop={3}>
                <FileInput
                  handleFileData={handleFileData}
                  disabled={isLoading}
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
