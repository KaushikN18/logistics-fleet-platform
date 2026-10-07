import {
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

const statusSteps = [
  {
    title: "Shipment Created",
    description: "Shipment was created successfully",
    time: "05 Oct 2026, 09:15 AM",
    icon: FiPackage,
    completed: true,
  },
  {
    title: "Pickup Completed",
    description: "Package picked up from origin",
    time: "05 Oct 2026, 11:30 AM",
    icon: FiMapPin,
    completed: true,
  },
  {
    title: "In Transit",
    description: "Vehicle is currently moving toward destination",
    time: "05 Oct 2026, 12:10 PM",
    icon: FiTruck,
    completed: true,
  },
  {
    title: "Out for Delivery",
    description: "Shipment will be delivered soon",
    time: "Expected today",
    icon: FiClock,
    completed: false,
  },
  {
    title: "Delivered",
    description: "Shipment delivered to customer",
    time: "Pending",
    icon: FiCheckCircle,
    completed: false,
  },
];

function ShipmentTimeline() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-semibold text-gray-900">
          Shipment Status History
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Track the shipment journey from pickup to delivery.
        </p>
      </div>

      <div className="mt-6">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;

          const isLast =
            index === statusSteps.length - 1;

          return (
            <div
              key={step.title}
              className="relative flex gap-4"
            >
              {!isLast && (
                <div
                  className={`absolute left-[18px] top-10 h-[calc(100%-4px)] w-px ${
                    step.completed
                      ? "bg-blue-200"
                      : "bg-gray-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  step.completed
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={16} />
              </div>

              <div className="pb-7">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <h3
                    className={`text-sm font-semibold ${
                      step.completed
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <span className="text-[11px] text-gray-400">
                    {step.time}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShipmentTimeline;