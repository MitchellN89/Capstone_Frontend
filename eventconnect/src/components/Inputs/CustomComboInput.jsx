import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

// this custom combo box allows the user to add their own values and store them as an array.
// custom hook is used to handle props here

export default function CustomComboInput({ value, setValue, label }) {
  return (
    <Autocomplete
      multiple
      style={{ flex: "1", minWidth: "250px" }}
      id="custom-autocomplete"
      options={[]}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      freeSolo
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={label || "Custom Input"}
        />
      )}
    />
  );
}
