import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { apiCall } from "../utilities/apiCall";
const EventEPContext = createContext();

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
    case "GET_EVENTS":
      return {
        ...state,
        events: [...payload],
        isLoading: false,
      };
    case "CREATE_EVENT":
      return {
        ...state,
        events: appendNewEvent(state, payload),
        isLoading: false,
      };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: updateEvent(state, id, payload),
        isLoading: false,
      };
    case "DELETE_EVENT":
      return {
        ...state,
        events: deleteEvent(state, id),
        isLoading: false,
      };
    case "CREATE_EVENT_SERVICE":
      return {
        ...state,
        events: appendNewEventService(state, id, eventId),
        isLoading: false,
      };
    case "DELETE_EVENT_SERVICE":
      return {
        ...state,
        events: deleteEventService(state, id, eventId),
      };
    case "PROMOTE_VENDOR":
      return {
        ...state,
        events: promoteVendor(state, eventServiceId, vendorId, eventId),
        isLoading: false,
      };
    default:
      return state;
  }
};

const appendNewEventService = (state, id, eventId) => {
  const events = [...state.events];

  return events.map((event) => {
    if (event.id == eventId) {
      if (!event.eventServices) {
        event.eventServices = [];
      }

      event.eventServices.push({ id, vendorId: null });
    }
    return event;
  });
};

const deleteEventService = (state, eventServiceId, eventId) => {
  const events = [...state.events];
  const filteredEvents = events.map((event) => {
    if (event.id == eventId && event.eventServices.length > 0) {
      event.eventServices = event.eventServices.filter((eventService) => {
        return eventService.id != eventServiceId;
      });
    }

    return event;
  });
  return filteredEvents;
};

const appendNewEvent = (state, newEvent) => {
  const events = [...state.events];
  events.push(newEvent);
  return events;
};

const updateEvent = (state, id, updatedEvent) => {
  const events = [...state.events];
  const log = events.map((event) =>
    event.id == id ? { ...event, ...updatedEvent } : event
  );

  return log;
};

const deleteEvent = (state, id) => {
  const events = [...state.events];
  return events.filter((event) => event.id != id);
};

const promoteVendor = (state, eventServiceId, vendorId, eventId) => {
  const events = [...state.events];
  const newEvents = events.map((event) => {
    if (event.id == eventId && event.eventServices.length > 0) {
      event.eventServices = event.eventServices.map((eventService) => {
        if (eventService.id == eventServiceId) {
          eventService.vendorId = vendorId;
        }
        return eventService;
      });
    }
    return event;
  });
  return newEvents;
};

export function EventEPProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    events: [],
    isLoading: false,
  });

  const [queryParams, setQueryParams] = useState({});

  const handleQueryParams = (key, value) => {
    setQueryParams((curState) => {
      const existingStateClone = { ...curState };
      if (existingStateClone[key] && !value) {
        delete existingStateClone[key];
        return existingStateClone;
      } else {
        existingStateClone[key] = value;
        return existingStateClone;
      }
    });
  };

  useEffect(() => {
    console.log("EventEPProvider > State: ", state);
  }, [state]);

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

    dispatch({ type: "PROCESSING_REQUEST" });

    apiCall(`/events?${queryString}`)
      .then((result) => {
        if (!ignore) {
          dispatch({
            type: "GET_EVENTS",
            payload: result.data,
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
  }, [queryParams]);

  const actions = {
    handleQueryParams,
  };

  const context = { state, dispatch, actions };

  return (
    <EventEPContext.Provider value={context}>
      {children}
    </EventEPContext.Provider>
  );
}

export function useEventsEPContext() {
  return useContext(EventEPContext);
}
