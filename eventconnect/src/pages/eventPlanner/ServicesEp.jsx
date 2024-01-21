import { Grid } from "@mui/material";
import GridCard from "../../components/GridCard";
import CreateCard from "../../components/CreateCard";
import { useParams } from "react-router-dom";
import { useServicesEPContext } from "../../context/EventServiceEPProvider";
import { useEffect, useState } from "react";
import { apiCall } from "../../utilities/apiCall";
import { useNavigate } from "react-router-dom";
import { useEventsEPContext } from "../../context/EventEPProvider";
import CreateServiceEP from "./CreateServiceEP";
import HeaderStrip from "../../components/HeaderStrip";
import ButtonLogoCreate from "../../components/Buttons/ButtonLogoCreate";
import { Header1 } from "../../components/Texts/TextHeaders";
import ModalContainer from "../../components/ModalContainer";
import CardServiceEP from "./Components/CardServiceEP";

export default function ServicesEP() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { eventId } = useParams();
  const { state: serviceContext, dispatch: servicesDispatch } =
    useServicesEPContext();
  const { dispatch: eventDispatch } = useEventsEPContext();

  const eventServices = serviceContext.eventServices.filter(
    (service) => service.eventId == eventId
  );
  const { services } = serviceContext;

  const { isLoading } = serviceContext;
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (isLoading) return;
    servicesDispatch({ type: "PROCESSING_REQUEST" });

    apiCall(`/events/${eventId}/services/${id}`, "delete")
      .then(() => {
        servicesDispatch({ type: "DELETE_EVENT_SERVICE", id });
        eventDispatch({ type: "DELETE_EVENT_SERVICE", id, eventId });
      })
      .catch((err) => {
        servicesDispatch({ type: "REQUEST_FAILED", error: err });
        console.error(err);
      });
  };

  const getService = (serviceId) => {
    return services.find((service) => {
      return service.id == serviceId;
    });
  };

  const handleOpenCreateModal = (bool) => {
    setOpenCreateModal(bool);
  };

  const handleClick = (id) => {
    if (isLoading) return;
    navigate(`/eventPlanner/${eventId}/${id}`);
  };

  console.log("ServicesEp.jsx > eventServices: ", eventServices);

  useEffect(() => {
    let ignore = false;
    if (eventServices.length === 0) {
      servicesDispatch({ type: "PROCESSING_REQUEST" });
      console.log("DEBUG > useEffect in ServicesEP running");
      apiCall(`/events/${eventId}/services`)
        .then((result) => {
          if (!ignore) {
            servicesDispatch({
              type: "GET_EVENT_SERVICES",
              payload: result.data,
              response: result.response,
            });
          }
        })
        .catch((err) => {
          if (!ignore) {
            console.error(err);
            servicesDispatch({ type: "REQUEST_FAILED", error: err });
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    // TODO Need title
    // TODO need serach criteria
    <>
      <CreateService
        open={openCreateModal}
        handleOpenCreateModal={handleOpenCreateModal}
      />
      <HeaderStrip style={{ marginTop: "30px" }}>
        <Header1 style={{ margin: "0" }}>SERVICES</Header1>
        <ButtonLogoCreate handleClick={handleOpenCreateModal} />
      </HeaderStrip>

      <Grid container spacing={3} marginBottom={4}>
        {eventServices &&
          eventServices.map((eventService) => {
            return (
              <CardServiceEP
                key={eventService.id}
                eventServiceId={eventService.id}
                serviceName={getService(eventService.serviceId).service}
                imgUrl={getService(eventService.serviceId).imgUrl}
                handleClick={handleClick}
                handleDelete={handleDelete}
              />

              // <GridCard
              //   hasDelete
              //   id={eventService.id}
              //   key={eventService.id}
              //   service={eventService}
              //   handleClick={handleClick}
              //   handleDelete={handleDelete}
              // >
              //   {
              //     services.services.find(
              //       (service) => service.id == eventService.serviceId
              //     ).service
              //   }
              // </GridCard>
            );
          })}
      </Grid>
    </>
  );
}

const CreateService = ({ open, handleOpenCreateModal }) => {
  return (
    <ModalContainer
      open={open}
      handleOpen={handleOpenCreateModal}
      maxWidth="md"
    >
      <CreateServiceEP handleOpen={handleOpenCreateModal} />
    </ModalContainer>
  );
};
