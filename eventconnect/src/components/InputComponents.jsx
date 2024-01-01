import { TextField } from "@mui/material";

export function EmailValidationInput(props) {
  const { value, handleValueChange, isValid } = props.emailInputHandler;

  return (
    <TextField
      {...props}
      type="email"
      value={value}
      onChange={handleValueChange}
      required
    ></TextField>
  );
}
