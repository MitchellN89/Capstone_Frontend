import { useReducer, useState } from "react";

export default function useNotificationOptions() {
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [options, setOptions] = useState({
    title: "",
    message: "",
    severity: "success",
    duration: 6000,
  });

  const handleOptions = (newOptions) => {
    const allowedOptions = {
      title: newOptions.title || "",
      message: newOptions.message || "",
      severity: newOptions.severity || "success",
      duration: newOptions.duration || 6000,
    };
    setOptions((oldOptions) => ({ ...oldOptions, ...allowedOptions }));
    triggerNotification();
  };

  const triggerNotification = () => {
    setOpen(true);
  };

  const sendBack = {
    open,
    handleClose,
    ...options,
  };

  return [sendBack, handleOptions, triggerNotification];
}
