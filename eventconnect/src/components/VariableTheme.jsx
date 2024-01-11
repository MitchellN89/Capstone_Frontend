import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import defaultTheme from "../themes/defaultTheme";

export default function VariableTheme({ children }) {
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
