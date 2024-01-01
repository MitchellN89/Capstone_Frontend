import { Routes, Route, Navigate } from "react-router-dom";
import EPDashboard from "../pages/eventPlanner/dashboard/EPDashboard";
import Login from "../pages/login/Login";
import SignUp from "../pages/signup/SignUp";
import Auth from "../pages/auth/Auth";
import { useUser } from "../context/UserProvider";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<RedirectRoute />} />
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
        <Route path="signup/:type" element={<SignUp />} />
      </Route>

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
  const { user } = useUser();
  const isAuthorised = userType === user.accountType;

  return isAuthorised ? children : <RedirectRoute />;
}
