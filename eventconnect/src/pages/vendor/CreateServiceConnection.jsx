import { useState } from "react";
import TextInput from "../../components/Inputs/TextInput";
import { Grid } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Header2 } from "../../components/Texts/TextHeaders";
import { useNotification } from "../../context/NotificationProvider";
import { Paper, Box } from "@mui/material";
import { useTextInput } from "../../hooks/useInputData";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { IconSend } from "../../components/Icons";
import { convertFormDataToObject } from "../../utilities/formData";
import { apiCall } from "../../utilities/apiCall";
import { useNavigate } from "react-router-dom";

export default function CreateServiceConnection({
  handleTrigger,
  serviceRequestId,
  eventPlannerId,
  handleOpen,
}) {
  const [responseOptionValue, setResponseOptionValue] = useState("connect"); // handles the radio buttons value
  const { triggerNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  // hook to handle input props
  const [messageProps] = useTextInput(
    "",
    "Message",
    "message",
    "text",
    "Introduce yourself and your services. Express your interest and ask for some more information in order for you to get the ball rolling!"
  );
  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    // convert form data to object
    let body = convertFormDataToObject(new FormData(evt.target));

    // route to the correct function depending on the radio button status
    if (vendorStatus == "connect") {
      handleConnect(body);
    } else if (vendorStatus == "ignore") {
      handleIgnore();
    }
  };

  const handleConnect = async (body) => {
    setIsLoading(true);
    try {
      // api call to set vendorStatus to "connect" implying they've actively expressed interest in the event service
      // also send a message and update chat entries
      await apiCall(`/serviceRequests/${serviceRequestId}/connect`, "post", {
        ...body,
        eventPlannerId,
      });

      // force data refresh
      // this fetches the chat entry data and converts
      handleTrigger();

      //close modal
      handleOpen(false);

      //send success message
      triggerNotification({
        message: "Successfully connected to service request",
      });
    } catch (err) {
      triggerNotification({
        message:
          "Error while connecting to service request. For more info, see console log",
        severity: "error",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIgnore = () => {
    try {
      // api call to set vendorStatus to ignore implying the vendor is not interested in this event service
      apiCall(`/serviceRequests/${serviceRequestId}/ignore`, "post");
      //send success message and navigate back
      triggerNotification({
        message: "Successfully ignored service request",
      });
      navigate("/vendor/serviceRequests");
    } catch (err) {
      // on error, send error message
      triggerNotification({
        message:
          "Error while ignoring service request. For more info, see console log",
      });
      console.error(err);
    }
  };

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
                  disabled={responseOptionValue == "ignore"}
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
                    disabled={isLoading}
                  >
                    <FormControlLabel
                      value="connect"
                      control={<Radio />}
                      label="Connect to Service Request"
                      disabled={isLoading}
                    />
                    <FormControlLabel
                      value="ignore"
                      control={<Radio />}
                      label="Ignore Service Request"
                      disabled={isLoading}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <ButtonLoading
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
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
