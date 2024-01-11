import { Grid, Paper } from "@mui/material";

export default function EventCardV({
  eventServiceId,
  handleClick,
  isLoading,
  children,
}) {
  const styles = {
    minHeight: "200px",
    height: "100%",
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Paper
        onClick={() => {
          handleClick(eventServiceId);
        }}
        style={styles}
      >
        <span>{children}</span>
      </Paper>
    </Grid>
  );
}
