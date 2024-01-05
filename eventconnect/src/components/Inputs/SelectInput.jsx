import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
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
        <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
        <Select
          {...others}
          labelId="demo-simple-select-helper-label"
          //   id="demo-simple-select-helper"
          label={label}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
