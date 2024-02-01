import { useState } from "react";
import { IconCreate } from "../Icons";
import { useTheme } from "@emotion/react";

// custom icon button

export default function ButtonLogoCreate({ handleClick, logoSize }) {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const handleHovered = (bool) => {
    setIsHovered(bool);
  };

  const iconStyle = {
    color: isHovered ? theme.palette.feature[2] : "black",
  };

  return (
    <div
      onMouseEnter={() => {
        handleHovered(true);
      }}
      onMouseLeave={() => {
        handleHovered(false);
      }}
      onClick={(evt) => {
        evt.stopPropagation();
        setIsHovered(false);
        handleClick(true);
      }}
    >
      <IconCreate height={logoSize || "30px"} style={iconStyle} />
    </div>
  );
}
