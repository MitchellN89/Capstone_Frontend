import { TextField } from "@mui/material";
import { TextValidationError } from "./TextComponents";

export function TextValidationInput({
  value,
  onChange,
  fullWidth,
  type,
  id,
  label,
  required,
  isLocked,
  isLoading,
  notValid,
  patterns,
  style,
}) {
  return (
    <div>
      <TextField
        value={value || ""}
        onChange={onChange || null}
        fullWidth={fullWidth ? true : false}
        type={type || "text"}
        id={id || "inputId"}
        label={label || "Text Validation Input"}
        variant="outlined"
        required={required ? true : false}
        disabled={isLoading || isLocked ? true : false}
        error={notValid ? true : false}
      />
      {/* <TextValidationError>Must contain 10 or more letters</TextValidationError>
      <TextValidationError>Cannot use illegal characters</TextValidationError> */}
    </div>
  );
}
