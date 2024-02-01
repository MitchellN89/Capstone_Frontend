import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { apiCall } from "../utilities/apiCall";
import { useNotification } from "../context/NotificationProvider";

//create context
const ChatEntryContext = createContext();

// setup reducer function to set the state
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
        // removeEntries is called to remove 'read messages'
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

// this provider provides UNREAD messages to the user with details on what the messages are related to (i.e - which event, which eventserice, which connection...)

export function ChatEntryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    chatEntries: [],
    isLoading: false,
  });
  const [trigger, setTrigger] = useState(false);
  const { triggerNotification } = useNotification();

  useEffect(() => {
    let ignore = false;
    dispatch({ type: "PROCESSING_REQUEST" });

    // get chat entries
    apiCall("/chatEntries")
      .then((results) => {
        if (!ignore) {
          // set state to retrieved data
          dispatch({ type: "SET_ENTRIES", payload: results });
        }
      })
      .catch((err) => {
        if (!ignore) {
          //on error, send err msg
          console.error(err);
          dispatch({ type: "REQUEST_FAILED" });
          triggerNotification({
            message:
              "Error while getting chat entries. For more info, see console log",
            severity: "error",
          });
        }
      });

    //create a timer which will run this call every 5 seconds in order to retrieve fresh data
    const timer = setTimeout(() => {
      setTrigger((trigger) => !trigger);
    }, 5000);

    return () => {
      // cleanup function, set ignore to true and clear timeout
      ignore = true;
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
