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
import { useEffect } from "react";

export default function EditServiceEP({ handleOpen }) {
  const { state: services, dispatch: servicesDispatch } =
    useServicesEPContext();
  const { isLoading } = services;
  const { eventId, eventServiceId } = useParams();

  const eventServices = services.eventServices.filter(
    (eventService) => eventService.eventId == eventId
  );

  const eventService = eventServices.find(
    (eventService) => eventService.id == eventServiceId
  );

  useEffect(() => {
    console.log("EditServiceEP.jsx > eventService: ", eventService);
  }, [eventService]);

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

  const navigate = useNavigate();

  const options = services.services.filter((service) => {
    const thisEventServiceId = eventService.id;
    return !eventServices.some(
      (eventService) =>
        eventService.serviceId == service.id &&
        eventService.id !== thisEventServiceId
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
      const result = await apiCall(
        `/events/${eventId}/services/${eventServiceId}`,
        "put",
        body
      );
      // const { id: eventServiceId } = result.data;
      servicesDispatch({
        type: "UPDATE_EVENT_SERVICE",
        payload: body,
        response: result.response,
        id: eventServiceId,
      });

      handleOpen(false);
    } catch (err) {
      servicesDispatch({ type: "REQUEST_FAILED", error: err });
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
                <SelectInput {...serviceIdProps} options={options} readOnly />
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
