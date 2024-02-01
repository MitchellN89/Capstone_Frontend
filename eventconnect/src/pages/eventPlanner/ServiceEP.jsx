import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { useEffect, useState } from "react";
import ServiceConnectionsEP from "./ServiceConnectionsEP";
import ServiceConnectionEp from "./ServiceConnectionEP";
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
import { useNotification } from "../../context/NotificationProvider";

// Due to the nature of 2 users being able to access data from here on, api calls are handled within the component.

export default function ServiceEP() {
  let { eventId, eventServiceId } = useParams(); //get eventId and eventServiceId from url Params
  // destructure state and dispatch as custom variabless
  const { state: serviceContext, dispatch: servicesDispatch } =
    useServicesEPContext();

  //get context isLoading with custom name
  const { isLoading: isLoadingServices } = serviceContext || {};

  // get THIS eventService from eventServices within serviceContext
  const eventService = serviceContext.eventServices.find((eventService) => {
    return eventService.id == eventServiceId;
  });

  const { services } = serviceContext; //get services from serviceContext
  const { triggerNotification } = useNotification();

  // if event service can't be found, send error message and return
  if (!eventService) {
    triggerNotification({
      message:
        "Error while getting event service. For more info, see console log",
      severity: "error",
    });

    navigate(`/eventplanner/${eventId}`);
  }

  // using trigger as a way to manually cause the useEffect to re-run
  const [trigger, setTrigger] = useState(true);

  // isLoading specifies if the application is waiting on the response of an api call
  const [isLoading, setIsLoading] = useState(false);

  // variables to hold serviceConnections and one serviceConnection
  const [serviceConnections, setServiceConnections] = useState(null);
  const [serviceConnection, setServiceConnection] = useState(null);

  // get vendorId from eventService IF it exists
  const vendorId = eventService.vendorId || null;

  // state which specifies which vendor connection we are currently viewing
  // if vendorId is present, this means a vendor has been allocated to the eventservice and we ONLY need to see their connection from here on
  const [selectedVendorId, setSelectedVendorId] = useState(vendorId);
  const [openEditModal, setOpenEditModal] = useState(false);

  // store true of false on whether vendorId exists or not
  const hasPromotedVendor = vendorId ? true : false;
  const navigate = useNavigate();

  useEffect(() => {
    // setup ignore for cleanup function
    let ignore = false;

    // If there are no selectedVendors, get service connections from backend
    if (!selectedVendorId) {
      //set isLoading to true, lock controls
      setIsLoading(true);

      apiCall(`/events/${eventId}/services/${eventServiceId}/connections`)
        .then((result) => {
          // if cleanup func hasn't run, set serviceConnections to state
          if (!ignore) {
            setServiceConnections(result.data);
          }
        })
        .catch((err) => {
          if (!ignore) {
            // on error, send error message and return
            triggerNotification({
              message:
                "Error while getting service connections. For more info, see console log",
              severity: "error",
            });

            navigate(`/eventplanner/${eventId}`);
            console.error(err);
          }
        })
        .finally(() => {
          // set isLoading back to false
          setIsLoading(false);
        });
    }

    // If there IS a selected vendor, Get ONE Service Connection
    if (selectedVendorId) {
      // set isLoading to true
      setIsLoading(true);

      // get one service connection
      apiCall(
        `/events/${eventId}/services/${eventServiceId}/connections/vendor/${selectedVendorId}`
      )
        .then((result) => {
          // if cleanup func hasn't run, set state as one service connection
          setServiceConnection(result.data);
        })
        .catch((err) => {
          // on error, send error message and return
          triggerNotification({
            message:
              "Error while getting one service connection. For more info, see console log",
            severity: "error",
          });
          console.error(err);
          navigate(`/eventplanner/${eventId}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    // create a timer which runs this function every 60 seconds until cleanup function clears it
    const timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [selectedVendorId, trigger]); //run useEffect when selectedVendorId or trigger change

  // handle the change of selectedVendorId state
  const handleSelectedVendorId = (vendorId) => {
    // escape out of function is isLoading = true
    if (isLoading || isLoadingServices) return;
    setSelectedVendorId(vendorId);
  };

  //handle navigating back a page
  const handleGoBack = () => {
    // escape out of function is isLoading = true
    if (isLoading || isLoadingServices) return;
    navigate(-1);
  };

  // resets the selectedVendorId, therefore meaning all serviceConnections show as cards instead of 1 featured service connection
  const resetSelectedVendorId = () => {
    // escape out of function is isLoading = true
    if (isLoading || isLoadingServices) return;
    setSelectedVendorId(vendorId);
  };

  // sets open or close for modal (true/false)
  const handleOpenEditModal = (bool) => {
    // escape out of function is isLoading = true
    if (isLoading || isLoadingServices) return;
    setOpenEditModal(bool);
  };

  // handles deletion of event service
  const handleDelete = async () => {
    // escape out of function is isLoading = true
    if (isLoading || isLoadingServices) return;
    // sets sevices state to isLoading = true
    servicesDispatch({ type: "PROCESSING_REQUEST" });

    // api call to delete event service
    apiCall(`/events/${eventId}/services/${eventServiceId}`, "delete")
      .then(() => {
        // update state to reflect changes - set isLoading back to false
        servicesDispatch({ type: "DELETE_EVENT_SERVICE", id: eventServiceId });

        // send success message
        triggerNotification({ message: "Successfully deleted event service" });

        // navigate back to event page. Remove current location from history so user can't 'go back' to deleted event service
        navigate(`/eventplanner/${eventId}`, {
          replace: true,
        });
      })
      .catch((err) => {
        // on error, send message
        console.error(err);

        triggerNotification({
          message:
            "Error while deleting event service. For more info, see console log",
          severity: "error",
        });

        // set state back to isLoading = false
        servicesDispatch({ type: "REQUEST_FAILED", error: err });
      });
  };

  const enableBroadcast = () => {
    // escape out of function is isLoading = true
    if (isLoading || isLoadingServices) return;

    // set isLoading to true
    servicesDispatch({ type: "PROCESSING_REQUEST" });

    // api call, update event service to broadcast to vendors
    apiCall(
      `/events/${eventId}/services/${eventServiceId}/broadcast/enable`,
      "patch"
    )
      .then(() => {
        // update state to reflect changes
        servicesDispatch({
          type: "ENABLE_BROADCAST",
          id: eventServiceId,
          payload: true,
        });

        // send success message
        triggerNotification({
          message: "Successfully broadcast event service",
        });
      })
      .catch((err) => {
        // on error, send error message and set state (from context) back to isLoading = false
        console.error(err);

        triggerNotification({
          message:
            "Error while broadcasting event service. For more info, see console log",
          severity: "error",
        });
        servicesDispatch({ type: "REQUEST_FAILED" });
      });
  };

  // finds one service from a serviceId provided
  const getService = (serviceId) => {
    return services.find((service) => {
      return service.id == serviceId;
    });
  };

  // handles switching the trigger
  const handleTrigger = () => {
    setTrigger((curState) => !curState);
  };

  const textStyle = {
    margin: "0",
  };

  // styles the image by using the getService function to get the url linked to the service type. E.G - caterer.jpg
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

      <Grid container spacing={5} marginBottom={4}>
        <Grid item xs={12} md={6}>
          <HeaderStrip>
            <Header1 style={{ margin: "0" }}>SERVICES</Header1>
            <ButtonLogoBack handleClick={handleGoBack} />
          </HeaderStrip>

          <Paper>
            <div style={imgStyle}></div>

            <Box padding="20px 20px 20px">
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
                  {/* Button not available is vendor is promoted to event service */}
                  <ButtonLogoDelete
                    isVisible={!hasPromotedVendor}
                    handleClick={handleDelete}
                  />
                </div>
              </HeaderStrip>

              {/* Viewable details on event service below */}
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
              {/* Broadcast button only available when event is not broadcast. Once broadcast, event can not be un-broadcast */}
              {!eventService.broadcast && (
                <ButtonLoading
                  disabled={isLoading || isLoadingServices}
                  label="Broadcast Service"
                  onClick={enableBroadcast}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Below determines what is shown depending on if selectedVendorId holds a value. This replaces Outlet to allow me to easily pass in props  */}
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
              eventServiceVendorId={vendorId}
              serviceConnection={serviceConnection}
              handleTrigger={handleTrigger}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

// Modal handled as separate component for clarity of code
const EditService = ({ open, handleOpenEditModal }) => {
  return (
    <ModalContainer open={open} handleOpen={handleOpenEditModal} maxWidth="md">
      <EditServiceEP handleOpen={handleOpenEditModal} />
    </ModalContainer>
  );
};
