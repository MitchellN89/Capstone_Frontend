import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { apiCall } from "../utilities/apiCall";
const ServicesEPContext = createContext();

const reducer = (state, action) => {
  const { type, payload, error, response, id } = action;

  switch (type) {
    case "PROCESSING_REQUEST":
      return { ...state, isLoading: true, error: null, response: null };
    case "REQUEST_FAILED":
      console.err;
      return {
        ...state,
        isLoading: false,
        error: error,
        response: null,
      };
    case "GET_SERVICES":
      return {
        ...state,
        services: [...payload],
        isLoading: false,
        error: null,
        response: response,
      };
    case "GET_EVENT_SERVICES":
      return {
        ...state,
        eventServices: appendEventServices(state, payload),
        isLoading: false,
        error: null,
        response: response,
      };
    case "CREATE_EVENT_SERVICE":
      return {
        ...state,
        eventServices: appendNewEventService(state, payload),
        isLoading: false,
        error: null,
        response: response,
        newEvent: payload,
      };
    case "UPDATE_EVENT_SERVICE":
      return {
        ...state,
        eventServices: updateEventService(state, id, payload),
        isLoading: false,
        error: null,
        response: response,
      };
    case "DELETE_EVENT_SERVICE":
      return {
        ...state,
        eventServices: deleteEventService(state, id),
        isLoading: false,
        error: null,
        response: response,
      };
    case "ENABLE_BROADCAST":
      return {
        ...state,
        eventServices: broadCastEventService(state, id, payload),
        isLoading: false,
        response: response,
      };
    case "DISABLE_BROADCAST":
      return {
        ...state,
        eventServices: broadCastEventService(state, id, payload),
        isLoading: false,
        response: response,
      };
    case "PROMOTE_VENDOR":
      return;
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

const promoteVendor = () => {};

export function ServicesEPProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    services: [],
    eventServices: [],
    isLoading: false,
    error: null,
    response: null,
  });

  useEffect(() => {
    let ignore = false;

    dispatch({ type: "PROCESSING_REQUEST" });

    apiCall("/services")
      .then((result) => {
        if (!ignore) {
          dispatch({
            type: "GET_SERVICES",
            payload: result.data,
            response: result.response,
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          dispatch({ type: "REQUEST_FAILED", error: err });
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const context = { state, dispatch };

  useEffect(() => {
    if (state) console.log("CONTEXT ? EventServicesEP > state: ", state);
  }, [state]);

  return (
    <ServicesEPContext.Provider value={context}>
      {children}
    </ServicesEPContext.Provider>
  );
}

export function useServicesEPContext() {
  return useContext(ServicesEPContext);
}
