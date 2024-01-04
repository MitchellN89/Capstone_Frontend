import { useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "../styles/maps.css";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const API_KEY = import.meta.evn.VITE_MAP_API_KEY;
const libraries = ["places"];

export default function MapComponent() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map></Map>;
}

function Map() {
  const position = useMemo(() => ({ lat: -36.85, lng: 174.76 }), []);
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      <GoogleMap
        zoom={10}
        center={position}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "NZ" },
    },
  });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      // Use getGeocode to get detailed information about the selected place
      const results = await getGeocode({ address });
      const { address_components } = results[0];

      // Extract the city from address components
      const city = address_components.find((component) =>
        component.types.includes("locality")
      );

      // You can now use the 'city' variable as needed
      console.log("Selected city:", city.long_name);

      // You might want to pass this information to the parent component using setSelected
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search an address"
        className="combobox-input"
      />
      <div>
        {status === "OK" &&
          data.map((object, place_id) => (
            <div
              key={place_id}
              onClick={() => handleSelect(object.description)}
            >
              {object.description}
            </div>
          ))}
      </div>
    </>
  );
};
