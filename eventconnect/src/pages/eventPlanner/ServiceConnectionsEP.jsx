import { Grid } from "@mui/material";
import LoadingCard from "../../components/LoadingCard";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Header1 } from "../../components/Texts/TextHeaders";
import CardConnectionEP from "./Components/CardConnectionEP";
import HeaderStrip from "../../components/HeaderStrip";
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

  if (!serviceConnections) return;

  return (
    <>
      <Box>
        <HeaderStrip>
          <Header1 style={{ margin: "0" }}>CONNECTIONS</Header1>
          <ButtonLogoRefresh handleClick={handleTrigger} />
        </HeaderStrip>

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
      </Box>
    </>
  );
}
