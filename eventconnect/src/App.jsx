import AppRoutes from "./routes/AppRoutes";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { UserProvider } from "./context/UserProvider";
import VariableTheme from "./components/VariableTheme";

function App() {
  return (
    <>
      <CssBaseline /> {/* resets the css */}
      <UserProvider>
        <VariableTheme>
          <AppRoutes></AppRoutes>
        </VariableTheme>
      </UserProvider>
    </>
  );
}

export default App;
