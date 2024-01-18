import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { useEffect, useState } from "react";

export default function ServiceRequestsV() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [queryParams, setQueryParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    let ignore = false;

    let queryString = "";
    if (Object.keys(queryParams).length) {
      queryString += "?";

      Object.keys(queryParams).forEach((key, index, array) => {
        queryString += `${key}=${queryParams[key]}`;
        if (index < array.length - 1) queryString += "&";
      });

      for (let param in queryParams) {
        queryString += `${param}=`;
      }
    }

    apiCall(`/serviceRequests${queryString}`)
      .then((result) => {
        if (!ignore) {
          setRequests(result.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
        }
      });

    let timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [queryParams, trigger]);

  const handleClick = (serviceRequestId) => {
    navigate(`/vendor/servicerequests/${serviceRequestId}`);
  };

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      {/* <button onClick={handleTrigger}>refresh</button> */}
      <button
        onClick={() => {
          setTrigger((curState) => !curState);
        }}
      >
        REFRESH
      </button>
      <h1>Service Requests</h1>

      <Grid container spacing={3}>
        <LoadingCard isLoading={isLoading} />
        {requests &&
          requests.map((request) => {
            return (
              <GridCard
                handleClick={handleClick}
                id={request.id}
                key={request.id}
              >
                {request.tags}
              </GridCard>
            );
          })}
        <CreateCard></CreateCard>
      </Grid>
    </>
  );
}
