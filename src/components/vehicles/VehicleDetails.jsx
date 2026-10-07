import {
  FiX,
  FiTruck,
  FiUser,
  FiMapPin,
  FiDroplet,
  FiCalendar,
  FiActivity,
  FiHash,
} from "react-icons/fi";

import VehicleStatus from "./VehicleStatus";

function VehicleDetails({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiTruck size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Vehicle Details
              </h2>

              <p className="text-xs text-gray-500">
                {vehicle.id} · {vehicle.registrationNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {/* Vehicle overview */}
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Vehicle
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {vehicle.vehicleName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {vehicle.model} · {vehicle.year}
                </p>
              </div>

              <VehicleStatus status={vehicle.status} />
            </div>
          </div>

          {/* Information grid */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiHash size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Vehicle ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {vehicle.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <FiTruck size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Registration
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {vehicle.registrationNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FiUser size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Assigned Driver
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {vehicle.driver}
                  </p>

                  <p className="text-xs text-gray-400">
                    {vehicle.driverId}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <FiMapPin size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Current Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {vehicle.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  <FiActivity size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">
                      Fuel Level
                    </p>

                    <p className="text-sm font-semibold text-gray-800">
                      {vehicle.fuelLevel}%
                    </p>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        vehicle.fuelLevel > 60
                          ? "bg-emerald-500"
                          : vehicle.fuelLevel > 30
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${vehicle.fuelLevel}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <FiTruck size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Mileage
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {vehicle.mileage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="mt-5 rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FiCalendar size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Maintenance
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Vehicle maintenance schedule
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">
                  Last Maintenance
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {vehicle.lastMaintenance}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">
                  Next Maintenance
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {vehicle.nextMaintenance}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;