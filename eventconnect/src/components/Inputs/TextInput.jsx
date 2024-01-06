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

  const checkValidation = (pattern, str) => {
    switch (pattern.type) {
      case "required":
        return pattern.value.test(str);
      case "match":
        return pattern.value === str;
      case "notInclude":
        return !pattern.value.includes(str);
    }
  };

  const handleInvalidList = debouncer((str, patterns) => {
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
    }
  }, 250);

  useEffect(() => {
    handleInvalidList(value, patterns);
  }, [value, patterns]);

  useEffect(() => {
    if (!handleIsValid) return;
    if (invalidList && invalidList.length > 0) {
      handleIsValid(false);
    } else {
      handleIsValid(true);
    }
  }, [invalidList]);

  return (
    <div>
      <TextField
        fullWidth
        {...others}
        value={value}
        variant="outlined"
        error={!isValid}
      />
      {invalidList}
    </div>
  );
}
