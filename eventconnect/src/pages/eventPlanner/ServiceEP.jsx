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
import EditServiceEP from "./EditServiceEP";
import HeaderStrip from "../../components/HeaderStrip";
import ModalContainer from "../../components/ModalContainer";
import ButtonLogoBack from "../../components/Buttons/ButtonLogoBack";
import ButtonLogoEdit from "../../components/Buttons/ButtonLogoEdit";
import ButtonLogoDelete from "../../components/Buttons/ButtonLogoDelete";
import TextContainer from "../../components/TextContainer";
import { FeatureStylize } from "../../components/Texts/TextStyles";
import { Text } from "../../components/Texts/Texts";
import ButtonLoading from "../../components/Buttons/ButtonLoading";
import { IconBroadcast } from "../../components/Icons";

export default function ServiceEP() {
  let { eventId, eventServiceId } = useParams();
  const { state: serviceContext, dispatch: servicesDispatch } =
    useServicesEPContext();

  const eventService = serviceContext.eventServices.find((eventService) => {
    return eventService.id == eventServiceId;
  });

  const { services } = serviceContext;

  if (!eventService) return;

  const [trigger, setTrigger] = useState(true);
  const [isFormComplete, setIsFormComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceConnections, setServiceConnections] = useState(null);
  const [serviceConnection, setServiceConnection] = useState(null);
  const vendorId = eventService.vendorId || null;
  const [selectedVendorId, setSelectedVendorId] = useState(vendorId);
  const [openEditModal, setOpenEditModal] = useState(false);
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const resetSelectedVendorId = () => {
    setSelectedVendorId(vendorId);
  };

  const handleOpenEditModal = (bool) => {
    setOpenEditModal(bool);
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

  const getService = (serviceId) => {
    return services.find((service) => {
      return service.id == serviceId;
    });
  };

  const handleTrigger = () => {
    setTrigger((curState) => !curState);
  };

  if (!eventService) return;

  const textStyle = {
    margin: "0",
  };

  const imgStyle = {
    backgroundImage: `url('/${getService(eventService.serviceId).imgUrl}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "500px",
    maxHeight: "40vh",
    backgroundColor: "#cccccc",
  };

  return (
    <>
      <EditService
        open={openEditModal}
        handleOpenEditModal={handleOpenEditModal}
      />

      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <HeaderStrip style={{ marginTop: "30px" }}>
            <Header1 style={{ margin: "0" }}>SERVICES</Header1>
            <ButtonLogoBack handleClick={handleGoBack} />
          </HeaderStrip>
          <Paper>
            <div style={imgStyle}></div>

            <Box padding="20px 20px 20px" marginBottom={4}>
              <HeaderStrip>
                <Header2 style={{ margin: "0" }}>
                  {getService(eventService.serviceId).service}
                </Header2>
                <div style={{ display: "flex" }}>
                  <ButtonLogoEdit
                    handleClick={() => {
                      handleOpenEditModal(true);
                    }}
                  />
                  <ButtonLogoDelete isVisible handleClick={handleDelete} />
                </div>
              </HeaderStrip>

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
              <div style={{ textAlign: "right" }}>
                <ButtonLoading
                  label="Broadcast Service "
                  icon={<IconBroadcast />}
                  onClick={enableBroadcast}
                />
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>
    </>
  );
}

const EditService = ({ open, handleOpenEditModal }) => {
  return (
    <ModalContainer open={open} handleOpen={handleOpenEditModal} maxWidth="md">
      <EditServiceEP handleOpen={handleOpenEditModal} />
    </ModalContainer>
  );
};
