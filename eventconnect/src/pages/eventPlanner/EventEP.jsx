import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useEventsEPContext } from "../../context/EventEPProvider";

export default function EventEP() {
  let { eventId } = useParams();
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext();
  console.log("EVENTs: ", events.data);
  const navigate = useNavigate();
  console.log("EventEP > Context(Events).data: ", events.data);
  console.log("EventEP > Params(eventId): ", typeof eventId);

  const event = events.data.find((event) => {
    return event.id == eventId;
  });

  const handleDelete = async () => {
    eventsDispatch({ type: "PROCESSING_REQUEST" });
    apiCall(`/events/${eventId}`, "delete")
      .then(() => {
        console.log("MARKER: Need deleted notification");
        eventsDispatch({ type: "DELETE_EVENT", id: eventId });
        navigate("/eventplanner", { replace: true });
      })
      .catch((err) => {
        console.error(err);
        eventsDispatch({ type: "REQUEST_FAILED", error: err });
      });
  };

  if (!event)
    return (
      <>
        <h1>Can't find it</h1>
      </>
    );
  return (
    <>
      <Header1>{event.eventName}</Header1>
      <button
        onClick={() => {
          navigate("/eventPlanner");
        }}
      >
        Go Back
      </button>
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
              navigate(`/eventplanner/${eventId}/editevent`);
            }}
          >
            EDIT EVENT
          </button>
          <button onClick={handleDelete}>DELETE EVENT</button>
        </Box>
      </Paper>
      <Outlet />
    </>
  );
}
