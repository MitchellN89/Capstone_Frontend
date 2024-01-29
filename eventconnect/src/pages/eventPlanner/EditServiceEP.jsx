import { Grid, Paper } from "@mui/material";
import TextInput from "../../components/Inputs/TextInput";
import { Box } from "@mui/system";
import { Header2 } from "../../components/Texts/TextHeaders";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { apiCall } from "../../utilities/apiCall";
import { convertFormDataToObject } from "../../utilities/formData";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectInput, useTextInput } from "../../hooks/useInputData";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import SelectInput from "../../components/Inputs/SelectInput";
import { useNotification } from "../../context/NotificationProvider";

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

export default function EditServiceEP({ handleOpen }) {
  // extract state and dispatch from useServicesEPContext
  const { state: services, dispatch: servicesDispatch } =
    useServicesEPContext();

  // extract isLoading from services
  const { isLoading } = services;
  const { eventId, eventServiceId } = useParams();

  const { triggerNotification } = useNotification();

  // extract eventServices that relate to this event
  const eventServices = services.eventServices.filter(
    (eventService) => eventService.eventId == eventId
  );

  //extract one eventService (currently on)
  const eventService = eventServices.find(
    (eventService) => eventService.id == eventServiceId
  );

  if (!eventService) {
    // send error message
    triggerNotification({
      message: "Event Service cannot be found, it may have been deleted",
      severity: "error",
    });

    //close modal
    handleOpen(false);
  }

  // hook to handle props, values and reset etc
  const [serviceIdProps, isValidServiceId] = useSelectInput(
    eventService.serviceId || "",
    "Service",
    "serviceId",
    "text"
  );
  const [requestBodyProps, isValidRequestBody] = useTextInput(
    eventService.requestBody || "",
    "Request Details",
    "requestBody",
    "text"
  );
  const [tagsProps, isValidTags] = useTextInput(
    eventService.tags || "",
    "Tags",
    "tags",
    "text",
    "E.g. 'Kid's' Birthday'"
  );
  const [volumesProps, isValidVolumes] = useTextInput(
    eventService.volumes || "",
    "Volumes",
    "volumes",
    "text",
    "Capacity required for service. E.g. amount of people attending"
  );
  const [logisticsProps, isValidLogistics] = useTextInput(
    eventService.logistics || "",
    "Logistics",
    "logistics",
    "text",
    "E.g. 'Only available to setup on the previous day'"
  );
  const [specialRequirementsProps, isValidSpecialRequirements] = useTextInput(
    eventService.specialRequirements || "",
    "Special Requirements",
    "specialRequirements",
    "text",
    "E.g. 'Vegan only foods'"
  );

  //extract services from context
  const options = services.services.filter((service) => {
    // remove out services that have already been used in event
    const thisEventServiceId = eventService.id;
    return !eventServices.some(
      (eventService) =>
        eventService.serviceId == service.id &&
        eventService.id !== thisEventServiceId
    );
  });

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    //check inputs are valid
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
    const body = convertFormDataToObject(new FormData(evt.target));

    //tell eventServices to set isLoading to true
    servicesDispatch({ type: "PROCESSING_REQUEST" });

    try {
      //api call to edit event service, passing in body (the formdata)
      const result = await apiCall(
        `/events/${eventId}/services/${eventServiceId}`,
        "put",
        body
      );

      triggerNotification({ message: "Successfully edited event service" });

      // updated event service context with updated data
      servicesDispatch({
        type: "UPDATE_EVENT_SERVICE",
        payload: body,
        response: result.response,
        id: eventServiceId,
      });

      //close modal
      handleOpen(false);
    } catch (err) {
      // on error, set isLoading back to false & send error message
      servicesDispatch({ type: "REQUEST_FAILED", error: err });
      triggerNotification({
        message:
          "Error during event service update. For more info, see console log",
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
            <Grid container spacing={1}>
              <Header2>Edit Service</Header2>
              <Grid item xs={12}>
                <SelectInput
                  {...serviceIdProps}
                  disabled={isLoading}
                  options={options}
                  readOnly
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
                ></ButtonLoading>
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
