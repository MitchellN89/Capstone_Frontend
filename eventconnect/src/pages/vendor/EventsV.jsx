import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { useEffect, useState } from "react";
import HeaderStrip from "../../components/HeaderStrip";
import { Header1 } from "../../components/Texts/TextHeaders";
import ButtonLogoRefresh from "../../components/Buttons/ButtonLogoRefresh";
import CardRequestV from "./Components/CardRequestV";
import CardLoading from "../../components/CardLoading";
import FilterBar from "../../components/FilterBar";
import CustomComboInput from "../../components/Inputs/CustomComboInput";
import { useFilterPreferencesContext } from "../../context/FilterPreferencesProvider";
import { useMemo } from "react";
import {
  filter,
  matchServiceV,
  matchTagV,
  matchAddressV,
  matchEventNameV,
} from "../../utilities/filterFunctions";
import ServiceInput from "../../components/Inputs/ServiceInput";
import { useServicesVContext } from "../../context/ServiceVProvider";
import { useChatEntryContext } from "../../context/ChatEntryProvider";
import { useNotification } from "../../context/NotificationProvider";

export default function EventsV() {
  // destructuring & variable / state setup below
  const navigate = useNavigate();
  const [eventServices, setEventServices] = useState(null);
  const [trigger, setTrigger] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { triggerNotification } = useNotification();

  // filter props and values below. these are to be passed into inputs and filter functions
  const {
    eventNameFilterProps,
    eventNameFilterValue,
    serviceFilterProps,
    serviceFilterValue,
    tagFilterValue,
    tagFilterProps,
    addressFilterProps,
    addressFilterValue,
    resetFilters,
  } = useFilterPreferencesContext();

  const services = useServicesVContext();
  const { state: chatEntryContext } = useChatEntryContext();
  const { chatEntries } = chatEntryContext || {};

  // filter function uses useMemo to stop rerenders when not required.
  // function expects array of objects and any amount of functions.
  // the functions passed in return functions which will filter the events list down
  const filteredEventSerivces = useMemo(() => {
    const filtered = filter(
      eventServices,
      matchEventNameV(eventNameFilterValue),
      matchServiceV(serviceFilterValue),
      matchAddressV(addressFilterValue),
      matchTagV(tagFilterValue)
    );
    if (!filtered) return null;

    // filtered eventServices are now sorted by earliest date to latest date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.event.startDateTime);
      const dateB = new Date(b.event.startDateTime);

      return dateA - dateB;
    });
  }, [
    addressFilterValue,
    serviceFilterValue,
    eventNameFilterValue,
    eventServices,
    tagFilterValue,
  ]);

  // handles event card click
  const handleClick = (eventServiceId) => {
    if (isLoading) return;
    navigate(`/vendor/events/${eventServiceId}`);
  };

  //forces api call refresh
  const handleRefresh = () => {
    if (isLoading) return;
    setTrigger((trigger) => !trigger);
  };

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    // get vendor events
    apiCall(`/events`)
      .then((result) => {
        if (!ignore) {
          // set state with retrieved data
          setEventServices(result.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          // send error message
          triggerNotification({
            message:
              "Error while getting vendor events. For more info, see console log",
            severity: "error",
          });
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    // setup timer to call this function every minute.
    const timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000);

    return () => {
      // cleanup function stops the timer and sets ignore to true
      clearTimeout(timer);
      ignore = true;
    };
    // trigger as a dependency means this can be triggered manually by changing trigger value
  }, [trigger]);

  // handle inital load
  if (!eventServices) return;

  return (
    <>
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>EVENTS</Header1>
        <ButtonLogoRefresh handleClick={handleRefresh} />
      </HeaderStrip>
      <FilterBar resetFilters={resetFilters}>
        <Grid item xs={12} sm={6} md={4}>
          <ServiceInput {...serviceFilterProps} options={services} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomComboInput {...eventNameFilterProps} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomComboInput {...addressFilterProps} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomComboInput {...tagFilterProps} />
        </Grid>
      </FilterBar>
      <Grid container spacing={3} marginBottom={4}>
        {/* iterate over filtered Event Services and display as cards */}
        <CardLoading isLoading={isLoading} />
        {filteredEventSerivces &&
          filteredEventSerivces.map((eventService) => {
            // get unread messages count relating to this event and display as badge
            const chatQuantity = chatEntries.filter((entry) => {
              return (
                entry.vendorEventConnection.eventService.id == eventService.id
              );
            }).length;

            return (
              <CardRequestV
                handleClick={handleClick}
                eventName={eventService.event.eventName}
                eventStartDateTime={eventService.event.startDateTime}
                eventEndDateTime={eventService.event.endDateTime}
                serviceName={eventService.service.service}
                eventId={eventService.event.id}
                eventServiceId={eventService.id}
                key={eventService.id}
                chatQuantity={chatQuantity}
              ></CardRequestV>
            );
          })}
      </Grid>
    </>
  );
}
