import { IconLoading } from "./Icons";
import { Button } from "@mui/material";

export function ButtonLoading({
  isLoading,
  labelWhenLoading,
  style,
  children,
  ...others
}) {
  return (
    <Button
      style={{ marginTop: "10px", ...style }}
      variant="contained"
      {...others}
    >
      {isLoading ? (
        <>
          {labelWhenLoading || "Loading"} <IconLoading />
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
}
