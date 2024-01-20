import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";

export default function DateTimeInput({
  addtionalPatterns,
  overWritePatterns,
  isValid,
  handleIsValid,
  ...others
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <DemoContainer
        components={["DateTimeField", "DateTimeField", "DateTimeField"]}
      > */}
      <DateTimeField
        variant="standard"
        size="small"
        format="DD MMMM YYYY hh:mm a"
        fullWidth
        {...others}
      />
      {/* </DemoContainer> */}
    </LocalizationProvider>
  );
}
