import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Auth from "../pages/Auth/Auth";
import { useUser } from "../context/UserProvider";
import EventPlanner from "../pages/eventPlanner/EventPlanner";
import EventsEP from "../pages/eventPlanner/EventsEP";
import EventEP from "../pages/eventPlanner/EventEP";
import CreateEventEP from "../pages/eventPlanner/CreateEventEp";
import EditEventEP from "../pages/eventPlanner/EditEventEp";
import ServicesEP from "../pages/eventPlanner/ServicesEp";
import CreateServiceEP from "../pages/eventPlanner/CreateServiceEP";
import ServiceEP from "../pages/eventPlanner/ServiceEP";
import EditServiceEP from "../pages/eventPlanner/EditServiceEP";
import Vendor from "../pages/vendor/Vendor";
import ServiceRequestsV from "../pages/vendor/ServiceRequestsV";
import ServiceRequestV from "../pages/vendor/ServiceRequestV";
import EventV from "../pages/vendor/EventV";
import EventsV from "../pages/vendor/EventsV";
import PageNotFound404 from "../pages/PageNotFound404";
import AccountSelect from "../pages/Auth/AccountSelect";
import EventPlannerLogin from "../pages/Auth/EventPlannerLogin";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<PageNotFound404 />} />
      <Route path="/" element={<RedirectRoute />} />

      {/* <Route path="/auth" element={<h1>AUTH</h1>}>
        <Route index element={<h1>LOGIN PAGE</h1>} />
        <Route path="signup/:type" element={<SignUp />} />
      </Route> */}

      <Route index element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />}>
        <Route index element={<AccountSelect />} />
        <Route path="eventPlanner/login" element={<EventPlannerLogin />} />
        <Route path="vendor/login" />
        <Route path="eventPlanner/signup" />
        <Route path="vendor/signup" />
      </Route>

      <Route
        path="/eventPlanner/*"
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
  const { user } = useUser().state;

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
  const { user } = useUser().state;

  const isAuthorised = userType === user.accountType;

  return isAuthorised ? children : <RedirectRoute />;
}
