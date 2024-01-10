import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/login/Login";
import SignUp from "../pages/signup/SignUp";
import Auth from "../pages/auth/Auth";
import { useUser } from "../context/UserProvider";
import EventPlanner from "../pages/eventPlanner/EventPlanner";
import EventsEP from "../pages/eventPlanner/EventsEP";
import EventEP from "../pages/eventPlanner/EventEP";
import EventConnect from "../pages/eventConnet/EventConnect";
import CreateEventEP from "../pages/eventPlanner/CreateEventEp";
import EditEventEP from "../pages/eventPlanner/EditEventEp";
import ServicesEP from "../pages/eventPlanner/ServicesEp";
import CreateServiceEP from "../pages/eventPlanner/CreateServiceEP";
import ServiceEP from "../pages/eventPlanner/ServiceEP";
import EditServiceEP from "../pages/eventPlanner/EditServiceEP";
import Vendor from "../pages/vendor/Vendor";
import ServiceRequestsV from "../pages/vendor/ServiceRequestsV";
import ServiceRequestV from "../pages/vendor/ServiceRequestV";
import ServiceConnectionsEP from "../pages/eventPlanner/ServiceConnectionsEP";
import ServiceConnectionEP from "../pages/eventPlanner/ServiceConnectionEP";
import EventV from "../pages/vendor/EventV";
import EventsV from "../pages/vendor/EventsV";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<RedirectRoute />} />
      {/* <Route path="/" element={<RedirectRoute />} /> */}

      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
        <Route path="signup/:type" element={<SignUp />} />
      </Route>

      <Route
        path="/eventplanner/*"
        element={
          <ProtectedRoute userType="eventPlanner">
            <EventPlannerRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/*"
        element={
          <ProtectedRoute userType="vendor">
            <VendorRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function RedirectRoute() {
  const { user } = useUser();
  let redirectPath;

  if (user.accountType === "eventPlanner") {
    redirectPath = "/eventplanner";
  } else if (user.accountType === "vendor") {
    redirectPath = "/vendor";
  } else {
    redirectPath = "/auth";
  }

  return <Navigate to={redirectPath} />;
}

function EventPlannerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EventPlanner />}>
        <Route index element={<EventsEP />} />
        <Route path="createEvent" element={<CreateEventEP />} />
        <Route path=":eventId/editEvent" element={<EditEventEP />} />
        <Route path=":eventId" element={<EventEP />}>
          <Route index element={<ServicesEP />} />
          <Route path="createService" element={<CreateServiceEP />} />
          <Route
            path=":eventServiceId/editService"
            element={<EditServiceEP />}
          />
          <Route path=":eventServiceId" element={<ServiceEP />}>
            {/* <Route index element={<ServiceConnectionsEP />} />
            <Route
              path=":serviceConnectionId"
              element={<ServiceConnectionEP />}
            /> */}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

function VendorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Vendor />}>
        <Route index element={<Navigate to={"/vendor/servicerequests"} />} />
        <Route path="servicerequests" element={<ServiceRequestsV />} />
        <Route
          path="servicerequests/:serviceRequestId"
          element={<ServiceRequestV />}
        />
        <Route path="events" element={<EventsV />} />
        <Route path="events/:serviceRequestId" element={<EventV />} />
      </Route>
    </Routes>
  );
}

function ProtectedRoute({ children, userType }) {
  const { user } = useUser();

  const isAuthorised = userType === user.accountType;

  return isAuthorised ? children : <RedirectRoute />;
}
