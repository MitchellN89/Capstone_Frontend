import { Outlet } from "react-router-dom";
import NavBarV from "./Components/NavBarV";
import { Container } from "@mui/material";
import { ChatEntryProvider } from "../../context/ChatEntryProvider";
import { ServiceVProvider } from "../../context/ServiceVProvider";

// this component is the parent component for all vendor pages.
// it provides the navbar, services and chat entries

export default function Vendor() {
  return (
    <>
      <NavBarV></NavBarV>
      <ServiceVProvider>
        <ChatEntryProvider>
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </ChatEntryProvider>
      </ServiceVProvider>
    </>
  );
}
