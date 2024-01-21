import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import useData from "../../hooks/useData";
import CreateCard from "../../components/CreateCard";
import LoadingCard from "../../components/LoadingCard";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import CardEventEP from "./Components/CardEventEP";
import { Header1 } from "../../components/Texts/TextHeaders";
import HeaderStrip from "../../components/HeaderStrip";
import { IconCreate } from "../../components/Icons";
import ButtonLogoCreate from "../../components/Buttons/ButtonLogoCreate";
import ModalContainer from "../../components/ModalContainer";
import CreateEventEP from "./CreateEventEp";
import { useState } from "react";

export default function EventsEP() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const {
    state: events,
    dispatch: eventsDispatch,
    actions: eventsActions,
  } = useEventsEPContext();
  const { isLoading } = events;
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (isLoading) return;
    eventsDispatch({ type: "PROCESSING_REQUEST" });

    apiCall(`/events/${id}`, "delete")
      .then(() => {
        eventsDispatch({ type: "DELETE_EVENT", id });
      })
      .catch((err) => {
        eventsDispatch({ type: "REQUEST_FAILED", error: err });
        console.error(err);
      });
  };

  const handleClick = (id) => {
    if (isLoading) return;
    navigate(`/eventPlanner/${id}`);
  };

  const handleOpenCreateModal = (bool) => {
    setOpenCreateModal(bool);
  };

  console.log("OPEN STATUS", openCreateModal);

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      <CreateEvent
        open={openCreateModal}
        handleOpenCreateModal={handleOpenCreateModal}
      />
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>EVENTS</Header1>
        <ButtonLogoCreate handleClick={handleOpenCreateModal} />
      </HeaderStrip>

      <Grid container spacing={3} marginBottom={4}>
        <LoadingCard isLoading={isLoading} />
        {events.events &&
          events.events.map((event) => {
            return (
              <CardEventEP
                key={event.id}
                eventId={event.id}
                eventName={event.eventName}
                hasPromotedVendors={event.vendorId ? true : false}
                handleDelete={handleDelete}
                handleClick={handleClick}
              />
            );
          })}
      </Grid>
    </>
  );
}

const CreateEvent = ({ open, handleOpenCreateModal }) => {
  return (
    <ModalContainer
      open={open}
      handleOpen={handleOpenCreateModal}
      maxWidth="md"
    >
      <CreateEventEP handleOpen={handleOpenCreateModal} />
    </ModalContainer>
  );
};
