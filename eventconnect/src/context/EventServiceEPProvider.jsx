import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { apiCall } from "../utilities/apiCall";
import { useNotification } from "./NotificationProvider";
const ServicesEPContext = createContext();

// For comments on reducer and it's called functions, see EventEPProvider.jsx
// very similar data

const reducer = (state, action) => {
  const { type, payload, id, eventId, eventServiceId, vendorId } = action;

  switch (type) {
    case "PROCESSING_REQUEST":
      return { ...state, isLoading: true };
    case "REQUEST_FAILED":
      console.err;
      return {
        ...state,
        isLoading: false,
      };
    case "GET_SERVICES":
      return {
        ...state,
        services: [...payload],
        isLoading: false,
      };
    case "GET_EVENT_SERVICES":
      return {
        ...state,
        eventServices: appendEventServices(state, payload),
        isLoading: false,
      };
    case "CREATE_EVENT_SERVICE":
      return {
        ...state,
        eventServices: appendNewEventService(state, payload),
        isLoading: false,
      };
    case "UPDATE_EVENT_SERVICE":
      return {
        ...state,
        eventServices: updateEventService(state, id, payload),
        isLoading: false,
      };
    case "DELETE_EVENT_SERVICE":
      return {
        ...state,
        eventServices: deleteEventService(state, id),
        isLoading: false,
      };
    case "ENABLE_BROADCAST":
      return {
        ...state,
        eventServices: broadCastEventService(state, id, payload),
        isLoading: false,
      };
    case "PROMOTE_VENDOR":
      return {
        ...state,
        eventServices: promoteVendor(state, eventServiceId, vendorId),
        isLoading: false,
      };
    default:
      return state;
  }
};

const appendEventServices = (state, eventServicesToAppend) => {
  const eventServices = [...state.eventServices];
  eventServices.push(...eventServicesToAppend);
  return eventServices;
};

const appendNewEventService = (state, newEventService) => {
  const eventServices = [...state.eventServices];
  eventServices.push(newEventService);
  return eventServices;
};

const updateEventService = (state, id, updatedEventService) => {
  const eventServices = [...state.eventServices];
  return eventServices.map((eventService) =>
    eventService.id == id
      ? { ...eventService, ...updatedEventService }
      : eventService
  );
};

const deleteEventService = (state, id) => {
  const eventServices = [...state.eventServices];
  return eventServices.filter((eventService) => eventService.id != id);
};

const broadCastEventService = (state, id, bool) => {
  const eventServices = [...state.eventServices];
  return eventServices.map((eventService) =>
    eventService.id == id ? { ...eventService, broadcast: bool } : eventService
  );
};

const promoteVendor = (state, eventServiceId, vendorId) => {
  const eventServices = [...state.eventServices];
  return eventServices.map((eventService) => {
    if (eventService.id == eventServiceId) {
      eventService.vendorId = vendorId;
      return eventService;
    } else return eventService;
  });
};

export function ServicesEPProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    services: [],
    eventServices: [],
    isLoading: false,
    error: null,
    response: null,
  });

  const { triggerNotification } = useNotification();

  useEffect(() => {
    let ignore = false;

    dispatch({ type: "PROCESSING_REQUEST" });

    //get services, the only initial data set on this state
    apiCall("/services")
      .then((result) => {
        if (!ignore) {
          // set state services with retrieved data
          dispatch({
            type: "GET_SERVICES",
            payload: result.data,
            response: result.response,
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          // on error, send err msg
          console.error(err);
          dispatch({ type: "REQUEST_FAILED", error: err });
          triggerNotification({
            message:
              "Error while getting services. For more info, see console log",
            severity: "error",
          });
        }
      });

    return () => {
      //cleanup function
      ignore = true;
    };
  }, []);

  const context = { state, dispatch };

  return (
    <ServicesEPContext.Provider value={context}>
      {children}
    </ServicesEPContext.Provider>
  );
}

export function useServicesEPContext() {
  return useContext(ServicesEPContext);
}
