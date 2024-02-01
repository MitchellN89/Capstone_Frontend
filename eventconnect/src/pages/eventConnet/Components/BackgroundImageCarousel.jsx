import BackgroundImage from "./BackgroundImage";
import { useState } from "react";
import Overlay from "../../../components/Overlay";

// This component is the parent container for the rotating background images

export default function BackgroundImageCarousel({ cycleTime, imageUrls }) {
  // imageUrls are passed in. these are links to reacts servers public folder, where the images are found.
  // a cycleTime is also passed in to determine how long the animation should take to complete
  const [currentImage, setCurrentImage] = useState(0); //currentImage is a reference to the index of the imageUrls array. It indicates which image should be shown.

  // styling below sets the image to always take up the full screen. It'll crop and center when the screen is resized
  const containerStyles = {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "-1",
  };

  // the below function handles the change of currentImage. after the animation ends, the function is fired and after 2 seconds (for error margin), a new image is displayed and the animation starts again
  function handleImageChange() {
    setTimeout(() => {
      setCurrentImage((prevImg) => {
        const next = prevImg < imageUrls.length - 1 ? prevImg + 1 : 0;

        return next;
      });
    }, 2000);
  }

  return (
    <div style={containerStyles}>
      <Overlay></Overlay>
      {/* an overlay is used to soften the image. make it less vibrant */}
      <BackgroundImage
        onAnimationEnd={handleImageChange}
        src={imageUrls[currentImage]}
        cycleTime={cycleTime}
      ></BackgroundImage>
    </div>
  );
}
