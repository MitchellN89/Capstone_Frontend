import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import CreateCard from "../../components/CreateCard";
import { useParams } from "react-router-dom";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { useEffect } from "react";
import { apiCall } from "../../utilities/apiCall";
import { useNavigate } from "react-router-dom";

export default function ServicesEP() {
  const { eventId } = useParams();
  const { state: services, dispatch: servicesDispatch } =
    useServicesEPContext();
  const eventServices = services.eventServices.filter(
    (service) => service.eventId == eventId
  );
  const { isLoading } = services;
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (isLoading) return;
    servicesDispatch({ type: "PROCESSING_REQUEST" });

    apiCall(`/events/${eventId}/services/${id}`, "delete")
      .then(() => {
        servicesDispatch({ type: "DELETE_EVENT_SERVICE", id });
      })
      .catch((err) => {
        servicesDispatch({ type: "REQUEST_FAILED", error: err });
        console.error(err);
      });
  };

  const handleClick = (id) => {
    if (isLoading) return;
    navigate(`/eventPlanner/${eventId}/${id}`);
  };

  useEffect(() => {
    if (eventServices.length === 0) {
      servicesDispatch({ type: "PROCESSING_REQUEST" });
      apiCall(`/events/${eventId}/services`)
        .then((result) => {
          servicesDispatch({
            type: "GET_EVENT_SERVICES",
            payload: result.data,
            response: result.response,
          });
        })
        .catch((err) => {
          console.error(err);
          servicesDispatch({ type: "REQUEST_FAILED", error: err });
        });
    }
  }, []);

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      <h1>Services</h1>
      <Grid container spacing={3}>
        {eventServices &&
          eventServices.map((eventService) => {
            return (
              <GridCard
                hasDelete
                id={eventService.id}
                key={eventService.id}
                service={eventService}
                handleClick={handleClick}
                handleDelete={handleDelete}
              >
                {
                  services.services.find(
                    (service) => service.id == eventService.serviceId
                  ).service
                }
              </GridCard>
            );
          })}
        <CreateCard url={`/eventplanner/${eventId}/createservice`}>
          CREATE EVENT SERVICE
        </CreateCard>
      </Grid>
    </>
  );
}
