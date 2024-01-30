import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { debouncer } from "../../utilities/higherOrderFuncs";
import TextValidationError from "../Texts/TextValidationError";

// Custom text input accepts a list of props as below.
// patterns are funcs used to check if the value of the text input is valid.

export default function TextInput({
  isValid,
  patterns,
  handleIsValid,
  value,
  ...others
}) {
  const [invalidMessage, setInvalidMessage] = useState(null);

  // when the value or patterns change, call the handleInvalidList function
  useEffect(() => {
    handleInvalids(value, patterns);
  }, [value, patterns]);

  // debounced function. This is so the function is not calculated for absolutely every keystroke when the user is typing.
  const handleInvalids = debouncer((value, patternFuncs) => {
    // check if patternFuncs exists, if it has any funcs in it, and if value is not empty
    if (patternFuncs && patternFuncs.length > 0 && value !== "") {
      let invalidMessage;

      //set isValid
      handleIsValid(
        // run through each function

        patternFuncs.every((patternFunc) => {
          // set the result of the function with value passed in as result.
          // these functions return an object that contains isValid.
          const result = patternFunc(value);

          // if isValid is false, set invalidMessage variable as an object which has a key and an error message for the user
          if (!result.isValid) {
            invalidMessage = { key: result.key, message: result.faultMessage };
          }

          // also set isValid for the input
          return result.isValid;
        })
      );

      // set state according to outcome
      if (invalidMessage) {
        setInvalidMessage(invalidMessage);
      } else {
        setInvalidMessage(null);
      }
    } else {
      setInvalidMessage(null);
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
      {/* if invalidMessage is truthy, display the error message under the input */}
      {invalidMessage && (
        <TextValidationError key={invalidMessage.key}>
          {invalidMessage.message}
        </TextValidationError>
      )}
    </div>
  );
}
