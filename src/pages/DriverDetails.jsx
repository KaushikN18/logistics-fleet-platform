import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMail,
  FiTruck,
  FiMapPin,
  FiStar,
  FiPackage,
  FiCheckCircle,
  FiActivity,
} from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

function DriverDetails() {
  const navigate = useNavigate();
  const { driverId } = useParams();

  const {
    driverList,
    vehicleList,
    shipmentList,
  } = useApp();

  const driver = driverList.find(
    (item) => item.id === driverId
  );

  if (!driver) {
    return (
      <NotFound
        title="Driver Not Found"
        message="The driver you are looking for does not exist or has been removed."
        onBack={() => navigate("/drivers")}
      />
    );
  }

  const vehicle = vehicleList.find(
    (item) =>
      item.id === driver.vehicleId ||
      item.registrationNumber === driver.vehicle
  );

  const driverShipments = shipmentList.filter(
    (shipment) =>
      shipment.driverId === driver.id ||
      shipment.driver === driver.name
  );

  const completedDeliveries =
    driver.completedDeliveries || 0;

  const totalDeliveries =
    driver.deliveries || 0;

  const completionRate =
    totalDeliveries > 0
      ? Math.round(
          (completedDeliveries / totalDeliveries) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* BACK */}
      <button
        type="button"
        onClick={() => navigate("/drivers")}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        <FiArrowLeft size={17} />
        Back to Drivers
      </button>

      {/* HEADER */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
              {getInitials(driver.name)}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-600">
                Driver Details
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                {driver.name}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {driver.id}
              </p>
            </div>
          </div>

          <DriverStatus status={driver.status} />
        </div>
      </div>

      {/* PROFILE + CONTACT */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PROFILE */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={FiUser}
            title="Driver Profile"
          />

          <div className="mt-6 space-y-4">
            <InfoRow
              label="Driver ID"
              value={driver.id}
            />

            <InfoRow
              label="License Number"
              value={driver.licenseNumber || "—"}
            />

            <InfoRow
              label="Experience"
              value={driver.experience || "—"}
            />

            <InfoRow
              label="Joined Date"
              value={driver.joinedDate || "—"}
            />

            <InfoRow
              label="Current Location"
              value={driver.location || "—"}
            />
          </div>
        </div>

        {/* CONTACT */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={FiPhone}
            title="Contact Information"
          />

          <div className="mt-6 space-y-3">
            <ContactItem
              icon={FiPhone}
              label="Phone"
              value={driver.phone || "—"}
            />

            <ContactItem
              icon={FiMail}
              label="Email"
              value={driver.email || "—"}
            />

            <ContactItem
              icon={FiMapPin}
              label="Location"
              value={driver.location || "—"}
            />
          </div>
        </div>
      </div>

      {/* ASSIGNED VEHICLE */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={FiTruck}
          title="Assigned Vehicle"
        />

        {vehicle ? (
          <button
            type="button"
            onClick={() =>
              navigate(`/vehicles/${vehicle.id}`)
            }
            className="mt-5 flex w-full items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <FiTruck size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">
                {vehicle.vehicleName}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {vehicle.registrationNumber}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                  {vehicle.status}
                </span>

                {vehicle.type && (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500">
                    {vehicle.type}
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
            <FiTruck
              size={24}
              className="mx-auto text-gray-300"
            />

            <p className="mt-2 text-sm font-medium text-gray-500">
              No vehicle assigned
            </p>
          </div>
        )}
      </div>

      {/* PERFORMANCE */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Total Deliveries"
          value={totalDeliveries}
          icon={FiPackage}
          iconClass="bg-blue-50 text-blue-600"
        />

        <MetricCard
          label="Completed"
          value={completedDeliveries}
          icon={FiCheckCircle}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={FiActivity}
          iconClass="bg-violet-50 text-violet-600"
        />

        <MetricCard
          label="Rating"
          value={`${driver.rating || 0} / 5`}
          icon={FiStar}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* DELIVERY HISTORY */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <SectionTitle
            icon={FiPackage}
            title="Delivery History"
          />
        </div>

        {driverShipments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {driverShipments.map((shipment) => (
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

                    <p className="mt-1 text-xs text-gray-500">
                      {shipment.pickupLocation ||
                        "Unknown pickup"}{" "}
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
              No delivery history
            </p>

            <p className="mt-1 text-sm text-gray-500">
              No shipments are currently assigned to this driver.
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
   INFO ROW
========================= */

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-gray-400">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-sm font-semibold text-gray-800">
        {value}
      </span>
    </div>
  );
}

/* =========================
   CONTACT ITEM
========================= */

function ContactItem({
  icon: Icon,
  label,
  value,
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
   DRIVER STATUS
========================= */

function DriverStatus({ status }) {
  const styles = {
    Available: "bg-emerald-50 text-emerald-600",
    "On Duty": "bg-blue-50 text-blue-600",
    "On Leave": "bg-amber-50 text-amber-600",
    "Off Duty": "bg-gray-100 text-gray-600",
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
          <FiUser size={28} />
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
          Back to Drivers
        </button>
      </div>
    </div>
  );
}

export default DriverDetails;