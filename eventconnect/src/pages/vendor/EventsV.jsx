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
import { filter } from "../../utilities/filterFunctions";
import {
  matchAddressV,
  matchEventNameV,
} from "../../utilities/filterFunctions";

export default function EventsV() {
  const navigate = useNavigate();
  const [eventServices, setEventServices] = useState(null);
  const [trigger, setTrigger] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    eventNameFilterProps,
    eventNameFilterValue,
    addressFilterProps,
    addressFilterValue,
    resetFilters,
  } = useFilterPreferencesContext();

  const filteredEventSerivces = useMemo(() => {
    return filter(
      eventServices,
      matchEventNameV(eventNameFilterValue),
      matchAddressV(addressFilterValue)
    );
  }, [addressFilterValue, eventNameFilterValue, eventServices]);

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
        <Grid item xs={12}>
          <CustomComboInput {...eventNameFilterProps} />
        </Grid>
        <Grid item xs={12}>
          <CustomComboInput {...addressFilterProps} />
        </Grid>
      </FilterBar>
      <Grid container spacing={3} marginBottom={4}>
        <CardLoading isLoading={isLoading} />
        {filteredEventSerivces &&
          filteredEventSerivces.map((eventService) => {
            return (
              <CardRequestV
                handleClick={handleClick}
                eventName={eventService.event.eventName}
                serviceName={eventService.service.service}
                eventId={eventService.event.id}
                eventServiceId={eventService.id}
                key={eventService.id}
              ></CardRequestV>
            );
          })}
      </Grid>
    </>
  );
}
