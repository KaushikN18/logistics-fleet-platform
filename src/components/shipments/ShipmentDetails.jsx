import {
  FiX,
  FiPackage,
  FiUser,
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiBox,
} from "react-icons/fi";

import ShipmentStatus from "./ShipmentStatus";

function ShipmentDetails({
  shipment,
  onClose,
}) {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiPackage size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Shipment Details
              </h2>

              <p className="text-xs text-gray-500">
                {shipment.id}
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
          {/* Top section */}
          <div className="rounded-2xl bg-gray-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Customer
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {shipment.customer}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                  <FiPhone size={13} />
                  {shipment.customerPhone}
                </p>
              </div>

              <ShipmentStatus
                status={shipment.status}
              />
            </div>
          </div>

          {/* Route */}
          <div className="mt-5 rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiMapPin size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Shipment Route
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Pickup and delivery locations
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs text-blue-500">
                  Pickup
                </p>

                <p className="mt-1 text-sm font-bold text-gray-800">
                  {shipment.pickupLocation}
                </p>

                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <FiCalendar size={12} />
                  {shipment.pickupDate}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-emerald-600">
                  Delivery
                </p>

                <p className="mt-1 text-sm font-bold text-gray-800">
                  {shipment.deliveryLocation}
                </p>

                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <FiCalendar size={12} />
                  {shipment.deliveryDate}
                </p>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <FiUser size={17} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Assigned Driver
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {shipment.driver}
                  </p>

                  <p className="text-xs text-gray-400">
                    {shipment.driverId}
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
                    {shipment.vehicle}
                  </p>

                  <p className="text-xs text-gray-400">
                    {shipment.vehicleName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Package information */}
          <div className="mt-5 rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <FiBox size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Package Information
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Shipment package details
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xl font-bold text-gray-900">
                  {shipment.packageCount}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  Packages
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-lg font-bold text-gray-900">
                  {shipment.weight}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  Weight
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-sm font-bold text-gray-900">
                  {shipment.priority}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  Priority
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-center">
                <p className="text-sm font-bold text-blue-700">
                  {shipment.eta}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  ETA
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

export default ShipmentDetails;