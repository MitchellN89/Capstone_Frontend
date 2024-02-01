import * as React from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

const style = {
  position: "absolute",
  right: "15px",
  top: "15px",
  zIndex: "10",
};

export default function ChatBadge({ quantity }) {
  if (!quantity) return;
  return (
    <Badge style={style} badgeContent={quantity} color="primary">
      <MailIcon style={{ color: "#dfdfdf" }} />
    </Badge>
  );
}
