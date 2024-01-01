import React, { useEffect, memo } from "react";
import styled from "@emotion/styled";
import "../../../styles/animations.css";

const Image = styled("div")({
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100vw",
  scale: "1.2",
});

const BackgroundImage = ({
  src,
  cycleTime,
  animatingImage,
  onAnimationEnd,
}) => {
  return (
    <Image
      onAnimationEnd={onAnimationEnd}
      key={src}
      style={{
        backgroundImage: `url('${src}')`,
        animation: `fadeInTravelAndFadeOut ${cycleTime}s linear both`,
      }}
    ></Image>
  );
};

export default BackgroundImage;
