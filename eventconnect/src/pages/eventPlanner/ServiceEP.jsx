import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { useEffect, useState } from "react";
import ServiceConnectionsEP from "./ServiceConnectionsEP";
import ServiceConnectionEp from "./ServiceConnectionEP";
import useLiveChat from "../../hooks/useLiveChat";

export default function ServiceEP() {
  let { eventId, eventServiceId } = useParams();
  const { state: services, dispatch: servicesDispatch } =
    useServicesEPContext();
  const eventService = services.eventServices.find((eventService) => {
    return eventService.id == eventServiceId;
  });

  console.log("ServiceEP.jsx > eventService: ", eventService);

  if (!eventService) return;

  const [trigger, setTrigger] = useState(true);
  const [isFormComplete, setIsFormComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceConnections, setServiceConnections] = useState(null);
  const [serviceConnection, setServiceConnection] = useState(null);
  const vendorId = eventService.vendorId || null;
  const [selectedVendorId, setSelectedVendorId] = useState(vendorId);

  const connectedWithUser = serviceConnection ? serviceConnection.user : null;
  const roomId = serviceConnection ? serviceConnection.id : null;

  const [liveChatProps, dispatchLiveChat] = useLiveChat(
    connectedWithUser,
    roomId
  );

  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    let timer;

    // Get service connections
    if (!selectedVendorId) {
      setIsLoading(true);

      apiCall(`/events/${eventId}/services/${eventServiceId}/connections`)
        .then((result) => {
          if (!ignore) {
            console.log("ServiceEp.jsx > get service events: ", result);

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
    }

    // Get ONE Service Connection
    if (selectedVendorId) {
      apiCall(
        `/events/${eventId}/services/${eventServiceId}/connections/vendor/${selectedVendorId}`
      )
        .then((result) => {
          const { chatEntries } = result.data;

          dispatchLiveChat({ type: "SET_ENTRIES", payload: chatEntries });

          const serviceConnectionWithoutChatEntries = { ...result.data };
          delete serviceConnectionWithoutChatEntries.chatEntries;

          setServiceConnection(serviceConnectionWithoutChatEntries);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [selectedVendorId, trigger]);

  const handleSelectedVendorId = (vendorId) => {
    setSelectedVendorId(vendorId);
  };

  const resetSelectedVendorId = () => {
    setSelectedVendorId(vendorId);
  };

  const handleDelete = async () => {
    servicesDispatch({ type: "PROCESSING_REQUEST" });
    apiCall(`/events/${eventId}/services/${eventServiceId}`, "delete")
      .then(() => {
        servicesDispatch({ type: "DELETE_EVENT_SERVICE", id: eventServiceId });
        navigate(`/eventplanner/${eventId}`, {
          replace: true,
        });
      })
      .catch((err) => {
        console.error(err);
        servicesDispatch({ type: "REQUEST_FAILED", error: err });
      });
  };

  const enableBroadcast = () => {
    if (!isFormComplete) return;
    servicesDispatch({ type: "PROCESSING_REQUEST" });
    apiCall(
      `/events/${eventId}/services/${eventServiceId}/broadcast/enable`,
      "patch"
    )
      .then(() => {
        servicesDispatch({
          type: "ENABLE_BROADCAST",
          id: eventServiceId,
          payload: true,
        });
      })
      .catch(() => {
        servicesDispatch({ type: "REQUEST_FAILED" });
      });
  };

  const handleTrigger = () => {
    setTrigger((curState) => !curState);
  };

  if (!eventService) return;

  const {
    broadcast,
    requestBody,
    volumes,
    tags,
    logistics,
    specialRequirements,
  } = eventService;

  const title = services.services.find(
    (service) => service.id == eventService.serviceId
  ).service;

  return (
    <>
      <Header1>Services &gt; {title}</Header1>
      <button
        onClick={() => {
          navigate(`/eventPlanner/${eventService.event.id}`);
        }}
      >
        Go Back
      </button>
      <Paper>
        <Box padding={2}>
          <Grid container spacing={5} padding={2}>
            <Grid item xs={12} lg={5}>
              <Header2>{title || ""}</Header2>
              <Typography>{requestBody || ""}</Typography>
              <Typography>{volumes || ""}</Typography>
              <Typography>{tags || ""}</Typography>
              <Typography>{logistics || ""}</Typography>
              <Typography>{specialRequirements || ""}</Typography>
            </Grid>
          </Grid>
          <button
            onClick={() => {
              navigate(
                `/eventplanner/${eventId}/${eventServiceId}/editservice`
              );
            }}
          >
            EDIT EVENT
          </button>
          <button onClick={handleDelete}>DELETE EVENT SERVICE</button>
          <button disabled={!isFormComplete} onClick={enableBroadcast}>
            {broadcast ? "Broadcasting" : "Broadcast"}
          </button>
        </Box>
      </Paper>

      {!selectedVendorId && (
        <ServiceConnectionsEP
          serviceConnections={serviceConnections}
          handleSelectedVendorId={handleSelectedVendorId}
          handleTrigger={handleTrigger}
        />
      )}
      {selectedVendorId && (
        <ServiceConnectionEp
          resetSelectedVendorId={resetSelectedVendorId}
          liveChatProps={liveChatProps}
          serviceConnection={serviceConnection}
          handleTrigger={handleTrigger}
        />
      )}
    </>
  );
}
