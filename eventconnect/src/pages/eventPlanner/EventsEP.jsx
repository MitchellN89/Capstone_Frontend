import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";

export default function EventsEP() {
  const [events, isLoadingEvents, handleTrigger] = useData("/events");
  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      <h1>Events</h1>
      <Grid container spacing={3}>
        {events &&
          events.map((event) => {
            return (
              <GridCard
                handleTrigger={handleTrigger}
                hasDelete
                id={event.id}
                key={event.id}
              >
                {event.eventName}
              </GridCard>
            );
          })}
        <CreateCard url="/eventplanner/createevent"></CreateCard>
      </Grid>
    </>
  );
}
