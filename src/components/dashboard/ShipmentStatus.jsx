import {
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
} from "react-icons/fi";

const shipmentStatus = [
  {
    label: "Delivered",
    value: 68,
    count: 286,
    icon: FiCheckCircle,
    color: "emerald",
    width: "68%",
  },
  {
    label: "In Transit",
    value: 24,
    count: 101,
    icon: FiTruck,
    color: "blue",
    width: "24%",
  },
  {
    label: "Delayed",
    value: 8,
    count: 34,
    icon: FiAlertCircle,
    color: "red",
    width: "8%",
  },
];

function ShipmentStatus() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-semibold text-gray-900">
          Shipment Status
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Current shipment distribution
        </p>
      </div>

      {/* Overall Progress */}
      <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className="bg-emerald-500"
          style={{ width: "68%" }}
        />

        <div
          className="bg-blue-500"
          style={{ width: "24%" }}
        />

        <div
          className="bg-red-500"
          style={{ width: "8%" }}
        />
      </div>

      {/* Status Items */}
      <div className="mt-6 space-y-5">
        {shipmentStatus.map((status) => {
          const Icon = status.icon;

          const iconClasses = {
            emerald: "bg-emerald-50 text-emerald-600",
            blue: "bg-blue-50 text-blue-600",
            red: "bg-red-50 text-red-600",
          };

          return (
            <div key={status.label}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClasses[status.color]}`}
                  >
                    <Icon size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {status.label}
                    </p>

                    <p className="text-xs text-gray-400">
                      {status.count} shipments
                    </p>
                  </div>
                </div>

                <span className="text-sm font-semibold text-gray-800">
                  {status.value}%
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${
                    status.color === "emerald"
                      ? "bg-emerald-500"
                      : status.color === "blue"
                        ? "bg-blue-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: status.width,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShipmentStatus;