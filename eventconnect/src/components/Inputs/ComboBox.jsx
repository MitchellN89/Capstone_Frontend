import { TextField, Autocomplete } from "@mui/material";

export default function ComboBox(props) {
  return (
    <Autocomplete
      disablePortal
      options={[
        { label: "mitchell", age: 34 },
        { label: "kirsty", age: 31 },
      ]}
      onChange={(evt) => {}}
      renderInput={(params, option) => {
        return <TextField {...params} label="Combo Box" />;
      }}
      {...props}
    />
  );
}
