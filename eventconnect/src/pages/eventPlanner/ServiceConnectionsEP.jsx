import { Grid, Paper } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { Navigate } from "react-router-dom";
import CardConnectionEP from "./Components/CardConnectionEP";
import HeaderStrip from "../../components/HeaderStrip";
import ButtonLogoBack from "../../components/Buttons/ButtonLogoBack";
import { Box } from "@mui/material";
import ButtonLogoRefresh from "../../components/Buttons/ButtonLogoRefresh";

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

  useEffect(() => {
    console.log(serviceConnections);
  }, [serviceConnections]);

  if (!serviceConnections) return;

  return (
    <>
      <Box>
        <HeaderStrip style={{ marginTop: "30px" }}>
          <Header1 style={{ margin: "0" }}>CONNECTIONS</Header1>
          <ButtonLogoRefresh handleClick={handleTrigger} />
        </HeaderStrip>

        {/* <Paper> */}
        <Grid container spacing={1}>
          <LoadingCard isLoading={isLoading} />
          {serviceConnections &&
            serviceConnections.map((serviceConnection) => {
              return (
                <CardConnectionEP
                  handleClick={handleClick}
                  key={serviceConnection.id}
                  id={serviceConnection.id}
                  vendorId={serviceConnection.vendorId}
                  companyName={serviceConnection.user.companyName}
                ></CardConnectionEP>
              );
            })}
        </Grid>
        {/* </Paper> */}
      </Box>
      {/* <button onClick={handleTrigger}>Refresh</button> */}
    </>
  );
}
