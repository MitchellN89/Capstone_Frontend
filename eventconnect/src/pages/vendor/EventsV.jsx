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
import CheckboxInput from "../../components/Inputs/CheckboxInput";

export default function EventsV() {
  const navigate = useNavigate();
  const [eventServices, setEventServices] = useState(null);
  const [trigger, setTrigger] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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

  const filteredEventSerivces = useMemo(() => {
    const filtered = filter(
      eventServices,
      matchEventNameV(eventNameFilterValue),
      matchServiceV(serviceFilterValue),
      matchAddressV(addressFilterValue),
      matchTagV(tagFilterValue)
    );
    if (!filtered) return null;

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

  useEffect(() => {
    console.log("EventsV.jsx > eventServices: ", eventServices);
  }, [eventServices]);

  const handleClick = (eventServiceId) => {
    navigate(`/vendor/events/${eventServiceId}`);
  };

  const handleRefresh = () => {
    setTrigger((trigger) => !trigger);
  };

  useEffect(() => {
    apiCall(`/events`)
      .then((result) => {
        setEventServices(result.data);
      })
      .catch((err) => {
        console.error(err);
      });

    const timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, [trigger]);

  if (!eventServices) return;
  return (
    // TODO Need title
    // TODO need serach criteria
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
        <CardLoading isLoading={isLoading} />
        {filteredEventSerivces &&
          filteredEventSerivces.map((eventService) => {
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
