import { Outlet } from "react-router-dom";
import BackgroundImageCarousel from "./Components/BackgroundImageCarousel";
import NotificationPopup from "../../components/NotifcationPopup";
import { useNotification } from "../../context/NotificationProvider";

const imageUrls = ["/Wedding2.jpg", "/Party.jpg"];

// This is the parent container of BOTH accountTypes.
// It sets up the notification sandbox and the background carousel images

export default function EventConnect({ children }) {
  const { notificationProps } = useNotification(); // this context provides the NotificationPopup component on this page it's props and instructs it when to show a message
  return (
    <>
      <BackgroundImageCarousel imageUrls={imageUrls} cycleTime={15} />
      {children}
      <NotificationPopup {...notificationProps} />
    </>
  );
}
