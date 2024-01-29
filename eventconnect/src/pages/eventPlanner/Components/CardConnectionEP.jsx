import { Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Header3 } from "../../../components/Texts/TextHeaders";
import { useState } from "react";
import { styled } from "@mui/material";
import ChatBadge from "../../../components/ChatBadge";

export default function CardConnectionEP({
  handleClick,
  isLoading,
  children,
  vendorId,
  companyName,
  chatQuantity,
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const handleIsHovered = (bool) => {
    setIsHovered(bool);
  };

  const StyledDiv = styled("div")(() => ({
    backgroundColor: "rgb(0, 0, 0, 0.6)",
    color: "white",
    padding: "10px 30px",
    borderRadius: "10px",
    position: "relative",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "rgb(0, 0, 0, 0.8)",
    },
  }));

  return (
    <Grid item xs={12}>
      <StyledDiv
        onMouseEnter={() => {
          handleIsHovered(true);
        }}
        onMouseLeave={() => {
          handleIsHovered(false);
        }}
        onClick={() => {
          handleClick(vendorId);
        }}
      >
        <ChatBadge quantity={chatQuantity} />
        <Header3 centered style={{ margin: "0" }}>
          {companyName}
        </Header3>
      </StyledDiv>
    </Grid>
  );
}
