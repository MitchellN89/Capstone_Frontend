import { Outlet } from "react-router-dom";
import NavBarEP from "./Components/NavBarEP";
import { Container } from "@mui/material";
import { EventEPProvider } from "../../context/EventEPProvider";
import { ServicesEPProvider } from "../../context/EventServiceEPProvider";
import { ChatEntryProvider } from "../../context/ChatEntryProvider";

// EventPlanner.jsx is the parent container underneath EventConnect.jsx which acts as the wrapper container for all eventPlanner pages
// It provides the Events, Servces, ChatEntry contexts
// NavBarEP is also here

export default function EventPlanner() {
  return (
    <>
      <NavBarEP></NavBarEP>
      <EventEPProvider>
        <ServicesEPProvider>
          <ChatEntryProvider>
            <Container maxWidth="xl">
              <Outlet />
            </Container>
          </ChatEntryProvider>
        </ServicesEPProvider>
      </EventEPProvider>
    </>
  );
}
