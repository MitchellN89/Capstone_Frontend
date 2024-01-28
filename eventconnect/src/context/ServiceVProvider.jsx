import { createContext, useContext, useState, useEffect } from "react";
import { apiCall } from "../utilities/apiCall";
const ServicesVContext = createContext();

export function ServiceVProvider({ children }) {
  const [services, setService] = useState(null);

  useEffect(() => {
    let ignore = false;

    apiCall("/services")
      .then((result) => {
        if (!ignore) {
          setService(result.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    console.log("ServiceVProvider > services: ", services);
  }, [services]);

  return (
    <ServicesVContext.Provider value={services}>
      {children}
    </ServicesVContext.Provider>
  );
}

export function useServicesVContext() {
  return useContext(ServicesVContext);
}
