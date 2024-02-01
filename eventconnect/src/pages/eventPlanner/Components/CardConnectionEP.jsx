import { Grid } from "@mui/material";
import { Header3 } from "../../../components/Texts/TextHeaders";
import { useState } from "react";
import ChatBadge from "../../../components/ChatBadge";

export default function CardConnectionEP({
  handleClick,
  vendorId,
  companyName,
  chatQuantity,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleIsHovered = (bool) => {
    setIsHovered(bool);
  };

  const divStyle = {
    backgroundColor: isHovered ? "rgb(0, 0, 0, 0.8)" : "rgb(0, 0, 0, 0.6)",
    color: "white",
    padding: "10px 30px",
    borderRadius: "10px",
    position: "relative",
    transition: "background-color 0.3s",
  };

  return (
    <Grid item xs={12}>
      <div
        style={divStyle}
        // hovering mouse over component sets hovered to true, therefore changing the style
        onMouseEnter={() => {
          handleIsHovered(true);
        }}
        // not hovering over the component sets hovered to false
        onMouseLeave={() => {
          handleIsHovered(false);
        }}
        onClick={() => {
          handleClick(vendorId);
        }}
      >
        {/* chat badge displays the number of unread messages in this connection */}
        <ChatBadge quantity={chatQuantity} />
        <Header3 centered style={{ margin: "0" }}>
          {companyName}
        </Header3>
      </div>
    </Grid>
  );
}
