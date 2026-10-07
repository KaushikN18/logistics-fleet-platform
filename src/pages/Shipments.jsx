import { useMemo, useState } from "react";

import {
  FiPlus,
  FiSearch,
  FiPackage,
  FiUser,
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useApp } from "../context/AppContext";
import ShipmentForm from "../components/shipments/ShipmentForm";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function Shipments() {
  const navigate = useNavigate();

  const {
    shipmentList,
    addShipment,
    updateShipment,
    deleteShipment,
    driverList,
    vehicleList,
    isLoading,
    apiError,
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);

  /* =====================================================
     FILTER SHIPMENTS
  ===================================================== */

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return shipmentList.filter((shipment) => {
      const matchesSearch =
        !query ||
        shipment.id?.toLowerCase().includes(query) ||
        shipment.customer?.toLowerCase().includes(query) ||
        shipment.driver?.toLowerCase().includes(query) ||
        shipment.vehicle?.toLowerCase().includes(query) ||
        shipment.vehicleName?.toLowerCase().includes(query) ||
        shipment.pickupLocation?.toLowerCase().includes(query) ||
        shipment.deliveryLocation?.toLowerCase().includes(query) ||
        shipment.pickup?.toLowerCase().includes(query) ||
        shipment.delivery?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        shipment.status === statusFilter;

      const shipmentDate =
        shipment.date ||
        shipment.pickupDate ||
        shipment.deliveryDate ||
        "";

      const matchesDate =
        !dateFilter ||
        shipmentDate === dateFilter ||
        shipment.pickupDate === dateFilter ||
        shipment.deliveryDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [
    shipmentList,
    search,
    statusFilter,
    dateFilter,
  ]);

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleAdd = async (shipment) => {
    try {
      await addShipment(shipment);
      setShowForm(false);
      setEditingShipment(null);
    } catch (error) {
      console.error("Failed to add shipment:", error);
    }
  };

  const handleUpdate = async (shipment) => {
    try {
      await updateShipment(shipment.id, shipment);
      setEditingShipment(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to update shipment:", error);
    }
  };

  const handleEdit = (shipment) => {
    setEditingShipment(shipment);
    setShowForm(true);
  };

  const handleDelete = async (shipment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${shipment.id}?`
    );

    if (!confirmed) return;

    try {
      await deleteShipment(shipment.id);
    } catch (error) {
      console.error("Failed to delete shipment:", error);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("");
  };

  const handleCloseForm = () => {
    setEditingShipment(null);
    setShowForm(false);
  };

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    dateFilter !== "";

  /* =====================================================
     SUMMARY
  ===================================================== */

  const pendingCount = shipmentList.filter(
    (shipment) => shipment.status === "Pending"
  ).length;

  const transitCount = shipmentList.filter(
    (shipment) => shipment.status === "In Transit"
  ).length;

  const deliveredCount = shipmentList.filter(
    (shipment) => shipment.status === "Delivered"
  ).length;

  const delayedCount = shipmentList.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;

  /* =====================================================
     LOADING / ERROR
  ===================================================== */

  if (isLoading) {
    return <Loading message="Loading shipments..." />;
  }

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

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Shipments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create, manage and track fleet shipments.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingShipment(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiPlus size={18} />
          Create Shipment
        </button>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={FiPackage}
          title="Total"
          value={shipmentList.length}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={FiClock}
          title="Pending"
          value={pendingCount}
          iconClass="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          icon={FiTruck}
          title="In Transit"
          value={transitCount}
          iconClass="bg-purple-50 text-purple-600"
        />

        <SummaryCard
          icon={FiCheckCircle}
          title="Delivered"
          value={deliveredCount}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          icon={FiAlertTriangle}
          title="Delayed"
          value={delayedCount}
          iconClass="bg-red-50 text-red-600"
        />
      </div>

      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          {/* Search */}

          <div className="relative">
            <FiSearch
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search shipment, customer, driver, vehicle, location..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">
              Out for Delivery
            </option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>

          {/* Date */}

          <div className="relative">
            <FiCalendar
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>

          {/* Clear */}

          {hasFilters ? (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <FiX size={16} />
              Clear
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <span>
            Showing {filteredShipments.length} of{" "}
            {shipmentList.length} shipments
          </span>

          {dateFilter && (
            <span>
              Date: {formatDate(dateFilter)}
            </span>
          )}
        </div>
      </div>

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Shipment
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Route
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Driver
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
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
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Shipment */}

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/shipments/${shipment.id}`
                          )
                        }
                        className="flex items-center gap-3 text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <FiPackage size={18} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 hover:text-blue-600">
                            {shipment.id}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {shipment.customer ||
                              "Customer"}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* Route */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <p className="max-w-[150px] truncate text-sm font-medium text-gray-700">
                            {shipment.pickupLocation ||
                              shipment.pickup ||
                              "-"}
                          </p>

                          <p className="mt-0.5 max-w-[150px] truncate text-xs text-gray-400">
                            {shipment.deliveryLocation ||
                              shipment.delivery ||
                              "-"}
                          </p>
                        </div>

                        <span className="text-gray-300">
                          →
                        </span>
                      </div>
                    </td>

                    {/* Driver */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FiUser
                          size={15}
                          className="text-gray-400"
                        />

                        <span className="text-sm text-gray-700">
                          {shipment.driver ||
                            "Unassigned"}
                        </span>
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
                          {shipment.vehicle ||
                            shipment.vehicleName ||
                            "Unassigned"}
                        </span>
                      </div>
                    </td>

                    {/* Date */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar
                          size={14}
                          className="text-gray-400"
                        />

                        <span className="text-sm text-gray-700">
                          {formatDate(
                            shipment.date ||
                              shipment.pickupDate ||
                              shipment.deliveryDate
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                          shipment.status
                        )}`}
                      >
                        {shipment.status}
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
                              `/shipments/${shipment.id}`
                            )
                          }
                        />

                        <ActionButton
                          icon={FiEdit2}
                          label="Edit"
                          onClick={() =>
                            handleEdit(shipment)
                          }
                        />

                        <ActionButton
                          icon={FiTrash2}
                          label="Delete"
                          danger
                          onClick={() =>
                            handleDelete(shipment)
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
        {filteredShipments.length > 0 ? (
          filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() =>
                    navigate(
                      `/shipments/${shipment.id}`
                    )
                  }
                  className="flex min-w-0 items-center gap-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiPackage size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900">
                      {shipment.id}
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      {shipment.customer || "Customer"}
                    </p>
                  </div>
                </button>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                    shipment.status
                  )}`}
                >
                  {shipment.status}
                </span>
              </div>

              {/* Route */}

              <div className="mt-4 rounded-xl bg-gray-50 p-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex flex-col items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                    <span className="h-7 border-l border-dashed border-gray-300" />

                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Pickup
                      </p>

                      <p className="text-sm font-medium text-gray-700">
                        {shipment.pickupLocation ||
                          shipment.pickup ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400">
                        Delivery
                      </p>

                      <p className="text-sm font-medium text-gray-700">
                        {shipment.deliveryLocation ||
                          shipment.delivery ||
                          "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <InfoItem
                  icon={FiUser}
                  label="Driver"
                  value={shipment.driver || "Unassigned"}
                />

                <InfoItem
                  icon={FiTruck}
                  label="Vehicle"
                  value={
                    shipment.vehicle ||
                    shipment.vehicleName ||
                    "Unassigned"
                  }
                />

                <InfoItem
                  icon={FiCalendar}
                  label="Date"
                  value={formatDate(
                    shipment.date ||
                      shipment.pickupDate ||
                      shipment.deliveryDate
                  )}
                />

                <InfoItem
                  icon={FiMapPin}
                  label="Customer"
                  value={shipment.customer || "-"}
                />
              </div>

              {/* Actions */}

              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() =>
                    navigate(
                      `/shipments/${shipment.id}`
                    )
                  }
                  className="flex-1 rounded-xl bg-gray-50 py-2 text-xs font-semibold text-gray-700"
                >
                  View
                </button>

                <button
                  onClick={() => handleEdit(shipment)}
                  className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(shipment)}
                  className="flex-1 rounded-xl bg-red-50 py-2 text-xs font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
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
          SHIPMENT FORM
      ================================================= */}

      {showForm && (
        <ShipmentForm
          initialShipment={editingShipment}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onCancel={handleCloseForm}
          drivers={driverList}
          vehicles={vehicleList}
        />
      )}
    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

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

/* =====================================================
   ACTION BUTTON
===================================================== */

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

/* =====================================================
   INFO ITEM
===================================================== */

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

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  hasFilters,
  onClear,
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <FiPackage size={25} />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        No shipments found
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Try changing your search or filters.
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

/* =====================================================
   STATUS STYLE
===================================================== */

function getStatusStyle(status) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    "In Transit": "bg-blue-50 text-blue-700",
    "Out for Delivery": "bg-indigo-50 text-indigo-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Delayed: "bg-red-50 text-red-700",
  };

  return (
    styles[status] ||
    "bg-gray-100 text-gray-600"
  );
}

/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default Shipments;