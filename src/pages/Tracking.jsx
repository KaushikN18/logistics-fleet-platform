import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiActivity,
  FiArrowRight,
  FiDroplet,
  FiMapPin,
  FiNavigation,
  FiPackage,
  FiSearch,
  FiTruck,
  FiUser,
  FiEye,
} from "react-icons/fi";

import { useApp } from "../context/AppContext";

import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function Tracking() {
  const navigate = useNavigate();

  const {
    vehicleList,
    driverList,
    shipmentList,
    isLoading,
    apiError,
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedVehicleId, setSelectedVehicleId] =
    useState(vehicleList[0]?.id || null);

  /* =====================================================
     BUILD TRACKING DATA
  ===================================================== */

  const trackingVehicles = useMemo(() => {
    return vehicleList.map((vehicle, index) => {
      const driver = driverList.find(
        (item) =>
          item.id === vehicle.driverId ||
          item.vehicleId === vehicle.id ||
          item.vehicle ===
            vehicle.registrationNumber ||
          item.assignedVehicle ===
            vehicle.registrationNumber
      );

      const shipment = shipmentList.find(
        (item) =>
          item.vehicleId === vehicle.id ||
          item.vehicle === vehicle.registrationNumber
      );

      const locationData = getLocationData(
        vehicle.location,
        index
      );

      const isStopped =
        vehicle.status === "Maintenance" ||
        vehicle.status === "Inactive";

      const speed = isStopped
        ? "0 km/h"
        : `${45 + (index % 4) * 7} km/h`;

      let eta = "No active shipment";

      if (shipment) {
        if (shipment.status === "Delivered") {
          eta = "Delivered";
        } else if (shipment.status === "Delayed") {
          eta = shipment.eta || "Delayed";
        } else {
          eta =
            shipment.eta ||
            "Today, 8:30 PM";
        }
      }

      return {
        ...vehicle,

        driverName:
          driver?.name ||
          vehicle.driver ||
          "Unassigned",

        driverId:
          driver?.id ||
          vehicle.driverId ||
          null,

        shipmentId:
          shipment?.id || null,

        shipment: shipment || null,

        latitude: locationData.latitude,
        longitude: locationData.longitude,

        speed,
        eta,
      };
    });
  }, [
    vehicleList,
    driverList,
    shipmentList,
  ]);

  /* =====================================================
     FILTER VEHICLES
  ===================================================== */

  const filteredVehicles = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return trackingVehicles.filter((vehicle) => {
      const matchesSearch =
        !searchValue ||
        String(vehicle.id || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(vehicle.vehicleName || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(vehicle.registrationNumber || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(vehicle.driverName || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(vehicle.location || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        vehicle.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    trackingVehicles,
    search,
    statusFilter,
  ]);

  /* =====================================================
     SELECTED VEHICLE
  ===================================================== */

  const selectedVehicle =
    trackingVehicles.find(
      (vehicle) =>
        vehicle.id === selectedVehicleId
    ) ||
    filteredVehicles[0] ||
    trackingVehicles[0] ||
    null;

  /* =====================================================
     SUMMARY
  ===================================================== */

  const activeVehicles =
    trackingVehicles.filter(
      (vehicle) =>
        vehicle.status === "Active" ||
        vehicle.status === "In Transit"
    ).length;

  const inTransitVehicles =
    trackingVehicles.filter(
      (vehicle) =>
        vehicle.status === "In Transit"
    ).length;

  const maintenanceVehicles =
    trackingVehicles.filter(
      (vehicle) =>
        vehicle.status === "Maintenance"
    ).length;

  const activeShipments =
    shipmentList.filter(
      (shipment) =>
        shipment.status === "In Transit" ||
        shipment.status === "Out for Delivery"
    ).length;

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicleId(vehicle.id);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <Loading message="Loading tracking data..." />
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (apiError) {
    return (
      <ErrorMessage
        message={apiError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Fleet Operations
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Live Tracking
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor vehicles, drivers, routes, and active
            shipments.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

          <span className="text-xs font-semibold text-emerald-700">
            Tracking System Active
          </span>
        </div>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <TrackingStat
          label="Tracked Vehicles"
          value={activeVehicles}
          icon={FiTruck}
          iconClass="bg-blue-50 text-blue-600"
        />

        <TrackingStat
          label="In Transit"
          value={inTransitVehicles}
          icon={FiNavigation}
          iconClass="bg-violet-50 text-violet-600"
        />

        <TrackingStat
          label="Active Shipments"
          value={activeShipments}
          icon={FiPackage}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <TrackingStat
          label="Maintenance"
          value={maintenanceVehicles}
          icon={FiActivity}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search vehicle, registration, driver, location..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400"
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="In Transit">
              In Transit
            </option>

            <option value="Maintenance">
              Maintenance
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* =================================================
          MAIN TRACKING AREA
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* =================================================
            VEHICLE LIST
        ================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Vehicles
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {filteredVehicles.length} vehicles found
                </p>
              </div>

              <FiTruck
                size={19}
                className="text-gray-400"
              />
            </div>
          </div>

          <div className="max-h-[650px] overflow-y-auto">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() =>
                    handleSelectVehicle(vehicle)
                  }
                  className={`w-full border-b border-gray-100 p-4 text-left transition ${
                    selectedVehicle?.id === vehicle.id
                      ? "bg-blue-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        selectedVehicle?.id ===
                        vehicle.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FiTruck size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {vehicle.vehicleName}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {vehicle.registrationNumber}
                          </p>
                        </div>

                        <VehicleStatus
                          status={vehicle.status}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <FiMapPin
                          size={13}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="truncate text-xs text-gray-500">
                          {vehicle.location ||
                            "Unknown location"}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <FiUser
                          size={13}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="truncate text-xs text-gray-500">
                          {vehicle.driverName}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-10 text-center">
                <FiTruck
                  size={28}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  No vehicles found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            MAP + DETAILS
        ================================================= */}

        <div className="space-y-6">
          {/* =================================================
              MAP
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Live Vehicle Map
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Current fleet positions
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
                Live
              </div>
            </div>

            <div className="relative h-[460px] overflow-hidden bg-slate-100">
              {/* MAP GRID */}

              <div className="absolute inset-0 opacity-40">
                <div className="absolute left-[10%] top-0 h-full w-px bg-gray-300" />
                <div className="absolute left-[25%] top-0 h-full w-px bg-gray-300" />
                <div className="absolute left-[42%] top-0 h-full w-px bg-gray-300" />
                <div className="absolute left-[60%] top-0 h-full w-px bg-gray-300" />
                <div className="absolute left-[78%] top-0 h-full w-px bg-gray-300" />
                <div className="absolute left-[92%] top-0 h-full w-px bg-gray-300" />

                <div className="absolute left-0 top-[15%] h-px w-full bg-gray-300" />
                <div className="absolute left-0 top-[32%] h-px w-full bg-gray-300" />
                <div className="absolute left-0 top-[50%] h-px w-full bg-gray-300" />
                <div className="absolute left-0 top-[68%] h-px w-full bg-gray-300" />
                <div className="absolute left-0 top-[85%] h-px w-full bg-gray-300" />
              </div>

              {/* ROAD LINES */}

              <div className="absolute left-[8%] top-[72%] h-1 w-[84%] rotate-[-12deg] rounded-full bg-gray-300/70" />

              <div className="absolute left-[22%] top-[20%] h-1 w-[65%] rotate-[22deg] rounded-full bg-gray-300/60" />

              <div className="absolute left-[40%] top-[5%] h-[90%] w-1 rotate-[18deg] rounded-full bg-gray-300/50" />

              {/* LOCATION LABELS */}

              <MapLabel
                name="Chennai"
                top="18%"
                left="73%"
              />

              <MapLabel
                name="Bangalore"
                top="25%"
                left="35%"
              />

              <MapLabel
                name="Coimbatore"
                top="51%"
                left="24%"
              />

              <MapLabel
                name="Salem"
                top="40%"
                left="51%"
              />

              <MapLabel
                name="Madurai"
                top="72%"
                left="48%"
              />

              <MapLabel
                name="Trichy"
                top="62%"
                left="69%"
              />

              {/* VEHICLE MARKERS */}

              {filteredVehicles.map((vehicle) => (
                <VehicleMarker
                  key={vehicle.id}
                  vehicle={vehicle}
                  selected={
                    selectedVehicle?.id === vehicle.id
                  }
                  onClick={() =>
                    handleSelectVehicle(vehicle)
                  }
                />
              ))}

              {/* SELECTED VEHICLE MAP INFO */}

              {selectedVehicle && (
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:max-w-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FiTruck size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {selectedVehicle.vehicleName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {selectedVehicle.registrationNumber}
                        </p>
                      </div>
                    </div>

                    <VehicleStatus
                      status={selectedVehicle.status}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              SELECTED VEHICLE
          ================================================= */}

          {selectedVehicle ? (
            <SelectedVehicle
              vehicle={selectedVehicle}
              navigate={navigate}
            />
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <FiTruck
                size={32}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 font-semibold text-gray-700">
                No vehicle selected
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Select a vehicle to view tracking details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   TRACKING STAT
===================================================== */

function TrackingStat({
  label,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>

        <div>
          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   SELECTED VEHICLE
===================================================== */

function SelectedVehicle({
  vehicle,
  navigate,
}) {
  const shipment = vehicle.shipment;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FiTruck size={25} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900">
              {vehicle.vehicleName}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {vehicle.registrationNumber}
            </p>

            <div className="mt-2">
              <VehicleStatus
                status={vehicle.status}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/vehicles/${vehicle.id}`
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          View Vehicle
          <FiArrowRight size={15} />
        </button>
      </div>

      {/* DETAILS */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TrackingInfo
          icon={FiUser}
          label="Driver"
          value={vehicle.driverName}
        />

        <TrackingInfo
          icon={FiMapPin}
          label="Location"
          value={vehicle.location || "Unknown"}
        />

        <TrackingInfo
          icon={FiActivity}
          label="Speed"
          value={vehicle.speed}
        />

        <TrackingInfo
          icon={FiDroplet}
          label="Fuel"
          value={`${vehicle.fuelLevel ?? vehicle.fuel ?? 0}%`}
        />
      </div>

      {/* SHIPMENT */}

      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
              <FiPackage size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-400">
                Current Shipment
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {shipment?.id ||
                  "No shipment assigned"}
              </p>

              {shipment && (
                <p className="mt-1 truncate text-xs text-gray-500">
                  {shipment.pickupLocation ||
                    shipment.pickup ||
                    "-"}{" "}
                  →{" "}
                  {shipment.deliveryLocation ||
                    shipment.delivery ||
                    "-"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] text-gray-400">
                ETA
              </p>

              <p className="mt-1 text-xs font-semibold text-gray-700">
                {vehicle.eta}
              </p>
            </div>

            {shipment && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/shipments/${shipment.id}`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
              >
                <FiEye size={13} />
                View
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DRIVER */}

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <FiUser size={15} />
          </div>

          <div>
            <p className="text-[11px] text-gray-400">
              Assigned Driver
            </p>

            <p className="text-sm font-semibold text-gray-800">
              {vehicle.driverName}
            </p>
          </div>
        </div>

        {vehicle.driverId && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/drivers/${vehicle.driverId}`
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
          >
            View Driver
            <FiArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   TRACKING INFO
===================================================== */

function TrackingInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className="text-gray-400"
        />

        <p className="text-[11px] text-gray-400">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}

/* =====================================================
   VEHICLE MARKER
===================================================== */

function VehicleMarker({
  vehicle,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={vehicle.registrationNumber}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${vehicle.longitude}%`,
        top: `${vehicle.latitude}%`,
      }}
    >
      <div
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-4 border-white shadow-lg transition ${
          selected
            ? "scale-125 bg-blue-600 text-white"
            : vehicle.status === "Maintenance"
            ? "bg-amber-500 text-white"
            : vehicle.status === "Inactive"
            ? "bg-gray-400 text-white"
            : "bg-emerald-500 text-white"
        }`}
      >
        <FiTruck size={14} />

        {selected && (
          <span className="absolute -inset-1 animate-ping rounded-full border border-blue-400 opacity-30" />
        )}
      </div>
    </button>
  );
}

/* =====================================================
   MAP LABEL
===================================================== */

function MapLabel({
  name,
  top,
  left,
}) {
  return (
    <div
      className="absolute rounded-md bg-white/80 px-2 py-1 text-[10px] font-semibold text-gray-500 shadow-sm backdrop-blur-sm"
      style={{
        top,
        left,
      }}
    >
      {name}
    </div>
  );
}

/* =====================================================
   VEHICLE STATUS
===================================================== */

function VehicleStatus({ status }) {
  const styles = {
    Active:
      "bg-emerald-50 text-emerald-600",

    "In Transit":
      "bg-blue-50 text-blue-600",

    Maintenance:
      "bg-amber-50 text-amber-600",

    Inactive:
      "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* =====================================================
   LOCATION DATA
===================================================== */

function getLocationData(
  location,
  index
) {
  const locations = {
    Chennai: {
      latitude: 24,
      longitude: 78,
    },

    Bangalore: {
      latitude: 30,
      longitude: 38,
    },

    Coimbatore: {
      latitude: 50,
      longitude: 25,
    },

    Salem: {
      latitude: 39,
      longitude: 51,
    },

    Madurai: {
      latitude: 72,
      longitude: 48,
    },

    Tiruchirappalli: {
      latitude: 61,
      longitude: 68,
    },

    Trichy: {
      latitude: 61,
      longitude: 68,
    },

    Pondicherry: {
      latitude: 39,
      longitude: 78,
    },
  };

  if (locations[location]) {
    return locations[location];
  }

  return {
    latitude:
      20 + ((index * 17) % 60),

    longitude:
      20 + ((index * 23) % 65),
  };
}

export default Tracking;