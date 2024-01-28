import AppRoutes from "./routes/AppRoutes";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { UserProvider } from "./context/UserProvider";
import VariableTheme from "./components/VariableTheme";
import EventConnect from "./pages/eventConnet/EventConnect";
import { NotificationProvider } from "./context/NotificationProvider";
import { GoogleMapsProvider } from "./context/GoogleMapsProvider";
import { FilterPreferencesProvider } from "./context/FilterPreferencesProvider";

function App() {
  return (
    <>
      <CssBaseline /> {/* resets the css */}
      <UserProvider>
        <FilterPreferencesProvider>
          <VariableTheme>
            <NotificationProvider>
              <GoogleMapsProvider>
                <EventConnect>
                  <AppRoutes></AppRoutes>
                </EventConnect>
              </GoogleMapsProvider>
            </NotificationProvider>
          </VariableTheme>
        </FilterPreferencesProvider>
      </UserProvider>
    </>
  );
}

export default App;
