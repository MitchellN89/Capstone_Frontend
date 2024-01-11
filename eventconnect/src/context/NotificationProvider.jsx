import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const defaultOptions = {
    message: "",
    severity: "success",
    duration: 6000,
  };

  const [options, setOptions] = useState(defaultOptions);

  const triggerNotification = (newOptions) => {
    console.log("triggerNotification: ", newOptions);
    const allowedOptions = {
      message: newOptions.message || "",
      severity: newOptions.severity || "success",
      duration: newOptions.duration || 6000,
    };
    setOptions(allowedOptions);
    setOpen(true);
  };

  useEffect(() => {
    console.log(open);
  }, [open]);

  const notificationProps = {
    open,
    handleClose,
    ...options,
  };

  return (
    <NotificationContext.Provider
      value={{ notificationProps, triggerNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
