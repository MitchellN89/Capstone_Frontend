import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utilities/apiCall";
import { useEventsEPContext } from "../context/EventEPProvider";

export default function GridCard({ hasDelete, id, handleTrigger, children }) {
  const styles = {
    minHeight: "200px",
    height: "100%",
  };
  const navigate = useNavigate();
  const { state: events, dispatch: eventsDispatch } = useEventsEPContext();
  const { isLoading } = events;

  const handleDelete = async (evt) => {
    evt.stopPropagation();
    eventsDispatch({ type: "PROCESSING_REQUEST" });
    try {
      await apiCall(`/events/${id}`, "delete");
      eventsDispatch({ type: "DELETE_EVENT", id });
      console.log("MARKER: Notification req");
    } catch (err) {
      eventsDispatch({ type: "REQUEST_FAILED", error: err });
      console.error(err);
      console.log("MARKER: Notification req");
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Paper
        onClick={() => {
          if (isLoading) return;
          navigate(`/eventPlanner/${id}`);
        }}
        style={styles}
      >
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
