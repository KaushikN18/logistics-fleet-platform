import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiCalendar,
  FiMapPin,
  FiTruck,
  FiStar,
  FiPackage,
} from "react-icons/fi";

import DriverStatus from "./DriverStatus";

function DriverDetails({ driver, onClose }) {
  if (!driver) return null;

  const completionRate =
    driver.deliveries > 0
      ? Math.round(
          (driver.completedDeliveries /
            driver.deliveries) *
            100
        )
      : 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FiUser size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Driver Details
              </h2>

              <p className="text-xs text-gray-500">
                {driver.id}
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
          {/* Profile */}
          <div className="rounded-2xl bg-gray-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  {driver.name.charAt(0)}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {driver.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {driver.experience} experience
                  </p>
                </div>
              </div>

              <DriverStatus status={driver.status} />
            </div>
          </div>

          {/* Contact */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiPhone size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {driver.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <FiMail size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                    {driver.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <FiCreditCard size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    License Number
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {driver.licenseNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <FiCalendar size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    License Expiry
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {driver.licenseExpiry}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FiTruck size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Assigned Vehicle
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {driver.assignedVehicle}
                  </p>

                  <p className="text-xs text-gray-400">
                    {driver.vehicleName}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FiMapPin size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Current Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {driver.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="mt-5 rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiPackage size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Delivery Performance
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Driver delivery statistics
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xl font-bold text-gray-900">
                  {driver.deliveries}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  Total
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <p className="text-xl font-bold text-emerald-600">
                  {driver.completedDeliveries}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  Completed
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-center">
                <p className="text-xl font-bold text-blue-600">
                  {completionRate}%
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  Success Rate
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <FiStar
                  size={18}
                  className="text-amber-500"
                />

                <span className="text-sm font-semibold text-gray-700">
                  Driver Rating
                </span>
              </div>

              <span className="text-sm font-bold text-gray-900">
                {driver.rating || "N/A"} / 5
              </span>
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

export default DriverDetails;