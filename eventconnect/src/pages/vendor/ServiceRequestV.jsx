import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import CreateServiceConnection from "./CreateServiceConnection";
import ServiceConnectionV from "./ServiceConnectionV";

export default function ServiceRequestV() {
  const [trigger, setTrigger] = useState(true);
  const [serviceRequest, setServiceRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { serviceRequestId } = useParams();

  const handleTrigger = () => {
    setTrigger((curState) => !curState);
  };

  // TODO - useData here instead
  useEffect(() => {
    let ignore = false;

    apiCall(`/serviceRequests/${serviceRequestId}`)
      .then((result) => {
        if (!ignore) {
          setServiceRequest(result.data);
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

    return () => {
      ignore = true;
    };
  }, [trigger]);

  if (isLoading) return <h1>Loading...</h1>;
  if (!serviceRequest) return;

  return (
    <>
      <Header1>{serviceRequest.event.eventName || ""}</Header1>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Go Back
      </button>
      <Paper>
        <Box padding={2}>
          <Grid container spacing={5} padding={2}>
            <Grid item xs={12} lg={5}>
              <Header2>{serviceRequest.event.eventName || ""}</Header2>

              <Typography>
                {serviceRequest.event.startDateTime || ""}
              </Typography>
              <Typography>{serviceRequest.event.endDateTime || ""}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {serviceRequest.vendorEventConnections.length === 0 && (
        <CreateServiceConnection
          handleTrigger={handleTrigger}
          trigger={trigger}
          serviceRequestId={serviceRequestId}
          eventPlannerId={serviceRequest.event.user.id}
        />
      )}
      {serviceRequest.vendorEventConnections.length > 0 && (
        <ServiceConnectionV
          handleTrigger={handleTrigger}
          serviceRequestId={serviceRequestId}
          trigger={trigger}
        />
      )}
    </>
  );
}
