import { Grid, styled } from "@mui/material";
import { Header3 } from "../../../components/Texts/TextHeaders";
import { useState } from "react";
import ButtonLogoDelete from "../../../components/Buttons/ButtonLogoDelete";
import { Text } from "../../../components/Texts/Texts";
import dayjs from "dayjs";
import ChatBadge from "../../../components/ChatBadge";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function CardEventEP({
  eventName,
  eventStartDateTime,
  eventEndDateTime,
  hasPromotedVendors,
  handleClick,
  handleDelete,
  eventId,
  chatQuantity,
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

  const contentBoxStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: "10",
    color: "white",
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
        <ChatBadge quantity={chatQuantity} />
        <div style={overlayStyle} />
        <div style={contentBoxStyle}>
          <Header3 style={{ margin: "0" }}>{eventName}</Header3>
          {eventStartDateTime && (
            <Text italic size="sm" style={{ margin: "0" }}>
              Start: {dayjs(eventStartDateTime).format("DD MMM YYYY, HH:mm a")}
            </Text>
          )}
          {eventEndDateTime && (
            <Text italic size="sm" style={{ margin: "0" }}>
              End: {dayjs(eventEndDateTime).format("DD MMM YYYY, HH:mm a")}
            </Text>
          )}
        </div>

        <ButtonBox isHovered={isHovered}>
          <ButtonLogoDelete
            isVisible={isHovered && !hasPromotedVendors}
            handleClick={handleDelete}
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
