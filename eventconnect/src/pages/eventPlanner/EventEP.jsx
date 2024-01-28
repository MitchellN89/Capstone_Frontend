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

export default function EventEP() {
  let { eventId } = useParams();
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext();
  const [openEditModal, setOpenEditModal] = useState(false);
  const navigate = useNavigate();
  const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
  const event = events.events.find((event) => {
    return event.id == eventId;
  });

  const hasPromotedVendors =
    event && event.eventServices
      ? event.eventServices.some((eventService) => {
          return eventService.vendorId ? true : false;
        })
      : false;

  const handleGoBack = () => {
    navigate("/eventplanner");
  };

  const handleDelete = async () => {
    eventsDispatch({ type: "PROCESSING_REQUEST" });
    apiCall(`/events/${eventId}`, "delete")
      .then(() => {
        eventsDispatch({ type: "DELETE_EVENT", id: eventId });
        navigate("/eventplanner", { replace: true });
      })
      .catch((err) => {
        console.error(err);
        eventsDispatch({ type: "REQUEST_FAILED", error: err });
      });
  };

  const handleOpenEditModal = (bool) => {
    setOpenEditModal(bool);
  };

  const handleEditClick = () => {
    handleOpenEditModal(true);
  };

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

  if (!event)
    return (
      <>
        <h1>Can't find it</h1>
      </>
    );
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
              <Map address={event.address} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Outlet />
    </>
  );
}

const EditEvent = ({ open, handleOpenEditModal }) => {
  return (
    <ModalContainer open={open} handleOpen={handleOpenEditModal} maxWidth="md">
      <EditEventEP handleOpen={handleOpenEditModal} />
    </ModalContainer>
  );
};
