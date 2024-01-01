import styled from "@emotion/styled";
import BackgroundImage from "./BackgroundImage";
import { useState, useRef, useMemo } from "react";

export default function BackgroundImageCarousel({ cycleTime, imageUrls }) {
  const [currentImage, setCurrentImage] = useState(0);
  const animatingImage = useRef();

  const Overlay = useMemo(() =>
    styled("div")(({ theme }) => ({
      position: "fixed",
      top: "0",
      left: "0",
      // backgroundColor: theme.palette.mode === "light" ? "black" : "white",
      height: "100vh",
      width: "100vw",
    }))
  );

  const Container = styled("div")({
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "-1",
  });

  function handleImageChange() {
    setTimeout(() => {
      setCurrentImage((prevImg) => {
        const next = prevImg < imageUrls.length - 1 ? prevImg + 1 : 0;

        return next;
      });
    }, 2000);
  }

  return (
    <Container>
      {/* <Overlay></Overlay> */}

      <BackgroundImage
        onAnimationEnd={handleImageChange}
        src={imageUrls[currentImage]}
        cycleTime={cycleTime}
        animatingImage={animatingImage}
      ></BackgroundImage>
      <h1 style={{ zIndex: "9999" }}>dsfkvjhbsdflkjh</h1>
    </Container>
  );
}
