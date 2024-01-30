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
// import { useServicesEPContext } from "../../context/EventServiceEPProvider";
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
import { useChatEntryContext } from "../../context/ChatEntryProvider";
import { useNotification } from "../../context/NotificationProvider";

export default function EventsEP() {
  const [openCreateModal, setOpenCreateModal] = useState(false); //state to dictate if modal is visible or not
  // destructure state and dispatch from events context with custom variable names
  const { state: eventContext, dispatch: eventsDispatch } =
    useEventsEPContext();

  //destructure events from event context
  const { events } = eventContext || {};
  // const { state: servicesContext } = useServicesEPContext();
  const { isLoading } = events; //destructure isLoading from events
  const navigate = useNavigate();
  const { triggerNotification } = useNotification();

  // custom context which holds the value of search and filter parameters.
  // also supplies inputs with their props
  const {
    eventNameFilterProps,
    eventNameFilterValue,
    addressFilterProps,
    addressFilterValue,
    resetFilters,
  } = useFilterPreferencesContext();

  //destructure state from chat entry context with custom var name
  const { state: chatEntryContext } = useChatEntryContext();
  const { chatEntries } = chatEntryContext || {}; //destructure chatEntries from it's state

  // filteredEvents uses useMemo in order to stop it rendering every time react looks for for rerenders.
  // depending on the amount of events available, this may be a process hungry task.
  // therefore, using the filters as dependencies (as well as events), means the function only runs when it needs to
  const filteredEvents = useMemo(() => {
    // filter takes an array of objects and then any amount of functions.
    // the two functions called below, return functions which hard code the args within. These are then used as the logic to filter the events data
    const filtered = filter(
      events,
      matchEventNameEP(eventNameFilterValue),
      matchAddressEP(addressFilterValue)
    );

    // next, the filtered data is sorted by earliest date to latest date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.startDateTime);
      const dateB = new Date(b.startDateTime);

      return dateA - dateB;
    });
  }, [addressFilterValue, eventNameFilterValue, events]);

  const handleDelete = async (id) => {
    if (isLoading) return;

    // set state isLoading=true
    eventsDispatch({ type: "PROCESSING_REQUEST" });

    //api call to delete event
    apiCall(`/events/${id}`, "delete")
      .then(() => {
        // update state to reflect changes
        eventsDispatch({ type: "DELETE_EVENT", id });

        //send success msg
        triggerNotification({ message: "Successfully deleted event" });
      })
      .catch((err) => {
        // set isloading = false
        eventsDispatch({ type: "REQUEST_FAILED", error: err });

        //send error msg
        triggerNotification({
          message: "Error while deleting event. For more info, see console log",
          severity: "error",
        });
        console.error(err);
      });
  };

  // navigates to event once event card is clicked
  const handleClick = (id) => {
    if (isLoading) return;
    navigate(`/eventPlanner/${id}`);
  };

  //open/close modal
  const handleOpenCreateModal = (bool = true) => {
    if (isLoading) return;
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
        {/* iterate over filteredEvents and add each as a card */}
        {filteredEvents &&
          filteredEvents.map((event) => {
            const hasPromotedVendors =
              event && event.eventServices
                ? event.eventServices.some((eventService) => {
                    return eventService.vendorId ? true : false;
                  })
                : null;

            //get unread chat messages from chat entries that relate to this event. display as a MUI 'badge'
            const chatQuantity = chatEntries.filter((entry) => {
              return (
                entry.vendorEventConnection.eventService.event.id == event.id
              );
            }).length;

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
                chatQuantity={chatQuantity}
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

// modal handled separately for clarity of code
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
