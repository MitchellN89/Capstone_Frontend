import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { apiCall } from "../utilities/apiCall";

const ChatEntryContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "PROCESSING_REQUEST":
      return { ...state, isLoading: true };
    case "REQUEST_FAILED":
      return { ...state, isLoading: false };
    case "SET_ENTRIES":
      return { isLoading: false, chatEntries: [...action.payload] };
    case "DELETE_ENTRIES":
      return {
        chatEntries: removeEntries(state, action.serviceConnectionId),
        isLoading: false,
      };
    default:
      return state;
  }
};

const removeEntries = (state, serviceConnectionId) => {
  const chatEntries = [...state.chatEntries];

  return chatEntries.filter((chatEntry) => {
    return chatEntry.vendorEventConnectionId != serviceConnectionId;
  });
};

export function ChatEntryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    chatEntries: [],
    isLoading: false,
  });
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    dispatch({ type: "PROCESSING_REQUEST" });

    apiCall("/chatEntries")
      .then((results) => {
        dispatch({ type: "SET_ENTRIES", payload: results });
      })
      .catch((err) => {
        console.error(err);
        dispatch({ type: "REQUEST_FAILED" });
      });

    const timer = setTimeout(() => {
      setTrigger((trigger) => !trigger);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [trigger]);

  return (
    <ChatEntryContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatEntryContext.Provider>
  );
}

export function useChatEntryContext() {
  const chatEntries = useContext(ChatEntryContext);
  return chatEntries;
}
