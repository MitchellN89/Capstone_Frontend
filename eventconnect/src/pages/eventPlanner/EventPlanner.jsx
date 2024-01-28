import { Outlet } from "react-router-dom";

import NavBarEP from "./Components/NavBarEP";
import { Container } from "@mui/material";
import Overlay from "../../components/Overlay";
import Modal from "../../components/ModalContainer";
import ModalContainer from "../../components/ModalContainer";
import { EventEPProvider } from "../../context/EventEPProvider";
import { ServicesEPProvider } from "../../context/EventServiceEPProvider";
import { ChatEntryProvider } from "../../context/ChatEntryProvider";

export default function EventPlanner() {
  return (
    <>
      {/* <Overlay></Overlay> */}
      <NavBarEP></NavBarEP>
      {/* <ModalContainer>
        <h1>Test</h1>
      </ModalContainer> */}
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
