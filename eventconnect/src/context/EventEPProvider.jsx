import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { apiCall } from "../utilities/apiCall";
import { useNotification } from "./NotificationProvider";
const EventEPContext = createContext();

// reducer function to set state
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

// function which copies eventServices array, appends a new service and returns
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

// function which copies eventServices array, deletes an event service and returns
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

// function which copies events array, appends a new event and returns
const appendNewEvent = (state, newEvent) => {
  const events = [...state.events];
  events.push(newEvent);
  return events;
};

// function which copies events array, updates an event and returns
const updateEvent = (state, id, updatedEvent) => {
  const events = [...state.events];
  const log = events.map((event) =>
    event.id == id ? { ...event, ...updatedEvent } : event
  );

  return log;
};

// function which copies events array, deletes an event and returns
const deleteEvent = (state, id) => {
  const events = [...state.events];
  return events.filter((event) => event.id != id);
};

// function which copies the eventServices array, finds the correct eventService and updates vendorId
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
  const { triggerNotification } = useNotification();

  useEffect(() => {
    let ignore = false;

    dispatch({ type: "PROCESSING_REQUEST" });

    //get events
    apiCall(`/events`)
      .then((result) => {
        if (!ignore) {
          // set state to retrieved data
          dispatch({
            type: "GET_EVENTS",
            payload: result.data,
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          // on error, send error message
          triggerNotification({
            message: "Error getting events. For more info, see console log",
          });
          console.error(err);
          dispatch({ type: "REQUEST_FAILED", error: err });
        }
      });

    return () => {
      // cleanup function
      ignore = true;
    };
  }, []);

  const context = { state, dispatch };

  return (
    <EventEPContext.Provider value={context}>
      {children}
    </EventEPContext.Provider>
  );
}

export function useEventsEPContext() {
  return useContext(EventEPContext);
}
