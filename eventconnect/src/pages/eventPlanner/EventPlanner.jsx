import { Outlet } from "react-router-dom";

import NavBarEP from "./Components/NavBarEP";
import { Container } from "@mui/material";
import Overlay from "../../components/Overlay";
import Modal from "../../components/ModalContainer";
import ModalContainer from "../../components/ModalContainer";
import { EventEPProvider } from "../../context/EventEPProvider";

export default function EventPlanner() {
  return (
    <>
      <Overlay></Overlay>
      <NavBarEP></NavBarEP>
      {/* <ModalContainer>
        <h1>Test</h1>
      </ModalContainer> */}
      <EventEPProvider>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </EventEPProvider>
    </>
  );
}
