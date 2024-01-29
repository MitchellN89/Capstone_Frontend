import { Grid, Paper } from "@mui/material";
import TextInput from "../../components/Inputs/TextInput";
import { Box } from "@mui/system";
import { Header2 } from "../../components/Texts/TextHeaders";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { apiCall } from "../../utilities/apiCall";
import { convertFormDataToObject } from "../../utilities/formData";
import { useParams } from "react-router-dom";
import { useSelectInput, useTextInput } from "../../hooks/useInputData";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import SelectInput from "../../components/Inputs/SelectInput";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNotification } from "../../context/NotificationProvider";

// For comments, see CreateEventEp.jsx - very similar code. slightly different process due to creating eventService instead of creating event.
// Limited comments below. Duplicates can be found in CreateEventEp.jsx

const allValid = (...inputs) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(inputs.every((input) => input));
    }, 250);
  });
};

export default function CreateServiceEP({ handleOpen }) {
  const { state: services, dispatch: servicesDispatch } =
    useServicesEPContext();
  const { dispatch: eventDispatch } = useEventsEPContext();
  const { isLoading } = services;
  const { eventId } = useParams();

  const { triggerNotification } = useNotification();

  // extracting exact eventService from eventServices context.
  const eventServices = services.eventServices.filter(
    (eventService) => eventService.eventId == eventId
  );

  const [serviceIdProps, isValidServiceId] = useSelectInput(
    "",
    "Service",
    "serviceId"
  );
  const [requestBodyProps, isValidRequestBody] = useTextInput(
    "",
    "Request Details",
    "requestBody",
    "text"
  );
  const [tagsProps, isValidTags] = useTextInput(
    "",
    "Tags",
    "tags",
    "text",
    "E.g. 'Kid's' Birthday'"
  );
  const [volumesProps, isValidVolumes] = useTextInput(
    "",
    "Volumes",
    "volumes",
    "text",
    "Capacity required for service. E.g. amount of people attending"
  );
  const [logisticsProps, isValidLogistics] = useTextInput(
    "",
    "Logistics",
    "logistics",
    "text",
    "E.g. 'Only available to setup on the previous day'"
  );
  const [specialRequirementsProps, isValidSpecialRequirements] = useTextInput(
    "",
    "Special Requirements",
    "specialRequirements",
    "text",
    "E.g. 'Vegan only foods'"
  );

  // extracting options from the services context in order to populate the SelectInput component
  const options = services.services.filter((service) => {
    // removes services that have already been used within the event
    return !eventServices.some(
      (eventService) => eventService.serviceId == service.id
    );
  });

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    // check inputs are valid
    const isValidForm = await allValid(
      isValidLogistics,
      isValidRequestBody,
      isValidServiceId,
      isValidSpecialRequirements,
      isValidTags,
      isValidVolumes
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

    // set dispatch to isLoading: true
    servicesDispatch({ type: "PROCESSING_REQUEST" });

    try {
      // make api call to back end to create new eventService
      const result = await apiCall(`/events/${eventId}/services`, "post", body);
      const { id: eventServiceId } = result.data; //extract id as eventServiceId from result

      const newEventService = { ...result.data, event: { id: eventId } }; //create a new object with the returned data for dispatch

      // set isLoading back to false and append new event service
      servicesDispatch({
        type: "CREATE_EVENT_SERVICE",
        payload: newEventService,
        response: result.response,
      });

      // also update event context with basic info on the eventService
      eventDispatch({
        type: "CREATE_EVENT_SERVICE",
        id: eventServiceId,
        eventId,
      });

      //send success message
      triggerNotification({
        message: "Successfully created new event service",
      });

      // close the modal
      handleOpen(false);
    } catch (err) {
      // set isLoading back to false and send error message

      servicesDispatch({ type: "REQUEST_FAILED", error: err });
      triggerNotification({
        message:
          "Server error detected. For more details, please see console log",
        severity: "error",
      });
      console.error(err);
    }
  };

  return (
    <>
      <Paper>
        <Box padding={5}>
          <form onSubmit={handleSubmit}>
            <Header2>New Service</Header2>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <SelectInput
                  {...serviceIdProps}
                  options={options}
                  disabled={isLoading}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  multiline
                  disabled={isLoading}
                  {...requestBodyProps}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput disabled={isLoading} {...tagsProps} />
              </Grid>
              <Grid item xs={12}>
                <TextInput disabled={isLoading} {...volumesProps} />
              </Grid>
              <Grid item xs={12}>
                <TextInput disabled={isLoading} {...logisticsProps} />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  disabled={isLoading}
                  multiline
                  {...specialRequirementsProps}
                />
              </Grid>

              <Grid textAlign="right" item xs={12} marginTop={3}>
                <ButtonLoading
                  color="error"
                  type="button"
                  variant="text"
                  disabled={isLoading}
                  label="Cancel"
                  onClick={() => {
                    handleOpen(false);
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
      </Paper>
    </>
  );
}
