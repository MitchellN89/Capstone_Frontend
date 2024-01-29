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
  const [inFocus, setInFocus] = useState(false);

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

  if (!isLoaded) return <div>Loading...</div>;

  useEffect(() => {
    setValue(selected);
    clearSuggestions();
  }, [selected]);

  return (
    <div
      style={containerStyle}
      onFocus={() => {
        setInFocus(true);
      }}
      onBlur={() => {
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

      {inFocus && status === "OK" && (
        <div style={listStyle}>
          {data.map((object, id) => (
            <div
              key={id}
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
