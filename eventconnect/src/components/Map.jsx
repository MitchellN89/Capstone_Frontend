import { useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "../styles/maps.css";
import { useGoogleMaps } from "../context/GoogleMapsProvider";

export default function Map() {
  const initPosition = useMemo(() => ({ lat: -36.85, lng: 174.76 }), []);
  const [selected, setSelected] = useState(null);
  const { isLoaded } = useGoogleMaps();

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <GoogleMap
      zoom={selected ? 15 : 10}
      center={selected || initPosition}
      mapContainerClassName="map-container"
    >
      {/* {selected && <Marker position={selected} />} */}
    </GoogleMap>
  );
}
