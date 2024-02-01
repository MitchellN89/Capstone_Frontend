import { useEffect, useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { useGoogleMaps } from "../../context/GoogleMapsProvider";
import { TextField } from "@mui/material";

export default function AddressInput({ init, disabled }) {
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
  const [inFocus, setInFocus] = useState(false); //state which i use to see if the input is in focus or not

  //upon component load, setSelected to init if init is truthy
  useEffect(() => {
    if (init) {
      setSelected(init);
    }
  }, []);

  const containerStyle = {
    position: "relative",
  };

  const listStyle = {
    border: "1px solid grey",
    position: "absolute",
    top: "50px",
    zIndex: "10",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "5px",
  };

  //handle initial load
  if (!isLoaded) return;

  //when selected changes, setValue as selected and clear autocomplete suggestions
  useEffect(() => {
    setValue(selected);
    clearSuggestions();
  }, [selected]);

  return (
    <div
      style={containerStyle}
      // set focus true onFocus
      onFocus={() => {
        setInFocus(true);
      }}
      onBlur={() => {
        // set focus false onBlur and conditionally set value to selected
        // this means if the user has typed something in the text box but NOT clicked an address, the last selected address is used
        setInFocus(false);
        if (value != selected && value != "") {
          setValue(selected);
        }
      }}
    >
      <TextField
        value={value || ""}
        onChange={(evt) => {
          setValue(evt.target.value);
        }}
        disabled={!ready || disabled}
        fullWidth
        label="Address"
        variant="standard"
        size="small"
        name="address"
      />
      {/* list of autocomplete address sugestions below */}
      {inFocus && status === "OK" && (
        <div style={listStyle}>
          {data.map((object, id) => (
            <div
              key={id}
              // using mouseDown to avoid onBlur triggering too soon on the TextField input
              onMouseDown={() => {
                setSelected(object.description);
                // clearSuggestions();
              }}
            >
              {object.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
