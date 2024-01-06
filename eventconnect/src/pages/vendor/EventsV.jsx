import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";

export default function EventsV() {
  // const [events, isLoadingEvents, handleTrigger] = useData("/events");
  const {
    state: events,
    dispatch: eventsDispatch,
    actions: eventsActions,
  } = useEventsEPContext();
  const { isLoading } = events;
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (isLoading) return;
    eventsDispatch({ type: "PROCESSING_REQUEST" });

    apiCall(`/events/${id}`, "delete")
      .then(() => {
        eventsDispatch({ type: "DELETE_EVENT", id });
      })
      .catch((err) => {
        eventsDispatch({ type: "REQUEST_FAILED", error: err });
        console.error(err);
      });
  };

  const handleClick = (id) => {
    if (isLoading) return;
    navigate(`/eventPlanner/${id}`);
  };

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      {/* <button onClick={handleTrigger}>refresh</button> */}
      <h1>Events</h1>

      <Grid container spacing={3}>
        <LoadingCard isLoading={isLoading} />
        {events.data &&
          events.data.map((event) => {
            return (
              <GridCard
                handleDelete={handleDelete}
                handleClick={handleClick}
                hasDelete
                id={event.id}
                key={event.id}
              >
                {event.eventName}
              </GridCard>
            );
          })}
        <CreateCard url="/eventplanner/createevent">CREATE EVENT</CreateCard>
      </Grid>
    </>
  );
}
