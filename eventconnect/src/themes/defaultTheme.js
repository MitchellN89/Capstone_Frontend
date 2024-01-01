import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  containers: {
    width: {
      sm: "500px",
      md: "700px",
      lg: "900px",
      xl: "1100px",
    },
  },
});

export default defaultTheme;
