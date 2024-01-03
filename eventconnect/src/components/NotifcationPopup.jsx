import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { AlertTitle } from "@mui/material";

export default function NotificationPopup({
  title,
  message,
  severity,
  variant,
  duration,
  handleClose,
  open,
}) {
  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        if (open) {
          handleClose();
        }
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open]);

  return (
    <Box sx={{ width: "100%", marginY: "20px" }}>
      <Collapse in={open}>
        <Alert
          severity={severity}
          variant={variant}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {title ? <AlertTitle>{title}</AlertTitle> : null}
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
}
