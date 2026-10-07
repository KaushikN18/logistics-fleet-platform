import {
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiNavigation,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

function ShipmentDetails() {
  const navigate = useNavigate();
  const { shipmentId } = useParams();

  const {
    shipmentList,
    driverList,
    vehicleList,
  } = useApp();

  const shipment = shipmentList.find(
    (item) => item.id === shipmentId
  );

  if (!shipment) {
    return (
      <NotFound
        title="Shipment Not Found"
        message="The shipment you are looking for does not exist or has been removed."
        onBack={() => navigate("/shipments")}
      />
    );
  }

  const driver = driverList.find(
    (item) =>
      item.id === shipment.driverId ||
      item.name === shipment.driver
  );

  const vehicle = vehicleList.find(
    (item) =>
      item.id === shipment.vehicleId ||
      item.registrationNumber === shipment.vehicle
  );

  const statusSteps = [
    {
      label: "Pending",
      icon: FiClock,
    },
    {
      label: "In Transit",
      icon: FiNavigation,
    },
    {
      label: "Out for Delivery",
      icon: FiTruck,
    },
    {
      label: "Delivered",
      icon: FiCheckCircle,
    },
  ];

  const currentStepIndex =
    shipment.status === "Delayed"
      ? 1
      : statusSteps.findIndex(
          (step) => step.label === shipment.status
        );

  const progressIndex =
    currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="space-y-6">
      {/* BACK BUTTON */}
      <button
        type="button"
        onClick={() => navigate("/shipments")}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        <FiArrowLeft size={17} />
        Back to Shipments
      </button>

      {/* HEADER */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiPackage size={26} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-600">
                Shipment Details
              </p>

              <h1 className="mt-1 truncate text-2xl font-bold text-gray-900 sm:text-3xl">
                {shipment.id}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {shipment.customer || "Customer not available"}
              </p>
            </div>
          </div>

          <ShipmentStatus status={shipment.status} />
        </div>
      </div>

      {/* TOP INFORMATION */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* ROUTE */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
          <SectionTitle
            icon={FiMapPin}
            title="Shipment Route"
          />

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <LocationCard
              type="Pickup"
              location={shipment.pickupLocation}
              color="blue"
            />

            <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FiNavigation size={20} />
            </div>

            <div className="flex items-center justify-center md:hidden">
              <div className="h-8 border-l border-dashed border-gray-300" />
            </div>

            <LocationCard
              type="Delivery"
              location={shipment.deliveryLocation}
              color="red"
            />
          </div>
        </div>

        {/* DATE */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={FiCalendar}
            title="Shipment Information"
          />

          <div className="mt-6 space-y-4">
            <InfoRow
              label="Shipment ID"
              value={shipment.id}
            />

            <InfoRow
              label="Customer"
              value={shipment.customer || "—"}
            />

            <InfoRow
              label="Shipment Date"
              value={
                shipment.date ||
                shipment.createdAt ||
                "—"
              }
            />

            <InfoRow
              label="Status"
              value={shipment.status || "Unknown"}
            />
          </div>
        </div>
      </div>

      {/* ASSIGNMENTS */}
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
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500">
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
            <EmptyAssignment
              icon={FiUser}
              text="No driver assigned"
            />
          )}
        </div>

        {/* VEHICLE */}
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

                <p className="mt-1 text-xs font-medium text-gray-500">
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
            <EmptyAssignment
              icon={FiTruck}
              text="No vehicle assigned"
            />
          )}
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Shipment Status"
          value={shipment.status || "Pending"}
          icon={FiPackage}
          iconClass="bg-blue-50 text-blue-600"
        />

        <MetricCard
          label="Driver"
          value={driver?.name || "Unassigned"}
          icon={FiUser}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          label="Vehicle"
          value={
            vehicle?.registrationNumber ||
            shipment.vehicle ||
            "Unassigned"
          }
          icon={FiTruck}
          iconClass="bg-violet-50 text-violet-600"
        />

        <MetricCard
          label="Delivery"
          value={
            shipment.deliveryLocation || "—"
          }
          icon={FiMapPin}
          iconClass="bg-orange-50 text-orange-600"
        />
      </div>

      {/* PROGRESS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle
          icon={FiNavigation}
          title="Shipment Progress"
        />

        <div className="mt-8">
          <div className="relative">
            <div className="absolute left-5 right-5 top-5 hidden h-0.5 bg-gray-200 md:block" />

            <div
              className="absolute left-5 top-5 hidden h-0.5 bg-blue-500 transition-all md:block"
              style={{
                width: `${Math.min(
                  progressIndex / (statusSteps.length - 1),
                  1
                ) * 100}%`,
              }}
            />

            <div className="relative grid gap-6 md:grid-cols-4">
              {statusSteps.map(
                (step, index) => {
                  const Icon = step.icon;

                  const completed =
                    index <= progressIndex;

                  return (
                    <div
                      key={step.label}
                      className="flex items-center gap-3 md:flex-col md:text-center"
                    >
                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                          completed
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            completed
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>

                        {index === progressIndex && (
                          <p className="mt-0.5 text-xs text-blue-600">
                            Current status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {shipment.status === "Delayed" && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <FiClock
                size={18}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Shipment Delayed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  This shipment is currently delayed.
                  Please check the tracking information
                  and delivery route.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVITY / TIMELINE */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle
          icon={FiClock}
          title="Shipment Timeline"
        />

        <div className="mt-6">
          <ShipmentTimeline
            shipment={shipment}
            progressIndex={progressIndex}
          />
        </div>
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
   LOCATION CARD
========================= */

function LocationCard({
  type,
  location,
  color,
}) {
  const isBlue = color === "blue";

  return (
    <div
      className={`rounded-xl border p-4 ${
        isBlue
          ? "border-blue-100 bg-blue-50/50"
          : "border-red-100 bg-red-50/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isBlue
              ? "bg-blue-100 text-blue-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          <FiMapPin size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-400">
            {type}
          </p>

          <p className="mt-1 break-words text-sm font-bold text-gray-800">
            {location || "Location unavailable"}
          </p>
        </div>
      </div>
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
   TIMELINE
========================= */

function ShipmentTimeline({
  shipment,
  progressIndex,
}) {
  const timeline = [
    {
      title: "Shipment Created",
      description: `Shipment ${shipment.id} was created.`,
      icon: FiPackage,
    },
    {
      title: "In Transit",
      description: "Shipment has started moving to the destination.",
      icon: FiNavigation,
    },
    {
      title: "Out for Delivery",
      description: "Shipment is out for final delivery.",
      icon: FiTruck,
    },
    {
      title: "Delivered",
      description: "Shipment has been successfully delivered.",
      icon: FiCheckCircle,
    },
  ];

  return (
    <div className="space-y-0">
      {timeline.map((item, index) => {
        const Icon = item.icon;
        const completed = index <= progressIndex;
        const isLast = index === timeline.length - 1;

        return (
          <div
            key={item.title}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  completed
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={15} />
              </div>

              {!isLast && (
                <div
                  className={`my-1 h-10 w-px ${
                    index < progressIndex
                      ? "bg-blue-400"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            <div className="pb-7">
              <p
                className={`text-sm font-semibold ${
                  completed
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {item.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {item.description}
              </p>

              {index === 0 && shipment.date && (
                <p className="mt-1 text-[11px] text-gray-400">
                  {shipment.date}
                </p>
              )}

              {index === progressIndex && (
                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                  Current
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================
   STATUS
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
   EMPTY ASSIGNMENT
========================= */

function EmptyAssignment({
  icon: Icon,
  text,
}) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        <Icon size={18} />
      </div>

      <p className="text-sm text-gray-500">
        {text}
      </p>
    </div>
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
          <FiPackage size={28} />
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
          Back to Shipments
        </button>
      </div>
    </div>
  );
}

export default ShipmentDetails;