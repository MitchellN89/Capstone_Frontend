import { createTheme } from "@mui/material";
import blueTheme from "./blueTheme";
import greenTheme from "./greenTheme";

const customTheme = createTheme({
  blue: { ...blueTheme },
  green: { ...greenTheme },
});

const themes = { blue: blueTheme, green: greenTheme };
export default themes;
