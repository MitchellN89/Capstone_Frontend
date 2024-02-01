import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

export default function CheckboxInput({
  checked,
  setChecked,
  label,
  defaultChecked,
}) {
  return (
    <FormControlLabel
      label={label || "CheckboxInput"}
      control={
        <Checkbox
          checked={checked}
          onChange={setChecked}
          defaultChecked={defaultChecked}
          size="small"
          inputProps={{ "aria-label": "controlled" }}
        />
      }
    />
  );
}
