import { Grid } from "@mui/material";
import { Header3 } from "../../../components/Texts/TextHeaders";
import { useState } from "react";
import ButtonLogoDelete from "../../../components/Buttons/ButtonLogoDelete";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function CardEventEP({
  eventName,
  hasOutstanding,
  hasPromotedVendors,
  handleClick,
  handleDelete,
  eventId,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (bool) => {
    setIsHovered(bool);
  };

  const divStyle = {
    backgroundImage: `url('${DOMAIN}/uploads/events/event${eventId}.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "200px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: isHovered
      ? "8px 8px 12px rgb(0, 0, 0, 0.4)"
      : "4px 4px 5px rgb(0, 0, 0, 0.4)",
    transform: isHovered ? "scale(1.04)" : "",
    transition: "transform 0.3s, box-shadow 0.3s ease",
  };

  const overlayStyle = {
    backgroundColor: "black",
    opacity: isHovered ? "0.8" : "0.6",
    position: "absolute",
    left: "0px",
    top: "0px",
    height: "100%",
    width: "100%",
    zIndex: "5",
    transition: "opacity 0.3s",
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <div
        style={divStyle}
        onMouseEnter={() => {
          handleHover(true);
        }}
        onMouseLeave={() => {
          handleHover(false);
        }}
        onClick={() => {
          handleClick(eventId);
        }}
      >
        <div style={overlayStyle} />
        <Header3 style={{ color: "white", position: "relative", zIndex: "10" }}>
          {eventName}
        </Header3>
        <ButtonBox isHovered={isHovered}>
          <ButtonLogoDelete
            isVisible={isHovered && !hasPromotedVendors}
            handleDelete={handleDelete}
            id={eventId}
          />
        </ButtonBox>
      </div>
    </Grid>
  );
}

const ButtonBox = ({ children }) => {
  const buttonBoxStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    position: "absolute",
    right: "10px",
    bottom: "0px",
    color: "white",
    zIndex: "10",
  };
  return <div style={buttonBoxStyle}>{children}</div>;
};
