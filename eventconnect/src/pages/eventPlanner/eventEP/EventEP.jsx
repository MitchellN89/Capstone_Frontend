import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../context/UserProvider";
import useData from "../../../hooks/useData";
import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { Header1 } from "../../../components/TextComponents";
import { Header2 } from "../../../components/TextComponents";
import { apiCall } from "../../../utilities/apiCall";

import { Box, Paper } from "@mui/material";

export default function EventEP() {
  let { eventId } = useParams();
  const [trigger, setTrigger] = useState(true);
  const url = `/events/${eventId}`;
  const [event, isLoadingEvent] = useData(url, trigger);
  console.log("EVENT: ", event);
  const navigate = useNavigate();

  const handleDelete = async () => {
    apiCall(`/events/${eventId}`, "delete")
      .then(() => {
        console.log("MARKER: Need deleted notification");
        navigate("/eventplanner");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!event) return <></>;
  return (
    <>
      <Header1>{event.eventName}</Header1>

      <Paper>
        <Box padding={2}>
          <Grid container spacing={5} padding={2}>
            <Grid item xs={12} lg={5}>
              <Header2>{event.eventName}</Header2>
              <Typography>
                <b>Client:</b>{" "}
                {`${event.endClientFirstName} ${event.endClientLastName}`}
              </Typography>
              <Typography>{event.endClientEmailAddress}</Typography>
              <Typography>{event.endClientPhoneNumber}</Typography>
            </Grid>
            <Grid item xs={12} lg={7}>
              <h1>{event.eventName}</h1>
              <h2>{`${event.endClientFirstName} ${event.endClientLastName}`}</h2>
              <h3>{event.endClientEmailAddress}</h3>
              <h3>{event.endClientPhoneNumber}</h3>
            </Grid>
          </Grid>
          <button
            onClick={() => {
              navigate(`/eventplanner/${eventId}/editevent`, {
                state: event,
              });
            }}
          >
            EDIT EVENT
          </button>
          <button onClick={handleDelete}>DELETE EVENT</button>
        </Box>
      </Paper>
    </>
  );
}
