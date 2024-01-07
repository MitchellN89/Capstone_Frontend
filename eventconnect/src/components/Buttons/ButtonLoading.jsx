import { IconLoading } from "../Icons";
import { Button } from "@mui/material";

export default function ButtonLoading({
  isLoading,
  disabled,
  label,
  labelWhenLoading,
  icon,
  variant,
  variantWhenLoading,
  ...others
}) {
  return (
    <Button
      variant={
        isLoading ? variantWhenLoading || "contained" : variant || "contained"
      }
      disabled={disabled || isLoading}
      {...others}
    >
      {isLoading ? labelWhenLoading || "Submitting " : label || "Submit"}
      {isLoading ? (
        <>
          <IconLoading />
        </>
      ) : (
        icon || ""
      )}
    </Button>
  );
}
