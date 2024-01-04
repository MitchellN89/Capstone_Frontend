import { TextField } from "@mui/material";
import TextValidationError from "./Texts/TextValidationError";
import { debouncer } from "../utilities/higherOrderFuncs";
import { useEffect, useState } from "react";

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
