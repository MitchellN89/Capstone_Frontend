import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import { Header1, Header2, Header3 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import CreateServiceConnection from "./CreateServiceConnection";
import ServiceConnectionV from "./ServiceConnectionV";
import HeaderStrip from "../../components/HeaderStrip";
import ButtonLogoBack from "../../components/Buttons/ButtonLogoBack";
import TextContainer from "../../components/TextContainer";
import { Text } from "../../components/Texts/Texts";
import { FeatureStylize } from "../../components/Texts/TextStyles";
import Map from "../../components/Map";
import ModalContainer from "../../components/ModalContainer";
import dayjs from "dayjs";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function ServiceRequestV() {
  const [trigger, setTrigger] = useState(true);
  const [serviceRequest, setServiceRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { serviceRequestId } = useParams();
  const { event } = serviceRequest || {};
  const { id: eventId } = event || {};
  const { user: eventPlanner } = event || {};
  const [openRespondModal, setOpenRespondModal] = useState(false);
  const { id: eventPlannerId } = eventPlanner || {};

  const handleOpenRespondModal = (bool) => {
    setOpenRespondModal(bool);
  };

  const handleGoBack = () => {
    navigate("/vendor/servicerequests");
  };

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

  const imgStyle = {
    backgroundImage: `url('${DOMAIN}/uploads/events/event${eventId}.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "500px",
    maxHeight: "40vh",
    backgroundColor: "#cccccc",
  };

  const textStyle = {
    margin: "0",
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (!serviceRequest) return;

  return (
    <>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={serviceRequest.vendorEventConnections.length ? 6 : 12}
        >
          <Respond
            open={openRespondModal}
            handleOpenRespondModal={handleOpenRespondModal}
            handleTrigger={handleTrigger}
            trigger={trigger}
            serviceRequestId={serviceRequestId}
            eventPlannerId={eventPlannerId}
          />
          <HeaderStrip>
            <Header1 style={{ margin: "0" }}>SERVICE REQUESTS</Header1>
            <ButtonLogoBack handleClick={handleGoBack} />
          </HeaderStrip>

          <Paper>
            <div style={imgStyle}></div>

            <Grid container spacing={1} marginBottom="30px">
              <Grid
                item
                xs={12}
                md={serviceRequest.vendorEventConnections.length != 0 ? 12 : 6}
              >
                <Box padding="20px 20px 0">
                  <Header2 style={{ margin: "0" }}>{event.eventName}</Header2>
                  <FeatureStylize featureStrength={3} italic bold>
                    <Text style={{ margin: "0" }}>
                      {serviceRequest.service.service}
                    </Text>
                  </FeatureStylize>

                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Start:{" "}
                      </FeatureStylize>
                      {dayjs(event.startDateTime).format(
                        "DD MMM YYYY, HH:mm a"
                      )}
                    </Text>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        End:{" "}
                      </FeatureStylize>
                      {dayjs(event.endDateTime).format("DD MMM YYYY, HH:mm a")}
                    </Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Venue:{" "}
                      </FeatureStylize>
                      {event.venue}
                    </Text>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Address:{" "}
                      </FeatureStylize>
                      {event.address}
                    </Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Request Details:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>{serviceRequest.requestBody}</Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Tags:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>{serviceRequest.tags}</Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Volumes:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>{serviceRequest.volumes}</Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Logistics:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>{serviceRequest.logistics}</Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Special Requirements:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>
                      {serviceRequest.specialRequirements}
                    </Text>
                  </TextContainer>
                  {serviceRequest.vendorEventConnections.length == 0 && (
                    <Button
                      style={{ marginBottom: "20px" }}
                      variant="contained"
                      onClick={() => {
                        handleOpenRespondModal(true);
                      }}
                    >
                      Respond
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={serviceRequest.vendorEventConnections.length != 0 ? 12 : 6}
              >
                <Box padding={3}>
                  <Map address={event.address} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          md={serviceRequest.vendorEventConnections.length != 0 ? 6 : 12}
        >
          {serviceRequest.vendorEventConnections.length != 0 && (
            <ServiceConnectionV
              handleTrigger={handleTrigger}
              serviceRequestId={serviceRequestId}
              trigger={trigger}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

const Respond = ({
  open,
  handleOpenRespondModal,
  handleTrigger,
  trigger,
  serviceRequestId,
  eventPlannerId,
}) => {
  return (
    <ModalContainer
      open={open}
      handleOpen={handleOpenRespondModal}
      maxWidth="md"
    >
      <CreateServiceConnection
        handleOpen={handleOpenRespondModal}
        handleTrigger={handleTrigger}
        trigger={trigger}
        serviceRequestId={serviceRequestId}
        eventPlannerId={eventPlannerId}
      />
    </ModalContainer>
  );
};
