import {
  FiArrowLeft,
  FiTruck,
  FiUser,
  FiMapPin,
  FiDroplet,
  FiCalendar,
  FiNavigation,
  FiTool,
  FiPackage,
  FiActivity,
} from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

function VehicleDetails() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();

  const {
    vehicleList,
    driverList,
    shipmentList,
  } = useApp();

  const vehicle = vehicleList.find(
    (item) => item.id === vehicleId
  );

  if (!vehicle) {
    return (
      <NotFound
        title="Vehicle Not Found"
        message="The vehicle you are looking for does not exist or has been removed."
        onBack={() => navigate("/vehicles")}
      />
    );
  }

  const driver = driverList.find(
    (item) =>
      item.id === vehicle.driverId ||
      item.vehicleId === vehicle.id ||
      item.vehicle === vehicle.registrationNumber
  );

  const vehicleShipments = shipmentList.filter(
    (shipment) =>
      shipment.vehicleId === vehicle.id ||
      shipment.vehicle === vehicle.registrationNumber
  );

  const fuelLevel =
    vehicle.fuelLevel ??
    vehicle.fuel ??
    0;

  const mileage =
    vehicle.mileage || "—";

  const activeShipments =
    vehicleShipments.filter(
      (shipment) =>
        shipment.status === "In Transit" ||
        shipment.status === "Out for Delivery"
    ).length;

  const completedShipments =
    vehicleShipments.filter(
      (shipment) =>
        shipment.status === "Delivered"
    ).length;

  return (
    <div className="space-y-6">
      {/* BACK */}
      <button
        type="button"
        onClick={() => navigate("/vehicles")}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        <FiArrowLeft size={17} />
        Back to Vehicles
      </button>

      {/* HEADER */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiTruck size={28} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-600">
                Vehicle Details
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                {vehicle.vehicleName}
              </h1>

              <p className="mt-1 text-sm font-medium text-gray-500">
                {vehicle.registrationNumber}
              </p>
            </div>
          </div>

          <VehicleStatus status={vehicle.status} />
        </div>
      </div>

      {/* VEHICLE OVERVIEW */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* VEHICLE INFORMATION */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
          <SectionTitle
            icon={FiTruck}
            title="Vehicle Information"
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard
              label="Vehicle ID"
              value={vehicle.id}
              icon={FiTruck}
            />

            <InfoCard
              label="Registration Number"
              value={vehicle.registrationNumber}
              icon={FiNavigation}
            />

            <InfoCard
              label="Vehicle Type"
              value={vehicle.type || "—"}
              icon={FiTruck}
            />

            <InfoCard
              label="Model"
              value={vehicle.model || "—"}
              icon={FiActivity}
            />

            <InfoCard
              label="Manufacturing Year"
              value={vehicle.year || "—"}
              icon={FiCalendar}
            />

            <InfoCard
              label="Current Location"
              value={vehicle.location || "—"}
              icon={FiMapPin}
            />
          </div>
        </div>

        {/* CURRENT LOCATION */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={FiMapPin}
            title="Current Location"
          />

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FiNavigation size={22} />
            </div>

            <p className="mt-4 text-xs font-medium text-gray-400">
              Last Known Location
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {vehicle.location || "Location unavailable"}
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Vehicle location is based on the latest available
              tracking information.
            </p>
          </div>
        </div>
      </div>

      {/* DRIVER + MAINTENANCE */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* DRIVER */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={FiUser}
            title="Assigned Driver"
          />

          {driver ? (
            <button
              type="button"
              onClick={() =>
                navigate(`/drivers/${driver.id}`)
              }
              className="mt-5 flex w-full items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {getInitials(driver.name)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">
                  {driver.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {driver.id}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                    {driver.status}
                  </span>

                  {driver.phone && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-gray-500">
                      {driver.phone}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs font-semibold text-blue-600">
                View
              </span>
            </button>
          ) : (
            <div className="mt-5 rounded-xl bg-gray-50 p-5 text-center">
              <FiUser
                size={24}
                className="mx-auto text-gray-300"
              />

              <p className="mt-2 text-sm font-medium text-gray-500">
                No driver assigned
              </p>
            </div>
          )}
        </div>

        {/* MAINTENANCE */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={FiTool}
            title="Maintenance"
          />

          <div className="mt-5 space-y-4">
            <MaintenanceRow
              label="Last Maintenance"
              value={
                vehicle.lastMaintenance || "Not available"
              }
            />

            <MaintenanceRow
              label="Next Maintenance"
              value={
                vehicle.nextMaintenance || "Not scheduled"
              }
            />

            <MaintenanceRow
              label="Vehicle Status"
              value={vehicle.status || "Unknown"}
            />
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard
          label="Fuel Level"
          value={`${fuelLevel}%`}
          icon={FiDroplet}
          iconClass="bg-blue-50 text-blue-600"
        />

        <MetricCard
          label="Mileage"
          value={mileage}
          icon={FiActivity}
          iconClass="bg-violet-50 text-violet-600"
        />

        <MetricCard
          label="Active Shipments"
          value={activeShipments}
          icon={FiNavigation}
          iconClass="bg-orange-50 text-orange-600"
        />

        <MetricCard
          label="Completed"
          value={completedShipments}
          icon={FiPackage}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          label="Shipments"
          value={vehicleShipments.length}
          icon={FiTruck}
          iconClass="bg-gray-100 text-gray-600"
        />
      </div>

      {/* FUEL */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle
          icon={FiDroplet}
          title="Fuel Status"
        />

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Current Fuel
            </span>

            <span className="text-sm font-bold text-gray-900">
              {fuelLevel}%
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                fuelLevel <= 20
                  ? "bg-red-500"
                  : fuelLevel <= 40
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(
                  Math.max(fuelLevel, 0),
                  100
                )}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-400">
            {fuelLevel <= 20
              ? "Fuel level is critically low. Refueling is recommended."
              : fuelLevel <= 40
              ? "Fuel level is getting low. Consider refueling soon."
              : "Fuel level is healthy."}
          </p>
        </div>
      </div>

      {/* SHIPMENT HISTORY */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <SectionTitle
            icon={FiPackage}
            title="Shipment History"
          />
        </div>

        {vehicleShipments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {vehicleShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiPackage size={19} />
                  </div>

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/shipments/${shipment.id}`
                        )
                      }
                      className="text-sm font-bold text-blue-600 hover:underline"
                    >
                      {shipment.id}
                    </button>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {shipment.pickupLocation || "Unknown pickup"}{" "}
                      →{" "}
                      {shipment.deliveryLocation ||
                        "Unknown destination"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {shipment.date ||
                        shipment.createdAt ||
                        "—"}
                    </p>
                  </div>
                </div>

                <ShipmentStatus
                  status={shipment.status}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <FiPackage size={24} />
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-800">
              No shipment history
            </p>

            <p className="mt-1 text-sm text-gray-500">
              No shipments are currently associated with this vehicle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   SECTION TITLE
========================= */

function SectionTitle({
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
        <Icon size={17} />
      </div>

      <h2 className="text-base font-bold text-gray-900">
        {title}
      </h2>
    </div>
  );
}

/* =========================
   INFO CARD
========================= */

function InfoCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium text-gray-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================
   MAINTENANCE ROW
========================= */

function MaintenanceRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
          <FiCalendar size={16} />
        </div>

        <span className="text-sm text-gray-500">
          {label}
        </span>
      </div>

      <span className="text-right text-sm font-semibold text-gray-800">
        {value}
      </span>
    </div>
  );
}

/* =========================
   METRIC CARD
========================= */

function MetricCard({
  label,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   VEHICLE STATUS
========================= */

function VehicleStatus({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600",
    "In Transit": "bg-blue-50 text-blue-600",
    Maintenance: "bg-amber-50 text-amber-600",
    Inactive: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* =========================
   SHIPMENT STATUS
========================= */

function ShipmentStatus({ status }) {
  const styles = {
    Pending: "bg-gray-100 text-gray-600",
    "In Transit": "bg-blue-50 text-blue-600",
    "Out for Delivery":
      "bg-violet-50 text-violet-600",
    Delivered:
      "bg-emerald-50 text-emerald-600",
    Delayed:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* =========================
   INITIALS
========================= */

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/* =========================
   NOT FOUND
========================= */

function NotFound({
  title,
  message,
  onBack,
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <FiTruck size={28} />
        </div>

        <h1 className="mt-5 text-xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {message}
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiArrowLeft size={16} />
          Back to Vehicles
        </button>
      </div>
    </div>
  );
}

export default VehicleDetails;