import { Grid } from "@mui/material";
import { Header3 } from "./Texts/TextHeaders";
import { IconLoading } from "./Icons";

export default function CardLoading({ isLoading }) {
  const Card = ({ children }) => {
    return (
      <div
        style={{
          height: "200px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "4px 4px 5px rgb(0, 0, 0, 0.4)",
        }}
      >
        {children}
      </div>
    );
  };

  const Overlay = ({ children }) => {
    return (
      <div
        style={{
          backgroundColor: "black",
          opacity: "0.6",
          position: "absolute",
          left: "0px",
          top: "0px",
          height: "100%",
          width: "100%",
          zIndex: "5",
        }}
      >
        {children}
      </div>
    );
  };

  const ContentBox = ({ children }) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: "10",
          color: "white",
        }}
      >
        {children}
      </div>
    );
  };

  if (!isLoading) return;
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <Overlay />
        <ContentBox>
          <IconLoading
            height="50px"
            style={{
              color: "white",
              position: "relative",
              zIndex: "10",
            }}
          />
          <Header3 style={{ margin: "10px 0 0 0" }}>LOADING...</Header3>
        </ContentBox>
      </Card>
    </Grid>
  );
}
