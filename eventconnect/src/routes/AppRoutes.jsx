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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<RedirectRoute />} />
      <Route path="/" element={<EventConnect />}>
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
          path="/vendor"
          element={
            <ProtectedRoute userType="vendor">
              <VendorRoutes />
            </ProtectedRoute>
          }
        />
      </Route>
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
          <Route path=":serviceId/editService" element={<h2>SERVICE EP</h2>} />
          <Route
            path=":serviceId"
            element={
              <>
                <h2>SERVICE EP</h2>
                <Outlet />
              </>
            }
          >
            <Route index element={<h3>CONNECTIONS EP</h3>} />
            <Route path=":connectionId" element={<h3>CONNECTION EP</h3>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

function VendorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Vendor Dashboard</h1>} />
    </Routes>
  );
}

function ProtectedRoute({ children, userType }) {
  const { user } = useUser();

  const isAuthorised = userType === user.accountType;

  return isAuthorised ? children : <RedirectRoute />;
}
