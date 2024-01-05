import { Grid, Paper } from "@mui/material";
import TextInput from "../../components/Inputs/TextInput";
import { useState } from "react";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { apiCall } from "../../utilities/apiCall";
import { convertFormDataToObject } from "../../utilities/formData";
import { useNavigate } from "react-router-dom";
import {
  useAddressInput,
  useSelectInput,
  useTextInput,
} from "../../hooks/useInputData";
import AddressInput from "../../components/Inputs/AddressInput";
import { useEventsEPContext } from "../../context/EventEPProvider";
import SelectInput from "../../components/Inputs/SelectInput";

export default function CreateEventEP() {
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext();
  const { isLoading } = events;

  const [serviceIdProps, isValidServiceId] = useSelectInput(
    "",
    "Service",
    "serviceId",
    "text"
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
    "eventName",
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
    eventsDispatch({ type: "PROCESSING_REQUEST" });
    try {
      const result = await apiCall("/events", "post", body);
      const { id: eventId } = result.data;

      eventsDispatch({
        type: "CREATE_EVENT",
        payload: result.data,
        response: result.response,
      });

      navigate(`/eventplanner/${eventId}`, { replace: true });
    } catch (err) {
      eventsDispatch({ type: "REQUEST_FAILED", error: err });
      console.error(err);
    }
  };

  return (
    <>
      <Header1>Services</Header1>
      <MaxWidthContainer maxWidth="lg" centered>
        <Paper>
          <Box padding={2}>
            <Box paddingX={5}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Header2>New Service</Header2>
                  </Grid>
                  <Grid item xs={12}>
                    <SelectInput {...serviceIdProps} required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput multiline rows={10} {...requestBodyProps} />
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
                    <TextInput {...specialRequirementsProps} />
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
