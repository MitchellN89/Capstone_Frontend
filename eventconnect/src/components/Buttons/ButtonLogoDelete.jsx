import { useState } from "react";
import { IconDelete } from "../Icons";
import { useTheme } from "@emotion/react";

// custom icon button
// can be hidden if required (set isVisible to false)

export default function ButtonLogoDelete({
  isVisible,
  handleClick,
  id,
  logoSize,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const handleHovered = (bool) => {
    setIsHovered(bool);
  };

  const iconStyle = {
    color: isHovered ? theme.palette.error.main : "unset",
  };

  if (!isVisible) return;
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
        handleClick(id);
      }}
    >
      <IconDelete height={logoSize || "30px"} style={iconStyle} />
    </div>
  );
}
