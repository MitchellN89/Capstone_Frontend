import styled from "@emotion/styled";
import "../../../styles/animations.css";

const Image = styled("div")({
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100vw",
  scale: "1.2",
});

const BackgroundImage = ({ src, cycleTime, onAnimationEnd }) => {
  // onAnimationEnd, the function from BackgroundImageCarousel is fired and src changes, causing the Image to re-render and the animation to restart with a new image
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
