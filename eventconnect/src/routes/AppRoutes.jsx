import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "../pages/Auth/Auth";
import { useUser } from "../context/UserProvider";
import EventPlanner from "../pages/eventPlanner/EventPlanner";
import EventsEP from "../pages/eventPlanner/EventsEP";
import EventEP from "../pages/eventPlanner/EventEP";
import ServicesEP from "../pages/eventPlanner/ServicesEp";
import ServiceEP from "../pages/eventPlanner/ServiceEP";
import Vendor from "../pages/vendor/Vendor";
import ServiceRequestsV from "../pages/vendor/ServiceRequestsV";
import ServiceRequestV from "../pages/vendor/ServiceRequestV";
import EventV from "../pages/vendor/EventV";
import EventsV from "../pages/vendor/EventsV";
import AccountSelect from "../pages/Auth/AccountSelect";
import EventPlannerLogin from "../pages/Auth/EventPlannerLogin";
import VendorLogin from "../pages/Auth/VendorLogin";
import EventPlannerSignUp from "../pages/Auth/EventPlannerSignUp";
import VendorSignUp from "../pages/Auth/VendorSignUp";

export default function AppRoutes() {
  // Using Outlet from react-router-dom in order to allow me to have 'template-like' components wrapped around subsequent components
  return (
    <Routes>
      {/* Below 2 routes handle redirection more or less back to the sign in page. Unless user has made it to a new url using react-router-dom, in of which case they will be taken back to their 'accounttype' home page */}
      <Route path="*" element={<RedirectRoute />} />
      <Route path="/" element={<RedirectRoute />} />

      {/* Navigates forward to the default Auth path */}
      <Route index element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />}>
        {/* Sub routes below */}
        <Route index element={<AccountSelect />} />
        <Route path="eventPlanner/login" element={<EventPlannerLogin />} />
        <Route path="vendor/login" element={<VendorLogin />} />
        <Route path="eventPlanner/signup" element={<EventPlannerSignUp />} />
        <Route path="vendor/signup" element={<VendorSignUp />} />
      </Route>

      <Route
        path="/eventPlanner/*"
        element={
          // Using protected routes separtely over eventPlanners and vendors to ensure they are the right account type
          <ProtectedRoute userType="eventPlanner">
            <EventPlannerRoutes />
            {/* Have used a nested structure here for extra clarity */}
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/*"
        element={
          // Using protected routes separtely over eventPlanners and vendors to ensure they are the right account type
          <ProtectedRoute userType="vendor">
            <VendorRoutes />
            {/* Have used a nested structure here for extra clarity */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function RedirectRoute() {
  const { user } = useUser().state; // get the user details to find out accountType

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
  // Routes below use params to allow me to retrieve certain data on each "page" depending on the param passed in
  return (
    <Routes>
      <Route path="/" element={<EventPlanner />}>
        <Route index element={<EventsEP />} />

        <Route path=":eventId" element={<EventEP />}>
          <Route index element={<ServicesEP />} />
          <Route path=":eventServiceId" element={<ServiceEP />}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

function VendorRoutes() {
  // Routes below use params to allow me to retrieve certain data on each "page" depending on the param passed in
  return (
    <Routes>
      <Route path="/" element={<Vendor />}>
        <Route index element={<Navigate to={"/vendor/servicerequests"} />} />
        <Route path="serviceRequests" element={<ServiceRequestsV />} />
        <Route
          path="serviceRequests/:serviceRequestId"
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
