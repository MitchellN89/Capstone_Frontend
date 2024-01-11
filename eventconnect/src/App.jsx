import AppRoutes from "./routes/AppRoutes";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { UserProvider } from "./context/UserProvider";
import VariableTheme from "./components/VariableTheme";
import EventConnect from "./pages/eventConnet/EventConnect";
import { NotificationProvider } from "./context/NotificationProvider";

function App() {
  return (
    <>
      <CssBaseline /> {/* resets the css */}
      <UserProvider>
        <VariableTheme>
          <NotificationProvider>
            <EventConnect>
              <AppRoutes></AppRoutes>
            </EventConnect>
          </NotificationProvider>
        </VariableTheme>
      </UserProvider>
    </>
  );
}

export default App;
