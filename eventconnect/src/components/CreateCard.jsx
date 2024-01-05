import { Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreateCard({ url, children }) {
  const styles = {
    minHeight: "200px",
    height: "100%",
  };
  const navigate = useNavigate();

  return (
    <Grid
      onClick={() => {
        navigate(url);
      }}
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      xl={2}
    >
      <Paper style={styles}>
        <h2>{children}</h2>
      </Paper>
    </Grid>
  );
}
