import { Routes, Route, Navigate } from "react-router-dom";
import EPDashboard from "../pages/eventPlanner/dashboard/EPDashboard";
import Login from "../pages/login/Login";
import SignUp from "../pages/signup/SignUp";

const user = "eventplanner"; // FIX: this is for testing purposes only

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<RedirectRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/eventplanner/*"
        element={
          <ProtectedRoute userType="eventplanner">
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
    </Routes>
  );
}

function RedirectRoute() {
  let redirectPath;

  if (user === "eventplanner") {
    redirectPath = "/eventplanner";
  } else if (user === "vendor") {
    redirectPath = "/vendor";
  } else {
    redirectPath = "/login";
  }

  return <Navigate to={redirectPath} />;
}

function EventPlannerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EPDashboard />}></Route>
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
  const isAuthorised = userType === user;

  return isAuthorised ? children : <RedirectRoute />;
}
