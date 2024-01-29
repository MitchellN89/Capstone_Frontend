import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import { apiCall } from "../../utilities/apiCall";
import { Box, Paper } from "@mui/material";
import { useEventsEPContext } from "../../context/EventEPProvider";
import EditEventEP from "./EditEventEp";
import { useState } from "react";
import ModalContainer from "../../components/ModalContainer";
import HeaderStrip from "../../components/HeaderStrip";
import { Text } from "../../components/Texts/Texts";
import TextContainer from "../../components/TextContainer";
import Map from "../../components/Map";
import { FeatureStylize } from "../../components/Texts/TextStyles";
import ButtonLogoBack from "../../components/Buttons/ButtonLogoBack";
import ButtonLogoEdit from "../../components/Buttons/ButtonLogoEdit";
import ButtonLogoDelete from "../../components/Buttons/ButtonLogoDelete";
import dayjs from "dayjs";
import { useNotification } from "../../context/NotificationProvider";

export default function EventEP() {
  let { eventId } = useParams(); //get eventId from url Params
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext(); //destructure state and dispatch as custom names
  const [openEditModal, setOpenEditModal] = useState(false); //modal open/close status
  const navigate = useNavigate();
  const { triggerNotification } = useNotification();
  // get the backend domain name from the .env file within React application
  const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

  // get isLoading from events context
  const { isLoading } = events || {};

  // get THIS event from events context
  const event = events.events.find((event) => {
    return event.id == eventId;
  });

  // if event doesn't exist
  if (!event) {
    // send error message
    triggerNotification({
      message: "Cannot find event, it may have been deleted",
      severity: "error",
    });

    // return to main eventplanner page
    navigate("/eventplanner");
  }

  // get whether any of the event services within THIS event has allocated/promoted vendors
  // using array.some to get a true if ANY of the even services meet the condition
  // hasPromotedVendors will be true or false
  const hasPromotedVendors =
    event && event.eventServices
      ? event.eventServices.some((eventService) => {
          return eventService.vendorId ? true : false;
        })
      : false;

  // function which returns back to the previous page
  const handleGoBack = () => {
    navigate("/eventplanner");
  };

  //function to delete this event
  const handleDelete = async () => {
    // sets the state of eventsContext to isLoading = true
    eventsDispatch({ type: "PROCESSING_REQUEST" });

    //api call to delete this event
    apiCall(`/events/${eventId}`, "delete")
      .then(() => {
        // update state in context to reflect changes
        eventsDispatch({ type: "DELETE_EVENT", id: eventId });

        // send success message
        triggerNotification({ message: "Successfully deleted event" });

        // navigate back to event planner and REMOVE current page from the react-router-dom history.
        // this means if the back button is pushed, the user is not taken to an event page that no longer exists
        navigate("/eventplanner", { replace: true });
      })
      .catch((err) => {
        // on error, set state in context back to isLoading = false and send error message
        console.error(err);
        eventsDispatch({ type: "REQUEST_FAILED", error: err });

        triggerNotification({
          message:
            "Error while trying to delete event. For more info, see console log",
          severity: "error",
        });
      });
  };

  //control to open and close edit modal
  const handleOpenEditModal = (bool) => {
    // if isLoading is true, cancels out of the function
    if (isLoading) return;
    setOpenEditModal(bool);
  };

  // function to open modal when clicking the edit button
  const handleEditClick = () => {
    handleOpenEditModal(true);
  };

  // styling for the main image. the events ID is the file name. Therefore no imageUrl required on the db side
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

  return (
    <>
      <EditEvent
        open={openEditModal}
        handleOpenEditModal={handleOpenEditModal}
      />
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>EVENTS</Header1>
        <ButtonLogoBack handleClick={handleGoBack} />
      </HeaderStrip>

      <Paper sx={{ marginBottom: "30px" }}>
        <div style={imgStyle}></div>

        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Box padding="20px 20px 0">
              <HeaderStrip>
                <Header2 style={{ margin: "0" }}>{event.eventName}</Header2>
                <div style={{ display: "flex" }}>
                  <ButtonLogoEdit handleClick={handleEditClick} />
                  {/* Delete button is not available if there are allocated vendors against this event */}
                  <ButtonLogoDelete
                    isVisible={!hasPromotedVendors}
                    handleClick={handleDelete}
                  />
                </div>
              </HeaderStrip>

              <TextContainer>
                <Text style={textStyle}>
                  <FeatureStylize featureStrength={3} bold>
                    Start:{" "}
                  </FeatureStylize>
                  {/* Using dayjs to check is dates are valid and format them to a readable state */}
                  {dayjs(event.startDateTime).isValid() &&
                    dayjs(event.startDateTime).format("DD MMM YYYY, HH:mm a")}
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
                    Client Name:{" "}
                  </FeatureStylize>
                  {event.endClientFirstName} {event.endClientLastName}
                </Text>
                <Text style={textStyle}>
                  <FeatureStylize featureStrength={3} bold>
                    Client Email:{" "}
                  </FeatureStylize>
                  {event.endClientEmailAddress}
                </Text>
                <Text style={textStyle}>
                  <FeatureStylize featureStrength={3} bold>
                    Client Phone:{" "}
                  </FeatureStylize>
                  {event.endClientPhoneNumber}
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
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box padding={3}>
              {/* Google map component accepts an address. It will place a marker and zoom in on this address */}
              <Map address={event.address} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Outlet />
    </>
  );
}

// Modal is separated out as it's own component here for code clarity.
// open state and handleOpenEditModal are passed in.
// These set the state of the modal and allow closing from within
const EditEvent = ({ open, handleOpenEditModal }) => {
  return (
    <ModalContainer open={open} handleOpen={handleOpenEditModal} maxWidth="md">
      <EditEventEP handleOpen={handleOpenEditModal} />
    </ModalContainer>
  );
};
