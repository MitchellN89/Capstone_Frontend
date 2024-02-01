// MapContext.js
import React, { createContext, useContext } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];
const API_KEY = import.meta.env.VITE_MAP_API_KEY;

const MapContext = createContext();

// This context runs google maps load script and provides isLoaded and loadError to components which use the google map APIs

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

  return (
    <MapContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </MapContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(MapContext);
  return context;
};
