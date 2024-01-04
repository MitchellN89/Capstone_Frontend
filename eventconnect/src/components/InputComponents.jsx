import { Box, TextField, Autocomplete } from "@mui/material";
import { TextValidationError } from "./TextComponents";
import { debouncer } from "../utilities/higherOrderFuncs";
import { useEffect, useState, useRef, useMemo } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAP_API_KEY;

// Expect patters array to contain objects {type: "required/restricted/match", value: }

export function TextValidationInput({
  value,
  onChange,
  fullWidth,
  type,
  id,
  label,
  required,
  notValid,
  patterns,
  handleNotValid,
  name,
  disabled,
  style,
}) {
  const [invalidList, setInvalidList] = useState(null);

  const checkValidation = (pattern, str) => {
    switch (pattern.type) {
      case "required":
        return pattern.value.test(str);
      case "match":
        return pattern.value === str;
    }
  };

  const handleInvalidList = debouncer((str) => {
    handleNotValid(false);
    if (patterns && value !== "") {
      setInvalidList(
        patterns
          .filter((pattern) => {
            return !checkValidation(pattern, str);
          })
          .map((pattern) => (
            <TextValidationError key={pattern.label}>
              {pattern.message}
            </TextValidationError>
          ))
      );
      // updateNotValid(patterns, str);
    } else {
      setInvalidList(null);
      handleNotValid(false);
    }
  }, 250);

  useEffect(() => {
    handleInvalidList(value);
  }, [value, patterns]);

  useEffect(() => {
    if (invalidList && invalidList.length > 0) {
      handleNotValid(true);
    } else {
      handleNotValid(false);
    }
  }, [invalidList]);

  return (
    <div>
      <TextField
        value={value || ""}
        onChange={onChange ? onChange : null}
        fullWidth={fullWidth ? true : false}
        type={type || "text"}
        id={id || "inputId"}
        label={label || "Text Validation Input"}
        variant="outlined"
        required={required ? true : false}
        disabled={disabled}
        error={notValid ? true : false}
        name={name}
      />
      {invalidList}
    </div>
  );
}

export function TextInput({
  isValid,
  patterns,
  handleIsValid,
  value,
  ...others
}) {
  const [invalidList, setInvalidList] = useState(null);

  const checkValidation = (pattern, str) => {
    switch (pattern.type) {
      case "required":
        return pattern.value.test(str);
      case "match":
        return pattern.value === str;
    }
  };

  const handleInvalidList = debouncer((str, patterns) => {
    if (patterns && value !== "") {
      setInvalidList(
        patterns
          .filter((pattern) => {
            return !checkValidation(pattern, str);
          })
          .map((pattern) => (
            <TextValidationError key={pattern.label}>
              {pattern.message}
            </TextValidationError>
          ))
      );
      // updateNotValid(patterns, str);
    } else {
      setInvalidList(null);
    }
  }, 250);

  useEffect(() => {
    handleInvalidList(value, patterns);
  }, [value, patterns]);

  useEffect(() => {
    if (!handleIsValid) return;
    if (invalidList && invalidList.length > 0) {
      handleIsValid(false);
    } else {
      handleIsValid(true);
    }
  }, [invalidList]);

  return (
    <div>
      <TextField
        fullWidth
        {...others}
        value={value}
        variant="outlined"
        error={!isValid}
      />
      {invalidList}
    </div>
  );
}

export default function DateTimeInput() {
  const [value, setValue] = useState(new Date());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
        <DateTimePicker
          label="Uncontrolled picker"
          defaultValue={dayjs("2022-04-17T15:30")}
        />
        <DateTimePicker
          label="Controlled picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export function ComboBox(props) {
  return (
    <Autocomplete
      disablePortal
      options={[
        { label: "mitchell", age: 34 },
        { label: "kirsty", age: 31 },
      ]}
      onChange={(evt) => {
        console.log(evt.target);
      }}
      renderInput={(params, option) => {
        console.log(option);
        return <TextField {...params} label="Combo Box" />;
      }}
      {...props}
    />
  );
}

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

// export function AddressPicker({ value, onChange }) {
//   const [value, setValue] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [options, setOptions] = useState([]);
//   const loaded = useRef(false);

//   if (typeof window !== "undefined" && !loaded.current) {
//     if (!document.querySelector("#google-maps")) {
//       loadScript(
//         `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
//         document.querySelector("head"),
//         "google-maps"
//       );
//     }

//     loaded.current = true;
//   }

//   const fetch = useMemo(
//     () =>
//       debounce((request, callback) => {
//         autocompleteService.current.getPlacePredictions(request, callback);
//       }, 400),
//     []
//   );

//   useEffect(() => {
//     let active = true;

//     if (!autocompleteService.current && window.google) {
//       autocompleteService.current =
//         new window.google.maps.places.AutocompleteService();
//     }
//     if (!autocompleteService.current) {
//       return undefined;
//     }

//     if (inputValue === "") {
//       setOptions(value ? [value] : []);
//       return undefined;
//     }

//     const options = {
//       input: inputValue,
//       componentRestriction: { country: "NZ" },
//     };

//     fetch(options, (results) => {
//       if (active) {
//         let newOptions = [];

//         if (value) {
//           newOptions = [value];
//         }

//         if (results) {
//           newOptions = [...newOptions, ...results];
//         }

//         setOptions(newOptions);
//       }
//     });

//     return () => {
//       active = false;
//     };
//   }, [value, inputValue, fetch]);

//   return (
//     <Autocomplete
//       id="google-map-demo"
//       sx={{ width: 300 }}
//       getOptionLabel={(option) =>
//         typeof option === "string" ? option : option.description
//       }
//       filterOptions={(x) => x}
//       options={options}
//       autoComplete
//       includeInputInList
//       filterSelectedOptions
//       value={value}
//       noOptionsText="No locations"
//       onChange={(event, newValue) => {
//         setOptions(newValue ? [newValue, ...options] : options);
//         setValue(newValue);
//       }}
//       onInputChange={(event, newInputValue) => {
//         setInputValue(newInputValue);
//       }}
//       renderInput={(params) => (
//         <TextField {...params} label="Add a location" fullWidth />
//       )}
//       renderOption={(props, option) => {
//         const matches =
//           option.structured_formatting.main_text_matched_substrings || [];

//         const parts = parse(
//           option.structured_formatting.main_text,
//           matches.map((match) => [match.offset, match.offset + match.length])
//         );

//         return (
//           <li {...props}>
//             <Grid container alignItems="center">
//               <Grid item sx={{ display: "flex", width: 44 }}>
//                 <LocationOnIcon sx={{ color: "text.secondary" }} />
//               </Grid>
//               <Grid
//                 item
//                 sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
//               >
//                 {parts.map((part, index) => (
//                   <Box
//                     key={index}
//                     component="span"
//                     sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
//                   >
//                     {part.text}
//                   </Box>
//                 ))}
//                 <Typography variant="body2" color="text.secondary">
//                   {option.structured_formatting.secondary_text}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </li>
//         );
//       }}
//     />
//   );
// }
