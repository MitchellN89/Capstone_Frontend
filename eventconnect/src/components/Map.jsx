import { useEffect, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "../styles/maps.css";
import { useGoogleMaps } from "../context/GoogleMapsProvider";
import { getGeocode, getLatLng } from "use-places-autocomplete";

const style = {
  width: "100%",
  maxHeight: "400px",
};

export default function Map({ address }) {
  const initPosition = useMemo(() => ({ lat: -36.85, lng: 174.76 }), []);
  const [selected, setSelected] = useState(null);
  const { isLoaded } = useGoogleMaps();
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (address) {
      getGeocode({ address })
        .then((results) => {
          const { lat, lng } = getLatLng(results[0]);
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
    <GoogleMap
      zoom={coordinates ? 15 : 10}
      center={coordinates || initPosition}
      mapContainerClassName="map-container"
      mapContainerStyle={style}
    >
      {coordinates && <Marker position={coordinates} />}
    </GoogleMap>
  );
}

//   const handleSelect = async (address) => {
//     setValue(address, false);
//     clearSuggestions();

//     const results = await getGeocode({ address });
//     const { lat, lng } = getLatLng(results[0]);
//     setSelected({ lat, lng });
//   };
