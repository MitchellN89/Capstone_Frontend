import * as React from "react";
import Modal from "@mui/material/Modal";
import { Container } from "@mui/system";

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
  boxShadow: 24,
  p: 4,
};

// Modal container
// wrapper for other components

export default function ModalContainer({
  open,
  handleOpen,
  children,
  maxWidth,
}) {
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
