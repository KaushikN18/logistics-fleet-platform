import { useMemo, useState } from "react";

import {
  FiPlus,
  FiSearch,
  FiUser,
  FiTruck,
  FiPhone,
  FiMail,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiMapPin,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useApp } from "../context/AppContext";
import DriverForm from "../components/drivers/DriverForm";

import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function Drivers() {
  const navigate = useNavigate();

  const {
    driverList,
    addDriver,
    updateDriver,
    deleteDriver,
    isLoading,
    apiError,
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  // =====================================================
  // FILTER DRIVERS
  // =====================================================

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return driverList.filter((driver) => {
      const matchesSearch =
        !query ||
        driver.name?.toLowerCase().includes(query) ||
        driver.phone?.toLowerCase().includes(query) ||
        driver.email?.toLowerCase().includes(query) ||
        driver.licenseNumber
          ?.toLowerCase()
          .includes(query) ||
        driver.vehicle?.toLowerCase().includes(query) ||
        driver.assignedVehicle
          ?.toLowerCase()
          .includes(query) ||
        driver.location?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        driver.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [driverList, search, statusFilter]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleAdd = async (driver) => {
    try {
      await addDriver(driver);

      setShowForm(false);
      setEditingDriver(null);
    } catch (error) {
      console.error("Failed to add driver:", error);
    }
  };

  const handleUpdate = async (driver) => {
    try {
      await updateDriver(driver.id, driver);

      setEditingDriver(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to update driver:", error);
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDelete = async (driver) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${driver.name}?`
    );

    if (!confirmed) return;

    try {
      await deleteDriver(driver.id);
    } catch (error) {
      console.error("Failed to delete driver:", error);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const handleCloseForm = () => {
    setEditingDriver(null);
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
      Available:
        "bg-emerald-50 text-emerald-700",

      "On Duty":
        "bg-blue-50 text-blue-700",

      "On Leave":
        "bg-amber-50 text-amber-700",

      "Off Duty":
        "bg-gray-100 text-gray-600",

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

  const availableCount = driverList.filter(
    (driver) => driver.status === "Available"
  ).length;

  const onDutyCount = driverList.filter(
    (driver) =>
      driver.status === "On Duty" ||
      driver.status === "On Delivery"
  ).length;

  const onLeaveCount = driverList.filter(
    (driver) => driver.status === "On Leave"
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <Loading message="Loading drivers..." />;
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
            Drivers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage drivers, assignments and performance.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDriver(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiPlus size={18} />
          Add Driver
        </button>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={FiUser}
          title="Total Drivers"
          value={driverList.length}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={FiUser}
          title="Available"
          value={availableCount}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          icon={FiTruck}
          title="On Duty"
          value={onDutyCount}
          iconClass="bg-purple-50 text-purple-600"
        />

        <SummaryCard
          icon={FiUser}
          title="On Leave"
          value={onLeaveCount}
          iconClass="bg-amber-50 text-amber-600"
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
              placeholder="Search driver, phone, email, vehicle, location..."
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

            <option value="Available">
              Available
            </option>

            <option value="On Duty">
              On Duty
            </option>

            <option value="On Leave">
              On Leave
            </option>

            <option value="Off Duty">
              Off Duty
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
          Showing {filteredDrivers.length} of{" "}
          {driverList.length} drivers
        </div>
      </div>

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Driver
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Performance
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
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => {
                  const completionRate =
                    driver.deliveries > 0
                      ? Math.round(
                          (driver.completedDeliveries /
                            driver.deliveries) *
                            100
                        )
                      : 0;

                  return (
                    <tr
                      key={driver.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Driver */}

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/drivers/${driver.id}`
                            )
                          }
                          className="flex items-center gap-3 text-left"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {getInitials(
                              driver.name
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 hover:text-blue-600">
                              {driver.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {driver.id}
                            </p>
                          </div>
                        </button>
                      </td>

                      {/* Contact */}

                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FiPhone
                              size={13}
                              className="text-gray-400"
                            />

                            <span className="text-sm text-gray-700">
                              {driver.phone || "-"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FiMail
                              size={13}
                              className="text-gray-400"
                            />

                            <span className="max-w-[180px] truncate text-xs text-gray-400">
                              {driver.email || "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <FiTruck
                            size={15}
                            className="text-gray-400"
                          />

                          <span className="text-sm text-gray-700">
                            {driver.vehicle ||
                              driver.assignedVehicle ||
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
                            {driver.location ||
                              "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* Performance */}

                      <td className="px-5 py-4">
                        <div className="min-w-[120px]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Completion
                            </span>

                            <span className="text-xs font-semibold text-gray-700">
                              {completionRate}%
                            </span>
                          </div>

                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{
                                width: `${Math.min(
                                  completionRate,
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <div className="mt-1 flex items-center gap-1">
                            <FiStar
                              size={12}
                              className="fill-amber-400 text-amber-400"
                            />

                            <span className="text-xs text-gray-500">
                              {driver.rating ?? 0}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                            driver.status
                          )}`}
                        >
                          {driver.status}
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
                                `/drivers/${driver.id}`
                              )
                            }
                          />

                          <ActionButton
                            icon={FiEdit2}
                            label="Edit"
                            onClick={() =>
                              handleEdit(driver)
                            }
                          />

                          <ActionButton
                            icon={FiTrash2}
                            label="Delete"
                            danger
                            onClick={() =>
                              handleDelete(driver)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center"
                  >
                    <EmptyState
                      hasFilters={hasFilters}
                      onClear={handleClearFilters}
                    />
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
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map((driver) => {
            const completionRate =
              driver.deliveries > 0
                ? Math.round(
                    (driver.completedDeliveries /
                      driver.deliveries) *
                      100
                  )
                : 0;

            return (
              <div
                key={driver.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/drivers/${driver.id}`
                      )
                    }
                    className="flex min-w-0 items-center gap-3 text-left"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {getInitials(driver.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-900">
                        {driver.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {driver.id}
                      </p>
                    </div>
                  </button>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                      driver.status
                    )}`}
                  >
                    {driver.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoItem
                    icon={FiPhone}
                    label="Phone"
                    value={driver.phone}
                  />

                  <InfoItem
                    icon={FiTruck}
                    label="Vehicle"
                    value={
                      driver.vehicle ||
                      driver.assignedVehicle ||
                      "Unassigned"
                    }
                  />

                  <InfoItem
                    icon={FiMapPin}
                    label="Location"
                    value={driver.location}
                  />

                  <InfoItem
                    icon={FiStar}
                    label="Rating"
                    value={`${driver.rating ?? 0} ★`}
                  />
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Delivery Completion
                    </span>

                    <span className="text-xs font-semibold text-gray-700">
                      {completionRate}%
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${Math.min(
                          completionRate,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/drivers/${driver.id}`
                      )
                    }
                    className="flex-1 rounded-xl bg-gray-50 py-2 text-xs font-semibold text-gray-700"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      handleEdit(driver)
                    }
                    className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(driver)
                    }
                    className="flex-1 rounded-xl bg-red-50 py-2 text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
            <EmptyState
              hasFilters={hasFilters}
              onClear={handleClearFilters}
            />
          </div>
        )}
      </div>

      {/* =================================================
          DRIVER FORM
      ================================================= */}

      {showForm && (
        <DriverForm
          editingDriver={editingDriver}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onClose={handleCloseForm}
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

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({
  hasFilters,
  onClear,
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <FiUser size={25} />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        No drivers found
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Try changing your search or filter.
      </p>

      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

// =====================================================
// HELPERS
// =====================================================

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getStatusStyle(status) {
  const styles = {
    Available:
      "bg-emerald-50 text-emerald-700",

    "On Duty":
      "bg-blue-50 text-blue-700",

    "On Leave":
      "bg-amber-50 text-amber-700",

    "Off Duty":
      "bg-gray-100 text-gray-600",

    Inactive:
      "bg-gray-100 text-gray-600",
  };

  return (
    styles[status] ||
    "bg-gray-100 text-gray-600"
  );
}

export default Drivers;