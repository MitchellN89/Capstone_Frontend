import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Header3 } from "./Texts/TextHeaders";
import { Button, Paper } from "@mui/material";

// Filter bar for the main pages that contain cards.
// this is mostly just a wrapper accordian with a reset button (which runs resetFilters)

export default function ControlledAccordions({ children, resetFilters }) {
  const [expanded, setExpanded] = React.useState(false);

  const style = {
    marginBottom: "30px",
    gap: "20px",
    padding: "10px 35px",
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        style={{
          backgroundColor: "rgba(0,0,0,0)",
          boxShadow: "none",
          margin: "0 0 30px 0",
        }}
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          style={{ padding: "0" }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Header3 style={{ margin: "0" }}>FITLERS</Header3>
        </AccordionSummary>
        <AccordionDetails style={{ padding: "0" }}>
          <Paper>
            <div style={style}>
              <Grid container spacing={3}>
                {children}
              </Grid>
              <Button style={{ marginTop: "20px" }} onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
