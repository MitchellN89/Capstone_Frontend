import { Grid } from "@mui/material";
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
import CardCreate from "../../components/CardCreate";
import { useChatEntryContext } from "../../context/ChatEntryProvider";

export default function ServicesEP() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { eventId } = useParams();
  const { state: serviceContext, dispatch: servicesDispatch } =
    useServicesEPContext();
  const { dispatch: eventDispatch } = useEventsEPContext();
  const { state: chatEntryContext } = useChatEntryContext();
  const { chatEntries } = chatEntryContext || {};
  const eventServices = serviceContext.eventServices.filter(
    (service) => service.eventId == eventId
  );

  useEffect(() => {
    console.log("ServicesEP.jsx > eventServices: ", eventServices);
  }, [eventServices]);

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

  const handleOpenCreateModal = (bool = true) => {
    setOpenCreateModal(bool);
  };

  const handleClick = (id) => {
    if (isLoading) return;
    navigate(`/eventPlanner/${eventId}/${id}`);
  };

  useEffect(() => {
    let ignore = false;
    if (eventServices.length === 0) {
      servicesDispatch({ type: "PROCESSING_REQUEST" });
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
      <HeaderStrip>
        <Header1 style={{ margin: "0" }}>SERVICES</Header1>
        <ButtonLogoCreate handleClick={handleOpenCreateModal} />
      </HeaderStrip>

      <Grid container spacing={3} marginBottom={4}>
        {eventServices &&
          eventServices.map((eventService) => {
            const hasPromotedVendor = eventService.vendorId ? true : false;

            const chatQuantity = chatEntries.filter((entry) => {
              return (
                entry.vendorEventConnection.eventService.id == eventService.id
              );
            }).length;
            return (
              <CardServiceEP
                key={eventService.id}
                hasPromotedVendor={hasPromotedVendor}
                eventServiceId={eventService.id}
                serviceName={getService(eventService.serviceId).service}
                imgUrl={getService(eventService.serviceId).imgUrl}
                handleClick={handleClick}
                handleDelete={handleDelete}
                chatQuantity={chatQuantity}
              />
            );
          })}
        <CardCreate
          label="CREATE NEW SERVICE"
          handleClick={() => {
            handleOpenCreateModal(true);
          }}
        />
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
