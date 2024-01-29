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
import { useTextInput, useDateTimeInput } from "../../hooks/useInputData";
import { useEventsEPContext } from "../../context/EventEPProvider";
import DateTimeInput from "../../components/Inputs/DateTimeInput";
import { useNotification } from "../../context/NotificationProvider";
import AddressInput from "../../components/Inputs/AddressInput";
import FileInput from "../../components/Inputs/FileInput";
import { formatImageForJSON } from "../../utilities/imageFormatter";
// functions below are to be passed into the patterns prop of each input which helps validate the data on certain criteria
import {
  validationDateAfterNow,
  validationDateIsValid,
  validationOnlyEmailAddress,
  validationOnlyName,
  validationOnlyPhoneNumber,
  validationDateAfterValue,
} from "../../utilities/textValidation";

// function accepts array of values. returns promise which resolves after timeout. If all values are true, resolves true.
// promise required so that an await can be used on this function to accomodate the 250ms timeout. timeout is due to validation debouncer.
// the user should not be allowed to submit the form until the debouncer validates the inputs
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

  // custom hooks below to handle input props, value and reset etc.
  const [eventNameProps, isValidEventName] = useTextInput(
    "",
    "Event Name",
    "eventName",
    "text"
  );
  const [startDateTimeProps, isValidStartDateTime, , startDateTimeValue] =
    useDateTimeInput(undefined, "Start Date/Time", "startDateTime");
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

    // check inputs are valid
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

    // if not, send error message and escape handleSubmit
    if (!isValidForm) {
      triggerNotification({
        message: "Please make sure all fields contain valid data",
        severity: "error",
      });
      return;
    }

    //convert formdata to object
    let body = convertFormDataToObject(new FormData(evt.target));

    // convert dates in object to certain format (for backend / mysql )
    body = convertDatesToValid(
      body,
      "Date",
      "DD MMMM YYYY hh:mm a",
      "YYYY/MM/DD HH:mm"
    );

    // tell eventsDispatch to set isLoading to true
    eventsDispatch({ type: "PROCESSING_REQUEST" });

    try {
      let imageUpload; //create an empty variable to hold the uploaded image file

      if (fileData) {
        //if a file has been uploaded via the upload input button
        // get the base64 encoded data of the image as a string and store it in imageUpload
        imageUpload = await formatImageForJSON(fileData);
      }

      //if valid, append it to the body to send to backend
      if (imageUpload) body.imageUpload = imageUpload;

      // do api call to backend and send body (with imageUpload if applicable). store response in result.
      const result = await apiCall("/events", "post", body);
      const { id: eventId } = result.data; // extract id as eventId

      // append the new event to the events context and return isLoading back to false
      eventsDispatch({
        type: "CREATE_EVENT",
        payload: result.data,
        response: result.response,
      });

      //send success message
      triggerNotification({
        message: "Successfully created new Event",
      });

      // naviage to the newly created event
      navigate(`/eventplanner/${eventId}`);
    } catch (err) {
      // set isLoading back to false
      eventsDispatch({ type: "REQUEST_FAILED", error: err });

      // send error message
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

  // handles change of filedata
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
                <TextInput {...eventNameProps} disabled={isLoading} required />
              </Grid>
              <Grid item xs={12}>
                <TextInput {...venueProps} disabled={isLoading} />
              </Grid>
              <Grid item xs={12}>
                <AddressInput disabled={isLoading} />
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
