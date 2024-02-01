import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import defaultTheme from "../themes/defaultTheme";

// I created this component as a setup for further implementation. Having the ThemeProvider within a component allows me to dynamically pass in different themes.
// Future implementation will allow the user to change their settings and have various different themes enabled in the app

export default function VariableTheme({ children }) {
  // for now, only blueTheme exists. Further down the line, multiple themes will exist as well as a method for changing them.
  const blueTheme = createTheme({
    palette: {
      mode: "light",
      feature: { 1: "#003475", 2: "#1d63b8", 3: "#8BBAF5" },
      gradients: { 1: "#181818", 2: "#2D2D2D", 3: "#E4E4E4", 4: "#F3F3F3" },
    },
    containers: { ...defaultTheme.containers },
  });

  return <ThemeProvider theme={blueTheme}>{children}</ThemeProvider>;
}
