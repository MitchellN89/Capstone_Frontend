import { Grid } from "@mui/material";
import { Box } from "@mui/system";

import { convertFormDataToObject } from "../utilities/formData";
import axios from "axios";

export default function FormGrid({
  children,
  isValidForm,
  urlOnSubmit,
  method = "get",
  handleReset,
  handleIsLocked,
  handleIsLoading,
}) {
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const payload = convertFormDataToObject(new FormData(evt.target));

    await axios[method]();
  };

  return (
    <>
      <Box paddingX={5}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {children}
          </Grid>
        </form>
      </Box>
    </>
  );
}
