import { Grid } from "@mui/material";
import LoadingCard from "../../components/LoadingCard";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utilities/apiCall";
import { useEffect, useState, useMemo } from "react";
import HeaderStrip from "../../components/HeaderStrip";
import { Header1 } from "../../components/Texts/TextHeaders";
import ButtonLogoRefresh from "../../components/Buttons/ButtonLogoRefresh";
import FilterBar from "../../components/FilterBar";
import { useFilterPreferencesContext } from "../../context/FilterPreferencesProvider";
import CardRequestV from "./Components/CardRequestV";
import ServiceInput from "../../components/Inputs/ServiceInput";
import CustomComboInput from "../../components/Inputs/CustomComboInput";
import { filter, matchIgnoredV } from "../../utilities/filterFunctions";
import {
  matchEventNameV,
  matchAddressV,
  matchServiceV,
  matchTagV,
} from "../../utilities/filterFunctions";
import { useServicesVContext } from "../../context/ServiceVProvider";
import { useChatEntryContext } from "../../context/ChatEntryProvider";
import CheckboxInput from "../../components/Inputs/CheckboxInput";

export default function ServiceRequestsV() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [queryParams, setQueryParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const services = useServicesVContext();
  const {
    eventNameFilterProps,
    eventNameFilterValue,
    serviceFilterProps,
    serviceFilterValue,
    tagFilterValue,
    tagFilterProps,
    addressFilterProps,
    addressFilterValue,
    ignoredFilterProps,
    ignoredFilterValue,
    resetFilters,
  } = useFilterPreferencesContext();
  const { state: chatEntryContext } = useChatEntryContext();
  const { chatEntries } = chatEntryContext || {};

  const filteredEventSerivces = useMemo(() => {
    return filter(
      requests,
      matchEventNameV(eventNameFilterValue),
      matchServiceV(serviceFilterValue),
      matchAddressV(addressFilterValue),
      matchTagV(tagFilterValue),
      matchIgnoredV(ignoredFilterValue)
    );
  }, [
    addressFilterValue,
    serviceFilterValue,
    eventNameFilterValue,
    requests,
    ignoredFilterValue,
    tagFilterValue,
  ]);

  useEffect(() => {
    let ignore = false;

    let queryString = "";
    if (Object.keys(queryParams).length) {
      queryString += "?";

      Object.keys(queryParams).forEach((key, index, array) => {
        queryString += `${key}=${queryParams[key]}`;
        if (index < array.length - 1) queryString += "&";
      });

      for (let param in queryParams) {
        queryString += `${param}=`;
      }
    }

    apiCall(`/serviceRequests${queryString}`)
      .then((result) => {
        if (!ignore) {
          setRequests(result.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
        }
      });

    let timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [queryParams, trigger]);

  const handleClick = (serviceRequestId) => {
    navigate(`/vendor/servicerequests/${serviceRequestId}`);
  };

  const handleTrigger = () => {
    setTrigger((trigger) => !trigger);
  };

  useEffect(() => {
    console.log("ServiceRequests.jsx > requests: ", requests);
  }, [requests]);

  if (!requests) return;
  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>SERVICE REQUESTS</Header1>
        <ButtonLogoRefresh handleClick={handleTrigger} />
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
        <Grid item xs={12} sm={6} md={4}>
          <CheckboxInput {...ignoredFilterProps} />
        </Grid>
      </FilterBar>

      <Grid container spacing={3} marginBottom={4}>
        <LoadingCard isLoading={isLoading} />
        {filteredEventSerivces &&
          filteredEventSerivces.map((request) => {
            const chatQuantity = chatEntries.filter((entry) => {
              return entry.vendorEventConnection.eventService.id == request.id;
            }).length;

            return (
              <CardRequestV
                handleClick={handleClick}
                eventName={request.event.eventName}
                eventStartDateTime={request.event.startDataTime}
                eventEndDateTime={request.event.eventEndDateTime}
                serviceName={request.service.service}
                eventId={request.event.id}
                eventServiceId={request.id}
                key={request.id}
                chatQuantity={chatQuantity}
              />
            );
          })}
      </Grid>
    </>
  );
}
