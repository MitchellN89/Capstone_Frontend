import { Grid, Paper } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { useState, useEffect } from "react";
import { Header2 } from "../../components/Texts/TextHeaders";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { Navigate } from "react-router-dom";
import ServiceConnectionCardEP from "./Components/ServiceConnectionCardEP";

export default function ServiceConnectionsEP({
  serviceConnections,
  handleSelectedVendorId,
  handleTrigger,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { eventId, eventServiceId } = useParams();

  const handleClick = (vendorId) => {
    handleSelectedVendorId(vendorId);
  };

  if (!serviceConnections) return;

  return (
    <>
      <button onClick={handleTrigger}>Refresh</button>
      <h1>Service Connections</h1>

      <Grid container spacing={3}>
        <LoadingCard isLoading={isLoading} />
        {serviceConnections &&
          serviceConnections.map((serviceConnection) => {
            return (
              <ServiceConnectionCardEP
                handleClick={handleClick}
                key={serviceConnection.id}
                id={serviceConnection.id}
                vendorId={serviceConnection.vendorId}
              >
                {serviceConnection.user.companyName ||
                  `${serviceConnection.user.firstName} ${serviceConnection.user.lastName}`}
              </ServiceConnectionCardEP>
            );
          })}
      </Grid>
    </>
  );
}
