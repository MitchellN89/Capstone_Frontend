import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useEffect, useState } from "react";

export default function EventV() {
  let { serviceRequestId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    apiCall(`/events/${serviceRequestId}`)
      .then((result) => {
        setEvent(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [trigger]);

  return (
    <>
      <Header1>VENDOR EVENT</Header1>
      <Paper>
        <Box padding={2}>
          {/* <Grid container spacing={5} padding={2}>
            <Grid item xs={12} lg={5}>
              <Header2>{event.eventName || ""}</Header2>
              <Typography>
                <b>Client:</b>{" "}
                {`${event.endClientFirstName || ""} ${
                  event.endClientLastName || ""
                }`}
              </Typography>
              <Typography>{event.endClientEmailAddress || ""}</Typography>
              <Typography>{event.endClientPhoneNumber || ""}</Typography>
            </Grid>
          </Grid> */}
        </Box>
      </Paper>
      {/* chatbox here */}
    </>
  );
}
