import { Grid } from "@mui/material";
import { useEventsEPContext } from "../../context/EventEPProvider";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import CardEventEP from "./Components/CardEventEP";
import { Header1 } from "../../components/Texts/TextHeaders";
import HeaderStrip from "../../components/HeaderStrip";
import ButtonLogoCreate from "../../components/Buttons/ButtonLogoCreate";
import ModalContainer from "../../components/ModalContainer";
import CreateEventEP from "./CreateEventEp";
import { useState, useMemo, useEffect } from "react";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import FilterBar from "../../components/FilterBar";
import CustomComboInput from "../../components/Inputs/CustomComboInput";
import CardCreate from "../../components/CardCreate";
import CardLoading from "../../components/CardLoading";
import {
  filter,
  matchAddressEP,
  matchEventNameEP,
} from "../../utilities/filterFunctions";
import { useFilterPreferencesContext } from "../../context/FilterPreferencesProvider";

export default function EventsEP() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const {
    state: eventContext,
    dispatch: eventsDispatch,
    actions: eventsActions,
  } = useEventsEPContext();
  const { events } = eventContext || {};
  const { state: servicesContext } = useServicesEPContext();
  const { isLoading } = events;
  const navigate = useNavigate();
  const {
    eventNameFilterProps,
    eventNameFilterValue,
    addressFilterProps,
    addressFilterValue,
    resetFilters,
  } = useFilterPreferencesContext();

  const filteredEvents = useMemo(() => {
    return filter(
      events,
      matchEventNameEP(eventNameFilterValue),
      matchAddressEP(addressFilterValue)
    );
  }, [addressFilterValue, eventNameFilterValue, events]);

  useEffect(() => {
    console.log("filteredEvents", filteredEvents);
  }, [filteredEvents]);

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

  const handleOpenCreateModal = (bool = true) => {
    setOpenCreateModal(bool);
  };

  return (
    <>
      <CreateEvent
        open={openCreateModal}
        handleOpenCreateModal={handleOpenCreateModal}
      />
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>EVENTS</Header1>
        <ButtonLogoCreate handleClick={handleOpenCreateModal} />
      </HeaderStrip>
      <FilterBar resetFilters={resetFilters}>
        <Grid item xs={12}>
          <CustomComboInput {...eventNameFilterProps} />
        </Grid>
        <Grid item xs={12}>
          <CustomComboInput {...addressFilterProps} />
        </Grid>
      </FilterBar>
      <Grid container spacing={3} marginBottom={4}>
        <CardLoading isLoading={isLoading} />
        {filteredEvents &&
          filteredEvents.map((event) => {
            const hasPromotedVendors =
              event && event.eventServices
                ? event.eventServices.some((eventService) => {
                    return eventService.vendorId ? true : false;
                  })
                : null;

            return (
              <CardEventEP
                key={event.id}
                eventId={event.id}
                eventName={event.eventName}
                eventStartDateTime={event.startDateTime}
                eventEndDateTime={event.endDateTime}
                hasPromotedVendors={hasPromotedVendors}
                handleDelete={handleDelete}
                handleClick={handleClick}
              />
            );
          })}
        <CardCreate
          label="CREATE NEW EVENT"
          handleClick={handleOpenCreateModal}
        />
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
