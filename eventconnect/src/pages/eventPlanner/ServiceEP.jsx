import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { useState } from "react";

export default function ServiceEP() {
  let { eventId, eventServiceId } = useParams();
  const { state: services, dispatch: servicesDispatch } =
    useServicesEPContext();

  const navigate = useNavigate();

  const [isFormComplete, setIsFormComplete] = useState(true);

  const eventService = services.eventServices.find((eventService) => {
    console.log("eventService", eventService);
    return eventService.id == eventServiceId;
  });

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

  const handleBroadcast = (bool) => {
    if (!isFormComplete) return;
    const reducerCommand = bool ? "ENABLE_BROADCAST" : "DISABLE_BROADCAST";
    const urlExtension = bool ? "enable" : "disable";
    servicesDispatch({ type: "PROCESSING_REQUEST" });
    apiCall(
      `/events/${eventId}/services/${eventServiceId}/broadcast/${urlExtension}`,
      "patch"
    )
      .then(() => {
        servicesDispatch({
          type: reducerCommand,
          id: eventServiceId,
          payload: bool,
        });
      })
      .catch(() => {
        servicesDispatch({ type: "REQUEST_FAILED" });
      });
  };

  if (!eventService) return;

  return (
    <>
      <Header1>Services &gt; {title}</Header1>
      <button
        onClick={() => {
          navigate(`/eventplanner/${eventId}`);
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
          <button
            disabled={!isFormComplete}
            onClick={() => {
              handleBroadcast(!broadcast);
            }}
          >
            {broadcast ? "Broadcasting" : "Broadcast"}
          </button>
        </Box>
      </Paper>
      <Outlet />
    </>
  );
}
