import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utilities/apiCall";

export default function GridCard({ hasDelete, id, handleTrigger, children }) {
  const styles = {
    minHeight: "200px",
    height: "100%",
  };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (evt) => {
    evt.stopPropagation();
    setIsLoading(true);
    console.log(`EVENTSEP DELETE EVENT ${id}`);
    await apiCall(`/events/${id}`, "delete")
      .then(() => {
        console.log("MARKER: Notification req");
        handleTrigger();
      })
      .catch((err) => {
        console.error(err);
        console.log("MARKER: Notification req");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Grid
      onClick={() => {
        if (isLoading) return;
        navigate(`/eventPlanner/${id}`);
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
        {hasDelete && (
          <button disabled={isLoading} onClick={handleDelete}>
            QUICK DELETE
          </button>
        )}
      </Paper>
    </Grid>
  );
}
