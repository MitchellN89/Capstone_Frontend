import { IconLoading } from "./Icons";
import { Button } from "@mui/material";

export function ButtonLoading({
  isLoading,
  isLocked,
  label,
  labelWhenLoading,
  style,
  ...others
}) {
  return (
    <Button
      style={{ marginTop: "10px", ...style }}
      variant="contained"
      type="submit"
      disabled={isLoading || isLocked ? true : false}
      {...others}
    >
      {isLoading ? (
        <>
          {labelWhenLoading || "Loading"} <IconLoading />
        </>
      ) : (
        label || "Button"
      )}
    </Button>
  );
}
