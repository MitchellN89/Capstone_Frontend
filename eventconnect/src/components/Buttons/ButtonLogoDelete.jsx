import { useState } from "react";
import { IconDelete } from "../Icons";
import { useTheme } from "@emotion/react";

export default function ButtonLogoDelete({ isVisible, handleDelete, id }) {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const handleHovered = (bool) => {
    setIsHovered(bool);
  };

  const iconStyle = {
    color: isHovered ? theme.palette.error.main : "unset",
  };

  if (isVisible)
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
          handleDelete(id);
        }}
      >
        <IconDelete style={iconStyle} />
      </div>
    );

  return;
}
