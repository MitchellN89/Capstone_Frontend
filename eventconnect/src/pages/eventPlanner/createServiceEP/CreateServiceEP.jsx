import { Grid, Paper } from "@mui/material";
import {
  ComboBox,
  TextValidationInput,
} from "../../../components/InputComponents";
import useInputData from "../../../hooks/useInputData";
import { useState } from "react";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../../components/TextComponents";
import { ButtonLoading } from "../../../components/Buttons";
import { apiCall } from "../../../utilities/apiCall";
import { convertFormDataToObject } from "../../../utilities/formData";
import { useNavigate } from "react-router-dom";
import AddressPicker from "../../../components/AddressPicker";

export default function CreateServiceEP() {
  const [eventNameValue, eventNameProps, notValidEventName, resetEventName] =
    useInputData("");

  const [addressValue, addressProps, notValidAddress, resetAddress] =
    useInputData("");

  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const isValidForm = () => {
    return new Promise((res) => {
      setTimeout(() => {
        res(
          [
            notValidAddress,
            notValidEndClientEmailAddress,
            notValidEndClientFirstName,
            notValidEndClientLastName,
            notValidEndClientPhoneNumber,
            notValidEventName,
          ].every((i) => i)
        );
      }, 250);
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    setIsLoading(true);

    const isValid = await isValidForm();
    if (isValid) return;

    const payload = convertFormDataToObject(new FormData(evt.target));

    await apiCall("/events", "post", payload)
      .then((newEvent) => {
        const { id: eventId } = newEvent.data;
        console.log("MARKER: Need success notifications");
        navigate(`/eventplanner/${eventId}`);
      })
      .catch((err) => {
        console.error(err);
        console.log("MARKER: Need error notifications");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <Header1>CREATE NEW EVENT</Header1>
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
                    <TextValidationInput
                      {...eventNameProps}
                      fullWidth
                      label="Event Name"
                      type="text"
                      name="eventName"
                      required
                      disabled={isLocked || isLoading}
                      patterns={[
                        {
                          type: "required",
                          value: /^[a-zA-Z0-9,\s'!\-]+$/,
                          message:
                            "Please use only standard letters, spaces, numbers, dashes, apostrophes and exclamation marks",
                          label: "lettersOnly",
                        },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextValidationInput
                      {...addressProps}
                      label="Address"
                      fullWidth
                      type="text"
                      name="address"
                      disabled={isLocked || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AddressPicker></AddressPicker>
                  </Grid>
                  <Grid textAlign="right" item xs={12}>
                    <ButtonLoading
                      color="error"
                      type="button"
                      variant="text"
                      disabled={isLocked || isLoading}
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      Cancel
                    </ButtonLoading>
                    <ButtonLoading
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLocked || isLoading}
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
