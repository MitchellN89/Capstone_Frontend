import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { useEffect, useState } from "react";
import EventCardV from "./Components/EventCardV";

export default function EventsV() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(null);
  const [trigger, setTrigger] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (eventServiceId) => {
    navigate(`/vendor/events/${eventServiceId}`);
  };

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

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      {/* <button onClick={handleTrigger}>refresh</button> */}
      <h1>Events</h1>

      <Grid container spacing={3}>
        <LoadingCard isLoading={isLoading} />
        {events &&
          events.map((event) => {
            return (
              <EventCardV
                handleClick={handleClick}
                eventServiceId={event.id}
                key={event.id}
              >
                {event.service.service}
              </EventCardV>
            );
          })}
      </Grid>
    </>
  );
}
