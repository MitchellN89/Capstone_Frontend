import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { useEffect, useState } from "react";
import HeaderStrip from "../../components/HeaderStrip";
import { Header1 } from "../../components/Texts/TextHeaders";
import ButtonLogoRefresh from "../../components/Buttons/ButtonLogoRefresh";
import CardEventV from "./Components/CardRequestV";
import CardRequestV from "./Components/CardRequestV";

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
          console.log("REQUESTS: ", result);
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

  const handleTrigger = () => {
    setTrigger((trigger) => !trigger);
  };

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>SERVICE REQUESTS</Header1>
        <ButtonLogoRefresh handleClick={handleTrigger} />
      </HeaderStrip>

      <Grid container spacing={3} marginBottom={4}>
        <LoadingCard isLoading={isLoading} />
        {requests &&
          requests.map((request) => {
            return (
              <CardRequestV
                handleClick={handleClick}
                eventName={request.event.eventName}
                serviceName={request.service.service}
                eventId={request.event.id}
                eventServiceId={request.id}
                id={request.id}
                key={request.id}
              ></CardRequestV>
            );
          })}
      </Grid>
    </>
  );
}
