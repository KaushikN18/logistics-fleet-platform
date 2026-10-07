import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout.jsx";

import Dashboard from "../pages/Dashboard.jsx";

import Vehicles from "../pages/Vehicles.jsx";
import VehicleDetails from "../pages/VehicleDetails.jsx";

import Drivers from "../pages/Drivers.jsx";
import DriverDetails from "../pages/DriverDetails.jsx";

import Shipments from "../pages/Shipments.jsx";
import ShipmentDetails from "../pages/ShipmentDetails.jsx";

import Tracking from "../pages/Tracking.jsx";
import Notifications from "../pages/Notifications.jsx";
import Settings from "../pages/Settings.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>

          {/* =========================
              DASHBOARD
          ========================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* =========================
              VEHICLES
          ========================= */}

          <Route
            path="/vehicles"
            element={<Vehicles />}
          />

          <Route
            path="/vehicles/:vehicleId"
            element={<VehicleDetails />}
          />

          {/* =========================
              DRIVERS
          ========================= */}

          <Route
            path="/drivers"
            element={<Drivers />}
          />

          <Route
            path="/drivers/:driverId"
            element={<DriverDetails />}
          />

          {/* =========================
              SHIPMENTS
          ========================= */}

          <Route
            path="/shipments"
            element={<Shipments />}
          />

          <Route
            path="/shipments/:shipmentId"
            element={<ShipmentDetails />}
          />

          {/* =========================
              TRACKING
          ========================= */}

          <Route
            path="/tracking"
            element={<Tracking />}
          />

          {/* =========================
              NOTIFICATIONS
          ========================= */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* =========================
              SETTINGS
          ========================= */}

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* =========================
              FALLBACK
          ========================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default AppRoutes;