import { useMemo, useState } from "react";

import {
  FiPlus,
  FiSearch,
  FiTruck,
  FiMapPin,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useApp } from "../context/AppContext";

import VehicleForm from "../components/vehicles/VehicleForm";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function Vehicles() {
  const navigate = useNavigate();

  const {
    vehicleList,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    isLoading,
    apiError,
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // =====================================================
  // FILTER VEHICLES
  // =====================================================

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vehicleList.filter((vehicle) => {
      const matchesSearch =
        !query ||
        vehicle.registrationNumber
          ?.toLowerCase()
          .includes(query) ||
        vehicle.vehicleName
          ?.toLowerCase()
          .includes(query) ||
        vehicle.type
          ?.toLowerCase()
          .includes(query) ||
        vehicle.model
          ?.toLowerCase()
          .includes(query) ||
        vehicle.driver
          ?.toLowerCase()
          .includes(query) ||
        vehicle.location
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        vehicle.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vehicleList, search, statusFilter]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleAdd = async (vehicle) => {
    try {
      await addVehicle(vehicle);

      setEditingVehicle(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add vehicle:", error);
    }
  };

  const handleUpdate = async (vehicle) => {
    try {
      await updateVehicle(vehicle.id, vehicle);

      setEditingVehicle(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to update vehicle:", error);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${vehicle.registrationNumber}?`
    );

    if (!confirmed) return;

    try {
      await deleteVehicle(vehicle.id);
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const handleCloseForm = () => {
    setEditingVehicle(null);
    setShowForm(false);
  };

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All";

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const styles = {
      Active:
        "bg-emerald-50 text-emerald-700",

      "In Transit":
        "bg-blue-50 text-blue-700",

      Maintenance:
        "bg-amber-50 text-amber-700",

      Inactive:
        "bg-gray-100 text-gray-600",
    };

    return (
      styles[status] ||
      "bg-gray-100 text-gray-600"
    );
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const activeCount = vehicleList.filter(
    (vehicle) => vehicle.status === "Active"
  ).length;

  const transitCount = vehicleList.filter(
    (vehicle) => vehicle.status === "In Transit"
  ).length;

  const maintenanceCount = vehicleList.filter(
    (vehicle) => vehicle.status === "Maintenance"
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <Loading message="Loading vehicles..." />;
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (apiError) {
    return (
      <ErrorMessage
        message={apiError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Vehicles
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your fleet vehicles and assignments.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiPlus size={18} />
          Add Vehicle
        </button>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={FiTruck}
          title="Total Vehicles"
          value={vehicleList.length}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={FiTruck}
          title="Active"
          value={activeCount}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          icon={FiTruck}
          title="In Transit"
          value={transitCount}
          iconClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}

          <div className="relative flex-1">
            <FiSearch
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search registration, vehicle, driver, location..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          {/* Status */}

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

          {/* Clear */}

          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <FiX size={16} />
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Showing {filteredVehicles.length} of{" "}
          {vehicleList.length} vehicles
        </div>
      </div>

      {/* =================================================
          VEHICLE TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Driver
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Fuel
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Vehicle */}

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/vehicles/${vehicle.id}`
                          )
                        }
                        className="text-left"
                      >
                        <p className="font-semibold text-gray-900 hover:text-blue-600">
                          {vehicle.registrationNumber}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {vehicle.vehicleName}
                        </p>
                      </button>
                    </td>

                    {/* Type */}

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {vehicle.type}
                      </p>

                      <p className="text-xs text-gray-400">
                        {vehicle.model}
                      </p>
                    </td>

                    {/* Driver */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FiUser
                          size={15}
                          className="text-gray-400"
                        />

                        <span className="text-sm text-gray-700">
                          {vehicle.driver ||
                            "Unassigned"}
                        </span>
                      </div>
                    </td>

                    {/* Location */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FiMapPin
                          size={15}
                          className="text-gray-400"
                        />

                        <span className="text-sm text-gray-700">
                          {vehicle.location ||
                            "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Fuel */}

                    <td className="px-5 py-4">
                      <div className="w-24">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-gray-500">
                            Fuel
                          </span>

                          <span className="font-semibold text-gray-700">
                            {vehicle.fuelLevel ?? 0}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${
                              vehicle.fuelLevel < 20
                                ? "bg-red-500"
                                : vehicle.fuelLevel < 40
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                vehicle.fuelLevel ?? 0,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <ActionButton
                          icon={FiEye}
                          label="View"
                          onClick={() =>
                            navigate(
                              `/vehicles/${vehicle.id}`
                            )
                          }
                        />

                        <ActionButton
                          icon={FiEdit2}
                          label="Edit"
                          onClick={() =>
                            handleEdit(vehicle)
                          }
                        />

                        <ActionButton
                          icon={FiTrash2}
                          label="Delete"
                          danger
                          onClick={() =>
                            handleDelete(vehicle)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <FiTruck size={25} />
                      </div>

                      <h3 className="mt-4 font-semibold text-gray-900">
                        No vehicles found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or
                        filter.
                      </p>

                      {hasFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          MOBILE CARDS
      ================================================= */}

      <div className="space-y-3 lg:hidden">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() =>
                    navigate(
                      `/vehicles/${vehicle.id}`
                    )
                  }
                  className="text-left"
                >
                  <p className="font-bold text-gray-900">
                    {vehicle.registrationNumber}
                  </p>

                  <p className="text-xs text-gray-500">
                    {vehicle.vehicleName}
                  </p>
                </button>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <InfoItem
                  icon={FiUser}
                  label="Driver"
                  value={
                    vehicle.driver ||
                    "Unassigned"
                  }
                />

                <InfoItem
                  icon={FiMapPin}
                  label="Location"
                  value={
                    vehicle.location ||
                    "Unknown"
                  }
                />

                <InfoItem
                  icon={FiTruck}
                  label="Type"
                  value={vehicle.type}
                />

                <InfoItem
                  icon={FiTruck}
                  label="Fuel"
                  value={`${vehicle.fuelLevel ?? 0}%`}
                />
              </div>

              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() =>
                    navigate(
                      `/vehicles/${vehicle.id}`
                    )
                  }
                  className="flex-1 rounded-xl bg-gray-50 py-2 text-xs font-semibold text-gray-700"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    handleEdit(vehicle)
                  }
                  className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(vehicle)
                  }
                  className="flex-1 rounded-xl bg-red-50 py-2 text-xs font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <FiTruck size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No vehicles found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filter.
            </p>

            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* =================================================
          VEHICLE FORM
      ================================================= */}

      {showForm && (
        <VehicleForm
          initialVehicle={editingVehicle}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  icon: Icon,
  title,
  value,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// ACTION BUTTON
// =====================================================

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-gray-400 hover:bg-red-50 hover:text-red-600"
          : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      <Icon size={16} />
    </button>
  );
}

// =====================================================
// INFO ITEM
// =====================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Icon size={13} />
        {label}
      </div>

      <p className="mt-1 truncate text-sm font-medium text-gray-700">
        {value || "-"}
      </p>
    </div>
  );
}

export default Vehicles;