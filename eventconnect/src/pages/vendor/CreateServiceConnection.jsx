import { useState } from "react";
import TextInput from "../../components/Inputs/TextInput";
import { Grid } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import { Paper, Box } from "@mui/material";
import { useTextInput } from "../../hooks/useInputData";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { IconSend } from "../../components/Icons";
import { convertFormDataToObject } from "../../utilities/formData";
import { apiCall } from "../../utilities/apiCall";
import { useParams } from "react-router-dom";

export default function CreateServiceConnection({
  handleTrigger,
  serviceRequestId,
  eventPlannerId,
  handleOpen,
}) {
  const [responseOptionValue, setResponseOptionValue] = useState("connect");
  const [messageProps, isValidMessage] = useTextInput(
    "",
    "Message",
    "message",
    "text",
    "Introduce yourself and your services. Express your interest and ask for some more information in order for you to get the ball rolling!"
  );

  const isValidForm = () => {
    return new Promise((res) => {
      setTimeout(() => {
        res([].every((i) => i));
      }, 250);
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const isValid = await isValidForm();
    if (!isValid) return;

    let body = convertFormDataToObject(new FormData(evt.target));
    const { vendorStatus } = body;

    if (vendorStatus == "connect") {
      handleConnect(body);
    } else if (vendorStatus == "ignore") {
      handleIgnore();
    }
  };

  const handleConnect = async (body) => {
    try {
      await apiCall(`/serviceRequests/${serviceRequestId}/connect`, "post", {
        ...body,
        eventPlannerId,
      });

      handleTrigger();
      handleOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIgnore = () => {};

  const handleResponseOptionChange = (evt) => {
    setResponseOptionValue(evt.target.value);
  };

  return (
    <>
      <Paper>
        <Box padding={5}>
          <form onSubmit={handleSubmit}>
            <Header2>Respond To Event Request</Header2>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextInput
                  {...messageProps}
                  multiline
                  disabled={
                    responseOptionValue == "ignore" ||
                    responseOptionValue == "watchlist"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Response Type
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="vendorStatus"
                    value={responseOptionValue}
                    onChange={handleResponseOptionChange}
                  >
                    <FormControlLabel
                      value="connect"
                      control={<Radio />}
                      label="Connect to Service Request"
                    />
                    <FormControlLabel
                      value="ignore"
                      control={<Radio />}
                      label="Ignore Service Request"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <ButtonLoading
                  type="submit"
                  icon={<IconSend />}
                ></ButtonLoading>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </>
  );
}
