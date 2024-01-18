import { useEffect, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete from "use-places-autocomplete";
import { useGoogleMaps } from "../../context/GoogleMapsProvider";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import TextInput from "./TextInput";

export default function AddressInput(inputValue, setInputValue) {
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
  const [selected, setSelected] = useState(null);
  const { isLoaded } = useGoogleMaps();

  //   const handleSelect = async (address) => {
  //     setValue(address, false);
  //     clearSuggestions();

  //     const results = await getGeocode({ address });
  //     const { lat, lng } = getLatLng(results[0]);
  //     setSelected({ lat, lng });
  //   };

  if (!isLoaded) return <div>Loading...</div>;

  // const options = data ? data.map((object, id)=>{})

  useEffect(() => {
    clearSuggestions();
  }, [selected]);

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search an address"
        className="combobox-input"
        onBlur={(evt) => {
          if (value !== selected) {
            setValue(selected);
          }
        }}
      />
      <div>
        {status === "OK" &&
          data.map((object, id) => (
            <div
              key={id}
              onClick={() => {
                setSelected(object.description);
                setValue(object.description);
                // clearSuggestions();
              }}
            >
              {object.description}
            </div>
          ))}
      </div>

      {/* <Autocomplete
        onChange={(evt) => {
          setValue(evt.target.value);
        }}
        inputValue={value}
        onInputChange={(evt) => {
          setValue(evt.target.value);
        }}
        options={
          status === "OK"
            ? data.map((option) => {
                return option.description;
              })
            : []
        }
        id="flat-demo"
        renderInput={(params) => (
          <TextField {...params} label="flat" variant="standard" />
        )}
      /> */}
    </>
  );
}
