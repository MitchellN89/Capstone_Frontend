import { Grid } from "@mui/material";
import GridCard from "../../../components/GridCard";
import useData from "../../../hooks/useData";
import CreateCard from "../../../components/CreateCard";
import { useParams } from "react-router-dom";

export default function ServicesEP() {
  const { eventId } = useParams();
  const [services, isLoadingEvents, handleTrigger] = useData(
    `/events/${eventId}/services`
  );

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      <h1>Services</h1>
      <Grid container spacing={3}>
        {services &&
          services.map((service) => {
            return (
              <GridCard
                handleTrigger={handleTrigger}
                hasDelete
                id={service.id}
                key={service.id}
                service={service}
              ></GridCard>
            );
          })}
        <CreateCard url={`/eventplanner/${eventId}/createservice`}></CreateCard>
      </Grid>
    </>
  );
}
