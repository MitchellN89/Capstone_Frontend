import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import axios from "axios";
import { apiCall } from "../utilities/apiCall";
const EventEPContext = createContext();

const reducer = (state, action) => {
  const { type, payload, error, response, id } = action;
  console.log("TYPE", type);
  console.log("PAYLOAD", payload);
  console.log("ERROR", error);
  console.log("RESPONSE", response);

  switch (type) {
    case "PROCESSING_REQUEST":
      return { ...state, isLoading: true, error: null, response: null };
    case "REQUEST_FAILED":
      console.err;
      return {
        ...state,
        isLoading: false,
        error: error,
      };
    case "GET_EVENTS":
      return {
        ...state,
        data: [...payload],
        isLoading: false,
        error: null,
        response: response,
      };
    case "GET_EVENT":
      return {
        ...state /* Function here */,
        isLoading: false,
        error: null,
        response: response,
      };
    case "CREATE_EVENT":
      return {
        ...state /* Function here */,
        data: appendNewEvent(state, payload),
        isLoading: false,
        error: null,
        response: response,
        newEvent: payload,
      };
    case "UPDATE_EVENT":
      return {
        ...state,
        data: updateEvent(state, id, payload),
        isLoading: false,
        error: null,
        response: response,
      };
    case "DELETE_EVENT":
      return {
        ...state,
        data: deleteEvent(state, id),
        isLoading: false,
        error: null,
        response: response,
      };
    default:
      return state;
  }
};

const appendNewEvent = (state, newEvent) => {
  const data = [...state.data];
  data.push(newEvent);
  return data;
};

const updateEvent = (state, id, updatedEvent) => {
  const data = [...state.data];
  const log = data.map((event) =>
    event.id == id ? { ...event, ...updatedEvent } : event
  );
  console.log(id, updatedEvent, log);
  return log;
};

const deleteEvent = (state, id) => {
  const data = [...state.data];
  return data.filter((event) => event.id != id);
};

export function EventEPProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    isLoading: false,
    error: null,
    response: null,
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
    console.log("Use effect running");
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
      console.log("Component unmounted");
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
