import { Grid } from "@mui/material";
import LoadingCard from "../../components/LoadingCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header1 } from "../../components/Texts/TextHeaders";
import CardConnectionEP from "./Components/CardConnectionEP";
import HeaderStrip from "../../components/HeaderStrip";
import { Box } from "@mui/material";
import ButtonLogoRefresh from "../../components/Buttons/ButtonLogoRefresh";
import { useChatEntryContext } from "../../context/ChatEntryProvider";

export default function ServiceConnectionsEP({
  serviceConnections,
  handleSelectedVendorId,
  handleTrigger,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { state: chatEntryContext } = useChatEntryContext();
  const { chatEntries } = chatEntryContext || {};
  const { eventId, eventServiceId } = useParams();

  useEffect(() => {
    console.log(
      "ServiceConnectionsEP.jsx > serviceConnections: ",
      serviceConnections
    );
  }, [serviceConnections]);

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
              if (serviceConnection.vendorStatus == "ignore") return;

              const chatQuantity = chatEntries.filter((entry) => {
                return entry.vendorEventConnection.id == serviceConnection.id;
              }).length;

              return (
                <CardConnectionEP
                  handleClick={handleClick}
                  key={serviceConnection.id}
                  id={serviceConnection.id}
                  vendorId={serviceConnection.vendorId}
                  companyName={serviceConnection.user.companyName}
                  chatQuantity={chatQuantity}
                ></CardConnectionEP>
              );
            })}
        </Grid>
      </Box>
    </>
  );
}
