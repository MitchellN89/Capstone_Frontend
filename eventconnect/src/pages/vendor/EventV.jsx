import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import HeaderStrip from "../../components/HeaderStrip";
import ButtonLogoBack from "../../components/Buttons/ButtonLogoBack";
import { FeatureStylize } from "../../components/Texts/TextStyles";
import { Text } from "../../components/Texts/Texts";
import TextContainer from "../../components/TextContainer";
import ServiceConnectionV from "./ServiceConnectionV";
import Map from "../../components/Map";
import { useChatEntryContext } from "../../context/ChatEntryProvider";
import dayjs from "dayjs";
import { useNotification } from "../../context/NotificationProvider";

// get backend domain
const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function EventV() {
  // destructuring and variable / state setup below
  const [trigger, setTrigger] = useState(true);
  const [eventService, setEventService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { serviceRequestId } = useParams();
  const { event } = eventService || {};
  const { dispatch: dispatchChatEntry } = useChatEntryContext();
  const { id: eventId } = event || {};
  const { triggerNotification } = useNotification();

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

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    // api call, get one event
    apiCall(`/events/${serviceRequestId}`)
      .then((result) => {
        //if cleanup hasn't run
        if (!ignore) {
          // set state with retrieved data
          setEventService(result.data);

          // mark chat entries for this connection as read
          dispatchChatEntry({
            type: "DELETE_ENTRIES",
            serviceConnectionId: result.data.id,
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          // if error, send message and return
          console.error(err);
          triggerNotification({
            message: "Error getting event. For more info, see console log",
            severity: "error",
          });
          navigate("/vendor/events");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    // trigger is a dependency so that this useEffect can be manually run
  }, [trigger]);

  const handleGoBack = () => {
    if (isLoading) return;
    navigate("/vendor/events");
  };

  const handleTrigger = () => {
    if (isLoading) return;
    setTrigger((trigger) => !trigger);
  };

  //handle initial load
  if (!eventService) return;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <HeaderStrip>
            <Header1 style={{ margin: "0" }}>EVENTS</Header1>
            <ButtonLogoBack handleClick={handleGoBack} />
          </HeaderStrip>

          <Paper>
            <div style={imgStyle}></div>

            <Grid container spacing={1} marginBottom={4}>
              <Grid item xs={12}>
                <Box padding="20px 20px 0">
                  <Header2 style={{ margin: "0" }}>{event.eventName}</Header2>
                  <FeatureStylize featureStrength={3} italic bold>
                    <Text style={{ margin: "0" }}>
                      {eventService.service.service}
                    </Text>
                  </FeatureStylize>
                  {/* check dates are valid and format them if so */}
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Start:{" "}
                      </FeatureStylize>
                      {dayjs(event.startDateTime).isValid() &&
                        dayjs(event.startDateTime).format(
                          "DD MMM YYYY, HH:mm a"
                        )}
                    </Text>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        End:{" "}
                      </FeatureStylize>
                      {dayjs(event.endDateTime).isValid() &&
                        dayjs(event.endDateTime).format("DD MMM YYYY, HH:mm a")}
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
                    <Text style={textStyle}>{eventService.requestBody}</Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Tags:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>{eventService.tags}</Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Volumes:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>{eventService.volumes}</Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Logistics:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>{eventService.logistics}</Text>
                  </TextContainer>
                  <TextContainer>
                    <Text style={textStyle}>
                      <FeatureStylize featureStrength={3} bold>
                        Special Requirements:{" "}
                      </FeatureStylize>
                    </Text>
                    <Text style={textStyle}>
                      {eventService.specialRequirements}
                    </Text>
                  </TextContainer>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box padding={3}>
                  <Map address={event.address} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <ServiceConnectionV
            handleTrigger={handleTrigger}
            serviceRequestId={serviceRequestId}
            trigger={trigger}
          />
        </Grid>
      </Grid>
    </>
  );
}
