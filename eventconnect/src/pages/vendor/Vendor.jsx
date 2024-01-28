import { Outlet } from "react-router-dom";
import NavBarV from "./Components/NavBarV";
import { Container } from "@mui/material";
import { ChatEntryProvider } from "../../context/ChatEntryProvider";
import { ServiceVProvider } from "../../context/ServiceVProvider";

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
