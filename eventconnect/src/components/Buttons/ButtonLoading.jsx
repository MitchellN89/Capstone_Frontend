import { IconLoading } from "../Icons";
import { Button } from "@mui/material";

export default function ButtonLoading({
  isLoading,
  labelWhenLoading,
  children,
  variant,
  ...others
}) {
  return (
    <Button
      variant={isLoading ? "outlined" : variant || "contained"}
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
