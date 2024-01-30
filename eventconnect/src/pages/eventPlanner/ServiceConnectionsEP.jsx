import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { Header1 } from "../../components/Texts/TextHeaders";
import CardConnectionEP from "./Components/CardConnectionEP";
import HeaderStrip from "../../components/HeaderStrip";
import { Box } from "@mui/material";
import ButtonLogoRefresh from "../../components/Buttons/ButtonLogoRefresh";
import { useChatEntryContext } from "../../context/ChatEntryProvider";
import { useNotification } from "../../context/NotificationProvider";
import { useNavigate } from "react-router-dom";

export default function ServiceConnectionsEP({
  serviceConnections,
  handleSelectedVendorId,
  handleTrigger,
}) {
  const { state: chatEntryContext } = useChatEntryContext();
  const { chatEntries } = chatEntryContext || {};
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleClick = (vendorId) => {
    // sets the selectVendorId in parent component to vendorId, thus causing this component to unmount and the feature component to mount in it's place
    handleSelectedVendorId(vendorId);
  };

  //handle initial load
  if (!serviceConnections) return;

  return (
    <>
      <Box>
        <HeaderStrip>
          <Header1 style={{ margin: "0" }}>CONNECTIONS</Header1>
          {/* Button below causes parent to rerun it's useEffect and provide fresh data */}
          <ButtonLogoRefresh handleClick={handleTrigger} />
        </HeaderStrip>

        <Grid container spacing={1}>
          {/* iterate over service connections and display as cards */}
          {serviceConnections &&
            serviceConnections.map((serviceConnection) => {
              if (serviceConnection.vendorStatus == "ignore") return;

              // get unread messages from chat context relating to this service connection
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
