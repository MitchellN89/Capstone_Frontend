import { createContext, useContext, useState, useEffect } from "react";
import { apiCall } from "../utilities/apiCall";
const ServicesVContext = createContext();

export function ServiceVProvider({ children }) {
  const [services, setService] = useState([]);

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

  return (
    <ServicesVContext.Provider value={services}>
      {children}
    </ServicesVContext.Provider>
  );
}

export function useServicesVContext() {
  return useContext(ServicesVContext);
}
