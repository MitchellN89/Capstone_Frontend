import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { useState, useEffect } from "react";

export default function ServiceConnectionsEP() {
  const [serviceConnections, setServiceConnections] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { eventId, eventServiceId } = useParams();

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    apiCall(`/events/${eventId}/services/${eventServiceId}/connections`)
      .then((result) => {
        if (!ignore) {
          setServiceConnections(result.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    const timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000 * 5);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [trigger]);

  useEffect(
    (err) => {
      console.log(serviceConnections);
    },
    [serviceConnections]
  );

  return (
    <>
      <button
        onClick={() => {
          setTrigger((curState) => !curState);
        }}
      >
        Refresh
      </button>
      <h1>Service Connections</h1>

      <Grid container spacing={3}>
        <LoadingCard isLoading={isLoading} />
      </Grid>
    </>
  );
}
