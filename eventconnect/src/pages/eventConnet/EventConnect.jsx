import { Outlet } from "react-router-dom";
import BackgroundImageCarousel from "./Components/BackgroundImageCarousel";
import NotificationPopup from "../../components/NotifcationPopup";
import { useNotification } from "../../context/NotificationProvider";

const imageUrls = ["/Wedding2.jpg", "/Party.jpg"];

export default function EventConnect({ children }) {
  const { notificationProps } = useNotification();
  return (
    <>
      <BackgroundImageCarousel imageUrls={imageUrls} cycleTime={15} />
      {children}
      <NotificationPopup {...notificationProps} />
    </>
  );
}
