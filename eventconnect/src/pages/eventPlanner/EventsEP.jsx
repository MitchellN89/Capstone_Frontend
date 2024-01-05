import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";

export default function EventsEP() {
  // const [events, isLoadingEvents, handleTrigger] = useData("/events");
  const {
    state: events,
    dispatch: eventsDispatch,
    actions: eventsActions,
  } = useEventsEPContext();

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      {/* <button onClick={handleTrigger}>refresh</button> */}
      <h1>Events</h1>

      <Grid container spacing={3}>
        <LoadingCard isLoading={events.isLoading} />
        {events.data &&
          events.data.map((event) => {
            return (
              <GridCard
                // handleTrigger={handleTrigger}
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
