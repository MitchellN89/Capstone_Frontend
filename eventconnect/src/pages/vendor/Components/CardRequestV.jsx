import { Grid, styled } from "@mui/material";
import { Header2, Header3 } from "../../../components/Texts/TextHeaders";
import { useState } from "react";
import ButtonLogoDelete from "../../../components/Buttons/ButtonLogoDelete";
import { Text } from "../../../components/Texts/Texts";

const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export default function CardRequestV({
  eventName,
  handleClick,
  eventId,
  eventServiceId,
  serviceName,
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
    flexDirection: "column",
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
          handleClick(eventServiceId);
        }}
      >
        <ServiceTag serviceName={serviceName} />
        <div style={overlayStyle} />

        <Header2
          style={{
            color: "white",
            position: "relative",
            zIndex: "10",
            margin: "0",
          }}
        >
          {eventName}
        </Header2>
      </div>
    </Grid>
  );
}

const serviceTagStlye = {
  position: "absolute",
  right: "10px",
  bottom: "10px",
  backgroundColor: "#dfdfdf",
  padding: "5px 10px",
  zIndex: "10",
  borderRadius: "22px",
};

const ServiceTag = ({ serviceName }) => {
  return (
    <div style={serviceTagStlye}>
      <Text size="sm" bold style={{ margin: "0" }}>
        {serviceName || "Test"}
      </Text>
    </div>
  );
};
