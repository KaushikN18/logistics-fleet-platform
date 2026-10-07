import {
  FiTruck,
  FiUser,
  FiMapPin,
  FiNavigation,
  FiDroplet,
} from "react-icons/fi";

import TrackingStatus from "./TrackingStatus";

function TrackingVehicleCard({
  vehicle,
  isSelected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        isSelected
          ? "border-blue-400 bg-blue-50/50 shadow-sm"
          : "border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <FiTruck size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {vehicle.id}
            </p>

            <p className="text-xs text-gray-500">
              {vehicle.vehicleName}
            </p>
          </div>
        </div>

        <TrackingStatus status={vehicle.status} />
      </div>

      {/* Vehicle information */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] text-gray-400">
            Driver
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
            <FiUser size={12} />
            {vehicle.driver}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-gray-400">
            Location
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
            <FiMapPin size={12} />
            {vehicle.location}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-gray-400">
            Speed
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
            <FiNavigation size={12} />
            {vehicle.speed}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-gray-400">
            Fuel
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
            <FiDroplet size={12} />
            {vehicle.fuel}%
          </p>
        </div>
      </div>

      {/* Destination */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Destination
          </span>

          <span className="text-xs font-semibold text-gray-700">
            {vehicle.destination}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            ETA
          </span>

          <span className="text-xs font-semibold text-blue-600">
            {vehicle.eta}
          </span>
        </div>
      </div>
    </button>
  );
}

export default TrackingVehicleCard;