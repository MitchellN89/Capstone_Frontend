import { TextField } from "@mui/material";
import { TextValidationError } from "./TextComponents";
import { debouncer } from "../utilities/higherOrderFuncs";
import { useEffect, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

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
