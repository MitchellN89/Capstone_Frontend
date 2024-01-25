import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Container } from "@mui/system";
import FullScreenContainer from "./FullScreenContainer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  maxWidth: "98vw",
  bgcolor: "background.paper",
  maxHeight: "95vh",
  overflow: "auto",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalContainer({
  open,
  handleOpen,
  children,
  maxWidth,
}) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleOpen(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* <FullScreenContainer justifyCenter alignCenter> */}
      <Container maxWidth={maxWidth || "xl"}>
        <div style={style}>{children}</div>
      </Container>
      {/* </FullScreenContainer> */}
    </Modal>
  );
}
