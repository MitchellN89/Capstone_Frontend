import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { debouncer } from "../../utilities/higherOrderFuncs";
import TextValidationError from "../Texts/TextValidationError";

export default function TextInput({
  isValid,
  patterns,
  handleIsValid,
  value,
  ...others
}) {
  const [invalidList, setInvalidList] = useState(null);

  useEffect(() => {
    handleInvalidList(value, patterns);
  }, [value, patterns]);

  const handleInvalidList = debouncer((value, patternFuncs) => {
    if (patternFuncs && patternFuncs.length > 0 && value !== "") {
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
      <TextField
        fullWidth
        {...others}
        value={value || ""}
        size="small"
        variant="standard"
        error={!isValid}
      />
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
