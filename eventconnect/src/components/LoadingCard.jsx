import { Grid, Paper } from "@mui/material";
import { IconLoading } from "./Icons";

export default function LoadingCard({ isLoading }) {
  const styles = {
    minHeight: "200px",
    height: "100%",
  };

  if (!isLoading) return;
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Paper style={styles}>
        <h2>
          Loading <IconLoading />
        </h2>
      </Paper>
    </Grid>
  );
}
