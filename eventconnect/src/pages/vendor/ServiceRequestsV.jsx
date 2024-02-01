import { Grid } from "@mui/material";
import CardLoading from "../../components/CardLoading";
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
import { useNotification } from "../../context/NotificationProvider";

// for comments, see EventsV.jsx, it is near identical.
// there are serveral extra filtering functions in this component however

export default function ServiceRequestsV() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const services = useServicesVContext();
  const { triggerNotification } = useNotification();
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

  console.log("DEBUG: ", requests);

  const filteredEventSerivces = useMemo(() => {
    const filtered = filter(
      requests,
      matchEventNameV(eventNameFilterValue),
      matchServiceV(serviceFilterValue),
      matchAddressV(addressFilterValue),
      matchTagV(tagFilterValue),
      matchIgnoredV(ignoredFilterValue)
    );

    return filtered.sort((a, b) => {
      const dateA = new Date(a.event.startDateTime);
      const dateB = new Date(b.event.startDateTime);

      return dateA - dateB;
    });
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
    setIsLoading(true);
    apiCall(`/serviceRequests`)
      .then((result) => {
        if (!ignore) {
          setRequests(result.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          triggerNotification({
            message:
              "Error while getting vendor service requests. For more info, see console log",
          });
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    let timer = setTimeout(() => {
      setTrigger((curState) => !curState);
    }, 60000);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [trigger]);

  const handleClick = (serviceRequestId) => {
    if (isLoading) return;
    navigate(`/vendor/servicerequests/${serviceRequestId}`);
  };

  const handleTrigger = () => {
    if (isLoading) return;
    setTrigger((trigger) => !trigger);
  };

  if (!requests) return;
  return (
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
        <CardLoading isLoading={isLoading} />
        {filteredEventSerivces &&
          filteredEventSerivces.map((request) => {
            const chatQuantity = chatEntries.filter((entry) => {
              return entry.vendorEventConnection.eventService.id == request.id;
            }).length;

            return (
              <CardRequestV
                handleClick={handleClick}
                eventName={request.event.eventName}
                eventStartDateTime={request.event.startDateTime}
                eventEndDateTime={request.event.endDateTime}
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
