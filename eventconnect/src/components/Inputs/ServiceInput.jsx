import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ServiceInput({ options, value, setValue }) {
  return (
    <Autocomplete
      style={{ flex: "1", minWidth: "250px" }}
      multiple
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      options={options}
      size="small"
      disableCloseOnSelect
      getOptionLabel={(option) => option.service}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.service}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Services"
          // placeholder="Services"
        />
      )}
    />
  );
}
