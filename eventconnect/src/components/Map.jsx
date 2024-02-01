import { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import "../styles/maps.css";
import { useGoogleMaps } from "../context/GoogleMapsProvider";
import { getGeocode, getLatLng } from "use-places-autocomplete";

const style = {
  width: "100%",
  maxHeight: "400px",
};

export default function Map({ address }) {
  const initPosition = useMemo(() => ({ lat: -36.85, lng: 174.76 }), []);
  const { isLoaded } = useGoogleMaps();
  const [coordinates, setCoordinates] = useState(null);

  // on address change, input address string
  useEffect(() => {
    if (address) {
      // get geocode from address string
      getGeocode({ address })
        .then((results) => {
          // get lat and lng
          const { lat, lng } = getLatLng(results[0]);
          // set coordinates state to obj {lat, lng}
          setCoordinates({ lat, lng });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setCoordinates(null);
    }
  }, [address]);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    // if there is no inserted address, the map zooms out and focuses on Auckland
    // if there is an inserted address, the map zooms in on that location
    <GoogleMap
      zoom={coordinates ? 15 : 10}
      center={coordinates || initPosition}
      mapContainerClassName="map-container"
      mapContainerStyle={style}
    >
      {/* marker for address location */}
      {coordinates && <Marker position={coordinates} />}
    </GoogleMap>
  );
}
