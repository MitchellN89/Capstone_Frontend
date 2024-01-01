import { Outlet } from "react-router-dom";
import BackgroundImageCarousel from "./Components/BackgroundImageCarousel";

export default function Auth() {
  const imageUrls = ["/Wedding2.jpg", "/Party.jpg"];
  return (
    <>
      <BackgroundImageCarousel imageUrls={imageUrls} cycleTime={15} />
      <Outlet />
    </>
  );
}
