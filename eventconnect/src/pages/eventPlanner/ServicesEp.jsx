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
import { useNotification } from "../../context/NotificationProvider";

export default function ServicesEP() {
  const [openCreateModal, setOpenCreateModal] = useState(false); //modal open status (true/false)
  const { eventId } = useParams(); //extract eventId from url params
  const { state: serviceContext, dispatch: servicesDispatch } =
    useServicesEPContext(); //destructure state and dispatch from servicesEP context as custom names
  const { dispatch: eventDispatch } = useEventsEPContext(); //destructure dispatch from events context as custom name
  const { state: chatEntryContext } = useChatEntryContext(); //destructure state from chat entry context as custom name
  const { chatEntries } = chatEntryContext || {}; // destructure chatentries from chat entry state
  const { triggerNotification } = useNotification();

  // get relevant eventServices from all eventServices in context (using the eventId)
  const eventServices = serviceContext.eventServices.filter(
    (service) => service.eventId == eventId
  );

  // destructure services from serviceContext
  const { services, isLoading } = serviceContext;

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    // escape out if isLoading = true
    if (isLoading) return;

    // set state to isLoading = true
    servicesDispatch({ type: "PROCESSING_REQUEST" });

    //api call, delete eventService
    apiCall(`/events/${eventId}/services/${id}`, "delete")
      .then(() => {
        // reflect changes in state
        servicesDispatch({ type: "DELETE_EVENT_SERVICE", id });
        // also reflect changes in events state (it has a small amount of event service data)
        eventDispatch({ type: "DELETE_EVENT_SERVICE", id, eventId });
        //send success message
        triggerNotification({ message: "Successfully deleted event service" });
      })
      .catch((err) => {
        //return state to isLoading = false
        servicesDispatch({ type: "REQUEST_FAILED", error: err });
        console.error(err);

        //send error message
        triggerNotification({
          message:
            "Error while deleting event service. For more info, see console log",
          severity: "error",
        });
      });
  };

  //this function takes the serviceId (provided by the event data) and returns the correlated service
  const getService = (serviceId) => {
    return services.find((service) => {
      return service.id == serviceId;
    });
  };

  // handles open/close (true/false) for the modal visibility
  const handleOpenCreateModal = (bool = true) => {
    if (isLoading) return;
    setOpenCreateModal(bool);
  };

  // navigates to the event service that is clicked. This is passed into the event service card and the card passes in the eventservice id
  const handleClick = (id) => {
    if (isLoading) return;
    navigate(`/eventPlanner/${eventId}/${id}`);
  };

  useEffect(() => {
    //setup ignore for handling component unmounting and api data returning
    let ignore = false;

    // only do if there are no event services
    if (eventServices.length === 0) {
      // set state to isLoading = true
      servicesDispatch({ type: "PROCESSING_REQUEST" });

      // get all event services
      apiCall(`/events/${eventId}/services`)
        .then((result) => {
          if (!ignore) {
            // if cleanup func hasn't run, set state to reflect retrieved data and set isLoading back to false
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
            // set state back to isLoading = false
            servicesDispatch({ type: "REQUEST_FAILED", error: err });

            // send error message
            triggerNotification({
              message:
                "Error while getting event services. For more info, see console log",
              severity: "error",
            });
          }
        });
    }

    return () => {
      // cleanup function
      ignore = true;
    };
    // no dependencies, only run upon component mounting
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
        {/* Iterate over event services and add cards to display them */}
        {eventServices &&
          eventServices.map((eventService) => {
            const hasPromotedVendor = eventService.vendorId ? true : false;

            // getting unRead chat entries relating to this event service
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
        {/* Create card at the end for quick event service creation */}
        <CardCreate
          label="CREATE NEW SERVICE"
          handleClick={() => {
            if (isLoading) return;
            handleOpenCreateModal(true);
          }}
        />
      </Grid>
    </>
  );
}

// modal separated as per usual for clarity of code
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
