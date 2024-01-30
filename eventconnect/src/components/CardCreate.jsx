import { Grid } from "@mui/material";
import { Header3 } from "./Texts/TextHeaders";
import { useState } from "react";
import { IconCreate } from "./Icons";

export default function CardCreate({ label, handleClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // styling for hover is handled within component using isHovered state
  const handleHover = (bool) => {
    setIsHovered(bool);
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

  const cardStyle = {
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
        style={cardStyle}
        onMouseEnter={() => {
          handleHover(true);
        }}
        onMouseLeave={() => {
          handleHover(false);
        }}
        onClick={handleClick}
      >
        <div style={overlayStyle} />
        <div style={contentBoxStyle}>
          <IconCreate
            height="50px"
            style={{
              color: "white",
              position: "relative",
              zIndex: "10",
            }}
          />
          <Header3 style={{ margin: "10px 0 0 0" }}>{label}</Header3>
        </div>
      </div>
    </Grid>
  );
}
