import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { useEffect, useState } from "react";

export default function EventsV() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(null);
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    apiCall(`/events`)
      .then((result) => {
        setEvents(result.data);
      })
      .catch((err) => {
        console.error(err);
      });

    const timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, [trigger]);

  useEffect(() => {
    if (events) console.log("EVENTS V, events: ", events);
  }, [events]);

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      {/* <button onClick={handleTrigger}>refresh</button> */}
      <h1>Events</h1>

      {/* <Grid container spacing={3}>
        <LoadingCard isLoading={isLoading} />
        {events.data &&
          events.data.map((event) => {
            return (
              <GridCard handleClick={handleClick} id={event.id} key={event.id}>
                {event.eventName}
              </GridCard>
            );
          })}
        <CreateCard url="/eventplanner/createevent">CREATE EVENT</CreateCard>
      </Grid> */}
    </>
  );
}
