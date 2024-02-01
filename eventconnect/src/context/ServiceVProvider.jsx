import { createContext, useContext, useState, useEffect } from "react";
import { apiCall } from "../utilities/apiCall";
import { useNotification } from "./NotificationProvider";
const ServicesVContext = createContext();

// context to hold services for the vendor pages.
// it's only purpose is to populate the services filter Select Input component.
// I've opted for context here to save having to do multiple api calls when the data will always be the same

export function ServiceVProvider({ children }) {
  const [services, setService] = useState([]);
  const { triggerNotification } = useNotification();

  useEffect(() => {
    let ignore = false;

    // get services
    apiCall("/services")
      .then((result) => {
        if (!ignore) {
          // set state to retrieved data
          setService(result.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          triggerNotification({
            message: "Error getting services. For more info, see console log",
            severity: "error",
          });
        }
      });

    return () => {
      // cleanup function
      ignore = true;
    };
  }, []);

  return (
    <ServicesVContext.Provider value={services}>
      {children}
    </ServicesVContext.Provider>
  );
}

export function useServicesVContext() {
  return useContext(ServicesVContext);
}
