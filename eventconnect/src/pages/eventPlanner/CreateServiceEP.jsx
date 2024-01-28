import { Grid, Paper } from "@mui/material";
import TextInput from "../../components/Inputs/TextInput";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { apiCall } from "../../utilities/apiCall";
import { convertFormDataToObject } from "../../utilities/formData";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectInput, useTextInput } from "../../hooks/useInputData";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import SelectInput from "../../components/Inputs/SelectInput";
import { useEventsEPContext } from "../../context/EventEPProvider";

export default function CreateServiceEP({ handleOpen }) {
  const { state: services, dispatch: servicesDispatch } =
    useServicesEPContext();
  const { dispatch: eventDispatch } = useEventsEPContext();
  const { isLoading } = services;
  const { eventId } = useParams();
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

  const navigate = useNavigate();

  const options = services.services.filter((service) => {
    return !eventServices.some(
      (eventService) => eventService.serviceId == service.id
    );
  });

  const isValidForm = () => {
    return new Promise((res) => {
      setTimeout(() => {
        res(
          [
            isValidLogistics,
            isValidRequestBody,
            isValidServiceId,
            isValidSpecialRequirements,
            isValidTags,
            isValidVolumes,
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
    servicesDispatch({ type: "PROCESSING_REQUEST" });

    try {
      const result = await apiCall(`/events/${eventId}/services`, "post", body);
      const { id: eventServiceId } = result.data;

      const newEventService = { ...result.data, event: { id: eventId } };

      servicesDispatch({
        type: "CREATE_EVENT_SERVICE",
        payload: newEventService,
        response: result.response,
      });

      eventDispatch({
        type: "CREATE_EVENT_SERVICE",
        id: eventServiceId,
        eventId,
      });

      handleOpen(false);
    } catch (err) {
      servicesDispatch({ type: "REQUEST_FAILED", error: err });
      console.error(err);
    }
  };

  return (
    <>
      {/* <MaxWidthContainer maxWidth="lg" centered> */}
      <Paper>
        <Box padding={5}>
          <form onSubmit={handleSubmit}>
            <Header2>New Service</Header2>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <SelectInput {...serviceIdProps} options={options} required />
              </Grid>
              <Grid item xs={12}>
                <TextInput multiline {...requestBodyProps} />
              </Grid>
              <Grid item xs={12}>
                <TextInput {...tagsProps} />
              </Grid>
              <Grid item xs={12}>
                <TextInput {...volumesProps} />
              </Grid>
              <Grid item xs={12}>
                <TextInput {...logisticsProps} />
              </Grid>
              <Grid item xs={12}>
                <TextInput multiline {...specialRequirementsProps} />
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
      {/* </MaxWidthContainer> */}
    </>
  );
}
