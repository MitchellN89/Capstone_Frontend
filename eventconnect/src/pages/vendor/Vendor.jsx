import { Outlet } from "react-router-dom";

import NavBarEP from "./Components/NavBarEP";
import { Container } from "@mui/material";
import Overlay from "../../components/Overlay";
import Modal from "../../components/ModalContainer";
import ModalContainer from "../../components/ModalContainer";
import { EventEPProvider } from "../../context/EventEPProvider";
import { ServicesEPProvider } from "../../context/EventServiceEPProvider";

export default function Vendor() {
  return (
    <>
      <Overlay></Overlay>
      <NavBarEP></NavBarEP>
      {/* <ModalContainer>
        <h1>Test</h1>
      </ModalContainer> */}
      {/* <EventEPProvider> */}
      {/* <ServicesEPProvider> */}
      <Container maxWidth="xl">
        <Outlet />
      </Container>
      {/* </ServicesEPProvider> */}
      {/* </EventEPProvider> */}
    </>
  );
}
