import { Outlet } from "react-router-dom";

import NavBarV from "./Components/NavBarV";
import { Container } from "@mui/material";
import Overlay from "../../components/Overlay";

export default function Vendor() {
  return (
    <>
      {/* <Overlay></Overlay> */}
      <NavBarV></NavBarV>

      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </>
  );
}
