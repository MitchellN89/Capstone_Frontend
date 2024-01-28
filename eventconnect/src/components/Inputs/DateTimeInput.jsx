import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import TextValidationError from "../Texts/TextValidationError";
import { debouncer } from "../../utilities/higherOrderFuncs";
import { useState, useEffect } from "react";

export default function DateTimeInput({
  isValid,
  handleIsValid,
  patterns,
  value,
  ...others
}) {
  const [invalidList, setInvalidList] = useState(null);

  useEffect(() => {
    handleInvalidList(value, patterns);
    console.log("DEBUG__ DateTimeInput.jsx > value: ", value);
  }, [value, patterns]);

  const handleInvalidList = debouncer((value, patternFuncs) => {
    if (patternFuncs && patternFuncs.length > 0 && value) {
      const invalidList = [];

      handleIsValid(
        patternFuncs.every((patternFunc) => {
          const result = patternFunc(value);

          if (!result.isValid) {
            invalidList.push({ key: result.key, message: result.faultMessage });
          }

          return result.isValid;
        })
      );

      if (invalidList.length > 0) {
        setInvalidList(invalidList);
      } else {
        setInvalidList(null);
      }
    } else {
      setInvalidList(null);
      handleIsValid(true);
    }
  }, 250);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimeField
          variant="standard"
          value={value}
          size="small"
          format="DD MMMM YYYY hh:mm a"
          fullWidth
          error={!isValid}
          {...others}
        />
      </LocalizationProvider>
      {invalidList &&
        invalidList.map((pattern) => {
          return (
            <TextValidationError key={pattern.key}>
              {pattern.message}
            </TextValidationError>
          );
        })}
    </div>
  );
}
