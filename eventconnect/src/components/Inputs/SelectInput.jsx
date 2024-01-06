import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectInput({
  options,
  handleIsValid,
  label,
  isValid,
  ...others
}) {
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="selectLabel">{label}</InputLabel>
        <Select {...others} labelId="selectLabel" label={label}>
          {options &&
            options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.service}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
